import re
import io
import json
import base64
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from rate_limiter import RateLimiter
import pdfplumber
from docx import Document
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from semantic_similarity import get_semantic_similarity_scores

app = Flask(__name__)
CORS(app)

limiter = RateLimiter()

def extract_text(file_content, filename):
    """Extracts text from different file types."""
    try:
        if filename.endswith('.txt'):
            return file_content.decode('utf-8')
        elif filename.endswith('.pdf'):
            with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                return "\n".join(page.extract_text() or "" for page in pdf.pages)
        elif filename.endswith('.docx'):
            doc = Document(io.BytesIO(file_content))
            return "\n".join(paragraph.text for paragraph in doc.paragraphs)
        else:
            return None
    except Exception as e:
        print(f"Extraction error: {e}")
        return None

def split_sentences(text):
    """Splits text into sentences using simple regex."""
    # Simple punctuation-based split (. ! ?)
    # NOTE: Known limitation - doesn't handle abbreviations like Mr., Dr., etc.
    sentences = re.split(r'(?<=[.!?])\s+', text)
    return [s.strip() for s in sentences if s.strip()]

def normalize_text(text):
    """Normalizes text by stripping excess whitespace and lowercasing."""
    return re.sub(r'\s+', ' ', text).strip().lower()

@app.route('/api/compare', methods=['POST'])
def compare_documents():
    # Rate Limiting
    forwarded = request.headers.get('x-forwarded-for')
    if forwarded:
        client_ip = forwarded.split(',')[0].strip()
    else:
        client_ip = request.remote_addr or "unknown"

    allowed, remaining, reset_at = limiter.check_and_increment(client_ip)

    if not allowed:
        return jsonify({
            "error": "rate_limit_exceeded",
            "message": "You've used all your free comparisons for today.",
            "reset_at": reset_at,
            "remaining": 0
        }), 429

    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    doc_a_raw = data.get('doc_a')
    doc_b_raw = data.get('doc_b')

    # Each doc can be {"type": "text", "content": "..."} or {"type": "file", "content": "base64...", "filename": "..."}

    def get_content(doc_input):
        if not doc_input:
            return ""
        if doc_input.get('type') == 'text':
            return doc_input.get('content', '')
        elif doc_input.get('type') == 'file':
            try:
                content_b64 = doc_input.get('content', '')
                filename = doc_input.get('filename', '')
                file_content = base64.b64decode(content_b64)
                extracted = extract_text(file_content, filename)
                if extracted is None:
                    raise ValueError(f"Failed to extract text from {filename}")
                return extracted
            except Exception as e:
                raise ValueError(str(e))
        return ""

    try:
        text_a = get_content(doc_a_raw)
        text_b = get_content(doc_b_raw)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    if not text_a.strip() or not text_b.strip():
        return jsonify({
            "error": "extraction_failed",
            "message": "Couldn't extract any text from this file. It may be a scanned image or contain no readable text — try a different file or paste the text directly."
        }), 400

    sentences_a_raw = split_sentences(text_a)
    sentences_b_raw = split_sentences(text_b)

    if not sentences_a_raw or not sentences_b_raw:
        return jsonify({
            "error": "extraction_failed",
            "message": "Couldn't extract any text from this file. It may be a scanned image or contain no readable text — try a different file or paste the text directly."
        }), 400

    # Normalize for vectorization
    sentences_a_norm = [normalize_text(s) for s in sentences_a_raw]
    sentences_b_norm = [normalize_text(s) for s in sentences_b_raw]

    # Weights and feature flags
    enable_semantic = os.getenv('ENABLE_SEMANTIC_SIMILARITY', 'true').lower() == 'true'
    gemini_api_key = os.getenv('GEMINI_API_KEY')
    tfidf_weight = float(os.getenv('TFIDF_WEIGHT', 0.4))
    semantic_weight = float(os.getenv('SEMANTIC_WEIGHT', 0.6))

    # Vectorize (TF-IDF)
    vectorizer = TfidfVectorizer()
    try:
        all_sentences = sentences_a_norm + sentences_b_norm
        tfidf_matrix = vectorizer.fit_transform(all_sentences)

        matrix_a = tfidf_matrix[:len(sentences_a_norm)]
        matrix_b = tfidf_matrix[len(sentences_a_norm):]

        # Cosine similarity (TF-IDF)
        sim_matrix_tfidf = cosine_similarity(matrix_a, matrix_b)
        best_matches_a_tfidf = np.max(sim_matrix_tfidf, axis=1)
        best_matches_b_tfidf = np.max(sim_matrix_tfidf, axis=0)

        method = "tfidf_only"
        best_matches_a = best_matches_a_tfidf
        best_matches_b = best_matches_b_tfidf

        # Try Semantic Similarity (Gemini)
        if enable_semantic and gemini_api_key:
            try:
                best_matches_a_semantic, best_matches_b_semantic = get_semantic_similarity_scores(
                    sentences_a_raw,
                    sentences_b_raw,
                    gemini_api_key
                )

                # Blend scores
                # Formula: blended_score = (tfidf_weight * tfidf_score) + (semantic_weight * semantic_score)
                best_matches_a = (tfidf_weight * best_matches_a_tfidf) + (semantic_weight * best_matches_a_semantic)
                best_matches_b = (tfidf_weight * best_matches_b_tfidf) + (semantic_weight * best_matches_b_semantic)
                method = "blended"
            except Exception as semantic_err:
                print(f"Fallback to TF-IDF only: Gemini failed - {semantic_err}")
                method = "tfidf_only"

        # Response construction
        res_sentences_a = []
        for i, text in enumerate(sentences_a_raw):
            res_sentences_a.append({"text": text, "match_score": float(best_matches_a[i])})

        res_sentences_b = []
        for i, text in enumerate(sentences_b_raw):
            res_sentences_b.append({"text": text, "match_score": float(best_matches_b[i])})

        # Unified overall similarity: weighted average of best match scores
        # Formula: (sum(score_i * len_i) for i in A + B) / (sum(len_i) for i in A + B)
        def compute_weighted_avg(sentences, scores):
            total_score = 0
            total_weight = 0
            for s, score in zip(sentences, scores):
                weight = len(s)
                total_score += score * weight
                total_weight += weight
            return total_score, total_weight

        sum_score_a, weight_a = compute_weighted_avg(sentences_a_raw, best_matches_a)
        sum_score_b, weight_b = compute_weighted_avg(sentences_b_raw, best_matches_b)

        overall_similarity = ((sum_score_a + sum_score_b) / (weight_a + weight_b)) * 100

        return jsonify({
            "overall_similarity": round(float(overall_similarity), 2),
            "method": method,
            "sentences_a": res_sentences_a,
            "sentences_b": res_sentences_b,
            "remaining": remaining
        })

    except Exception as e:
        return jsonify({"error": f"Similarity computation failed: {str(e)}"}), 500

# For Vercel, we need to export the app or use a handler.
# Vercel's Python runtime can handle Flask apps if we name the entry point appropriately.
# However, usually for simple functions it's handler(request).
# Let's keep it as a Flask app for local testing and Vercel compatibility via 'app'.

if __name__ == '__main__':
    app.run(port=5000, debug=True)
