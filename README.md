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
- Mobile-responsive layout.

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

### Deployment on Vercel

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. Vercel will automatically detect the Next.js frontend and the Python functions in the `/api` directory.
4. Ensure the environment is correctly set up (Vercel handles `requirements.txt` automatically for Python functions).

## Implementation Details
- **Sentence Splitting:** Uses a regex-based split on punctuation (`.`, `!`, `?`).
- **Similarity Formula:** Computes a weighted average of the best-match scores for every sentence in both documents. Weights are determined by sentence length.
- **Normalization:** Text is normalized by stripping excess whitespace and lowercasing before comparison.

## Known Limitations
- Sentence splitting does not handle abbreviations (e.g., "Mr.", "Dr.").
- Large documents may take longer to process (target: < 5 seconds for documents under 5,000 words).
