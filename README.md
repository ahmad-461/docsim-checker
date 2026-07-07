# DocSim Checker

A document similarity checker MVP that compares two documents (pasted text or uploaded files) and provides a similarity score with matching sentences highlighted.

## Tech Stack
- **Frontend:** Next.js 15+ (React 19), Tailwind CSS 4
- **Backend:** Python 3.9+ (Flask) - optimized for Vercel Serverless Functions
- **AI/ML:**
  - `scikit-learn` (TF-IDF + Cosine Similarity)
  - `google-genai` (Gemini `text-embedding-004` for semantic matching)
- **Database:** Supabase (PostgreSQL) for rate limiting and usage logs

## Key Features
- **File Support:** Handles `.txt`, `.pdf`, and `.docx` uploads (up to 2MB).
- **Hybrid Similarity:** Combines TF-IDF (keyword matching) with Gemini Embeddings (semantic matching) for high accuracy.
- **Side-by-Side View:** Visual comparison with match strength highlighting.
- **Mobile Responsive:** Fully functional on mobile, tablet, and desktop screens.
- **PDF Reports:** Downloadable similarity reports using `jspdf` and `html2canvas`.
- **Rate Limiting:** IP-based daily limits (3 free comparisons/day) managed via Supabase.
- **Accessibility:** ARIA-compliant inputs and high-contrast match indicators.

## Prerequisites
- Node.js (v18+)
- Python 3.9+
- A Supabase account and project
- A Google Gemini API Key

## Setup Instructions

### 1. Supabase Configuration
Run the following SQL in your Supabase SQL Editor to initialize the database:
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

### 2. Environment Variables
Create an `api/.env` file (or set these in Vercel):
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
IP_HASH_SALT=a_random_secret_string_for_hashing_ips
GEMINI_API_KEY=your_google_gemini_api_key
ENABLE_SEMANTIC_SIMILARITY=true
TFIDF_WEIGHT=0.4
SEMANTIC_WEIGHT=0.6
```

### 3. Local Installation

**Backend:**
```bash
cd api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python compare.py
```
*Backend runs on `http://127.0.0.1:5000`*

**Frontend:**
```bash
# In the root directory
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

## Deployment

### Vercel
1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add the environment variables from step 2 to your Vercel Project Settings.
4. Vercel will automatically deploy the Next.js app and the Flask backend (via the `/api` directory).

## Implementation Notes
- **Sentence Splitting:** Uses regex to split on `.`, `!`, and `?`.
- **Normalization:** Lowercases and trims text for TF-IDF; preserves casing for Gemini to maintain semantic context.
- **Graceful Fallback:** If the Gemini API is unreachable or disabled, the system automatically falls back to TF-IDF matching only.
- **Highlighting:** Sentence background colors scale from transparent (0%) to deep orange (100% match) with a maximum opacity of 0.8 to ensure text readability.
