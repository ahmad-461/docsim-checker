import re
import io
import json
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
from docx import Document
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = Flask(__name__)
CORS(app)

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

    if not text_a or not text_b:
        return jsonify({"error": "Both documents must have content"}), 400

    sentences_a_raw = split_sentences(text_a)
    sentences_b_raw = split_sentences(text_b)

    if not sentences_a_raw or not sentences_b_raw:
        return jsonify({"error": "Could not identify sentences in one or both documents"}), 400

    # Normalize for vectorization
    sentences_a_norm = [normalize_text(s) for s in sentences_a_raw]
    sentences_b_norm = [normalize_text(s) for s in sentences_b_raw]

    # Vectorize
    vectorizer = TfidfVectorizer()
    try:
        all_sentences = sentences_a_norm + sentences_b_norm
        tfidf_matrix = vectorizer.fit_transform(all_sentences)

        matrix_a = tfidf_matrix[:len(sentences_a_norm)]
        matrix_b = tfidf_matrix[len(sentences_a_norm):]

        # Cosine similarity between all A and all B
        sim_matrix = cosine_similarity(matrix_a, matrix_b)

        # For each sentence in A, find best match in B
        best_matches_a = np.max(sim_matrix, axis=1)
        # For each sentence in B, find best match in A
        best_matches_b = np.max(sim_matrix, axis=0)

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
            "sentences_a": res_sentences_a,
            "sentences_b": res_sentences_b
        })

    except Exception as e:
        return jsonify({"error": f"Similarity computation failed: {str(e)}"}), 500

# For Vercel, we need to export the app or use a handler.
# Vercel's Python runtime can handle Flask apps if we name the entry point appropriately.
# However, usually for simple functions it's handler(request).
# Let's keep it as a Flask app for local testing and Vercel compatibility via 'app'.

if __name__ == '__main__':
    app.run(port=5000, debug=True)
