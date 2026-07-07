"use client";

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DocumentInput from './components/DocumentInput';
import Results from './components/Results';
import CountdownTimer from './components/CountdownTimer';
import ErrorMessage from './components/ErrorMessage';

interface Sentence {
  text: string;
  match_score: number;
}

interface ComparisonResult {
  overall_similarity: number;
  method: 'blended' | 'tfidf_only';
  sentences_a: Sentence[];
  sentences_b: Sentence[];
  remaining?: number;
}

interface DocContent {
  type: 'text' | 'file';
  content: string;
  filename?: string;
}

export default function Home() {
  const [docA, setDocA] = useState<DocContent | null>(null);
  const [docB, setDocB] = useState<DocContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; type?: string; resetAt?: string } | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  const handleCompare = async () => {
    const isContentEmpty = (doc: DocContent | null) => {
      if (!doc) return true;
      if (doc.type === 'text') return doc.content.trim().length === 0;
      return !doc.content; // For files, content is base64
    };

    if (isContentEmpty(docA) || isContentEmpty(docB)) {
      setError({ message: "Please provide content for both documents." });
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doc_a: docA,
          doc_b: docB,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError({
            message: data.message,
            type: 'rate_limit',
            resetAt: data.reset_at
          });
          setRemaining(0);
          return;
        }
        throw new Error(data.message || data.error || 'Failed to compare documents');
      }

      setResult(data);
      if (typeof data.remaining === 'number') {
        setRemaining(data.remaining);
      }
    } catch (err: any) {
      setError({ message: err.message || 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const isRateLimited = error?.type === 'rate_limit';

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Document Similarity Checker
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Compare two documents to detect overlapping content and similarity scores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DocumentInput
            label="Document A"
            onContentChange={(content) => setDocA(content)}
          />
          <DocumentInput
            label="Document B"
            onContentChange={(content) => setDocB(content)}
          />
        </div>

        <div className="mt-12 flex flex-col items-center">
          {remaining !== null && (
            <p className="mb-4 text-sm font-medium text-gray-600">
              {remaining} free comparison{remaining !== 1 ? 's' : ''} left today
            </p>
          )}

          <button
            onClick={handleCompare}
            disabled={loading || isRateLimited}
            className={`flex items-center justify-center gap-3 px-8 py-4 bg-orange-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-orange-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Comparing...' : 'Compare Documents'}
          </button>

          {error && (
            <ErrorMessage
              message={isRateLimited ? "You've used your 3 free comparisons today. Pro coming soon — check back later or wait for reset." : error.message}
              type={error.type as any}
            >
              {isRateLimited && (
                <>
                  Next free use available in: <CountdownTimer resetAt={error.resetAt!} onFinish={() => setError(null)} />
                </>
              )}
            </ErrorMessage>
          )}
        </div>

        {result && (
          <Results
            score={result.overall_similarity}
            method={result.method}
            sentencesA={result.sentences_a}
            sentencesB={result.sentences_b}
          />
        )}
      </div>

      <footer className="mt-20 border-t border-gray-200 py-8 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} DocSim Checker MVP
      </footer>
    </main>
  );
}
