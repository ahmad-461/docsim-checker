import os
from google import genai
from google.genai import types
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

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
        tuple: (best_matches_a, best_matches_b) as numpy arrays.
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

        return np.array(embeddings)

    try:
        all_embeddings = fetch_embeddings(all_sentences)

        embeddings_a = all_embeddings[:len(sentences_a)]
        embeddings_b = all_embeddings[len(sentences_a):]

        # Compute cosine similarity between all A and all B
        sim_matrix = cosine_similarity(embeddings_a, embeddings_b)

        # For each sentence in A, find best match in B
        best_matches_a = np.max(sim_matrix, axis=1)
        # For each sentence in B, find best match in A
        best_matches_b = np.max(sim_matrix, axis=0)

        return best_matches_a, best_matches_b

    except Exception as e:
        print(f"Gemini Semantic Similarity Error: {e}")
        raise
