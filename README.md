# DocSim Checker

A functional MVP of a document similarity checker. Compare two documents (pasted text or uploaded files) and see a similarity score with matching sentences highlighted.

## Tech Stack
- **Frontend:** Next.js (React), Tailwind CSS
- **Backend:** Python (Flask) - designed for Vercel Python runtime
- **Libraries:**
  - `pdfplumber` (PDF extraction)
  - `python-docx` (DOCX extraction)
  - `scikit-learn` (TF-IDF + cosine similarity)
  - `numpy` (Numerical computations)

## Key Features
- Supports `.txt`, `.pdf`, and `.docx` file uploads.
- Direct text paste support.
- Client-side validation for file type and size (max 2MB).
- Side-by-side comparison with match strength highlighting.
- **Downloadable PDF Reports:** Generate detailed similarity reports including highlights and overall scores.
- Mobile-responsive layout.
- **Rate Limiting:** Anonymous users are limited to 3 comparisons per day based on their IP address (hashed for privacy).

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.9+

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd docsim-checker
   ```

2. **Setup the Backend:**
   It is recommended to use a virtual environment.
   ```bash
   cd api
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python compare.py
   ```
   the backend will run on `http://127.0.0.1:5000`.

3. **Setup the Frontend:**
   Open a new terminal in the root directory.
   ```bash
   npm install
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`.

### Rate Limiting Setup (Supabase)

This project uses Supabase for tracking daily usage.

1. **Create a Supabase Project:** Go to [supabase.com](https://supabase.com) and create a new project.
2. **Database Schema:** Run the following SQL in the Supabase SQL Editor to create the `usage_log` table:
   ```sql
   create table usage_log (
     id uuid primary key default gen_random_uuid(),
     identifier text not null,
     usage_date date not null,
     count integer not null default 0,
    user_tier text not null default 'free',
     created_at timestamp with time zone default now(),
     unique (identifier, usage_date)
   );
   ```

  **Phase 4A Update:** If you already have the table, run:
  ```sql
  alter table usage_log add column user_tier text not null default 'free';
  ```
3. **Environment Variables:**
   - In `api/.env` (for the Python backend):
     ```
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_SERVICE_KEY=your_supabase_service_role_key
     IP_HASH_SALT=your_random_secret_salt
     GEMINI_API_KEY=your_gemini_api_key
     ENABLE_SEMANTIC_SIMILARITY=true
     TFIDF_WEIGHT=0.4
     SEMANTIC_WEIGHT=0.6
     ```
   - In Vercel, add these same variables to your project settings.

### Deployment on Vercel

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. Vercel will automatically detect the Next.js frontend and the Python functions in the `/api` directory.
4. Ensure the environment is correctly set up (Vercel handles `requirements.txt` automatically for Python functions).

## Implementation Details
- **Sentence Splitting:** Uses a regex-based split on punctuation (`.`, `!`, `?`).
- **Similarity Formula:** Computes a weighted average of the best-match scores for every sentence in both documents. Weights are determined by sentence length.
- **Blended Scoring:** Combines TF-IDF and Gemini semantic embeddings (using `text-embedding-004`).
- **Graceful Fallback:** If the Gemini API is unavailable or disabled, the system automatically falls back to TF-IDF-only matching.
- **Normalization:** Text is normalized (lowercase, stripped whitespace) for TF-IDF, while raw sentences are used for Gemini embeddings to preserve semantic context.

## Known Limitations
- Sentence splitting does not handle abbreviations (e.g., "Mr.", "Dr.").
- Large documents may take longer to process (target: < 5 seconds for documents under 5,000 words).
