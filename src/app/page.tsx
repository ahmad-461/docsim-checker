"use client";

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DocumentInput from './components/DocumentInput';
import Results from './components/Results';

interface Sentence {
  text: string;
  match_score: number;
}

interface ComparisonResult {
  overall_similarity: number;
  sentences_a: Sentence[];
  sentences_b: Sentence[];
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
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  const handleCompare = async () => {
    if (!docA || !docB || (!docA.content && !docB.content)) {
      setError("Please provide content for both documents.");
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
        throw new Error(data.error || 'Failed to compare documents');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
          <button
            onClick={handleCompare}
            disabled={loading}
            className={`px-8 py-4 bg-orange-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-orange-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              loading ? 'animate-pulse' : ''
            }`}
          >
            {loading ? 'Comparing...' : 'Compare Documents'}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}
        </div>

        {result && (
          <Results
            score={result.overall_similarity}
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
