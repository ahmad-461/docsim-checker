import os
import math
from google import genai
from google.genai import types

def normalize_vector(v):
    mag = math.sqrt(sum(x * x for x in v))
    if mag == 0:
        return v
    return [x / mag for x in v]

def get_semantic_similarity_scores(sentences_a, sentences_b, api_key, model_name="text-embedding-004", timeout=3.5):
    # Current stable text embedding model as of early 2025: text-embedding-004
    """
    Computes semantic similarity scores between two sets of sentences using Gemini API embeddings.

    Args:
        sentences_a: List of raw sentences from Document A.
        sentences_b: List of raw sentences from Document B.
        api_key: Gemini API key.
        model_name: The Gemini embedding model to use.
        timeout: Timeout in seconds for the API request.

    Returns:
        tuple: (best_matches_a, best_matches_b) as lists of floats.
    """
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set")

    client = genai.Client(api_key=api_key)

    all_sentences = sentences_a + sentences_b

    def fetch_embeddings(sentences):
        # Gemini embedding batch limit is 2048 strings per request
        batch_size = 2048
        embeddings = []
        for i in range(0, len(sentences), batch_size):
            batch = sentences[i:i + batch_size]

            # Using google-genai SDK
            # timeout is handled by http_options in the new SDK (expects seconds)
            response = client.models.embed_content(
                model=model_name,
                contents=batch,
                config=types.EmbedContentConfig(
                    task_type="SEMANTIC_SIMILARITY"
                ),
                http_options={"timeout": timeout}
            )

            for embedding in response.embeddings:
                embeddings.append(embedding.values)

        return embeddings

    try:
        all_embeddings = fetch_embeddings(all_sentences)

        embeddings_a = all_embeddings[:len(sentences_a)]
        embeddings_b = all_embeddings[len(sentences_a):]

        # Normalize the embeddings for fast cosine similarity via dot product
        norm_a = [normalize_vector(v) for v in embeddings_a]
        norm_b = [normalize_vector(v) for v in embeddings_b]

        # Compute best matches for A against B
        best_matches_a = []
        for va in norm_a:
            best_sim = 0.0
            for vb in norm_b:
                sim = sum(x * y for x, y in zip(va, vb))
                if sim > best_sim:
                    best_sim = sim
            best_matches_a.append(best_sim)

        # Compute best matches for B against A
        best_matches_b = []
        for vb in norm_b:
            best_sim = 0.0
            for va in norm_a:
                sim = sum(x * y for x, y in zip(va, vb))
                if sim > best_sim:
                    best_sim = sim
            best_matches_b.append(best_sim)

        return best_matches_a, best_matches_b

    except Exception as e:
        print(f"Gemini Semantic Similarity Error: {e}")
        raise
