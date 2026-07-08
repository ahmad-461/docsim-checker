"use client";

import React, { useState } from 'react';
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
    <div className="bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-6xl mb-6">
            Compare Documents. <br className="hidden sm:block" />
            Catch Similarities. <span className="text-orange-600">Instantly.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 dark:text-stone-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Free, private, and fast — paste or upload two documents and get a detailed similarity breakdown in seconds. No sign-up required.
          </p>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12 text-sm font-medium text-gray-600 dark:text-stone-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              No documents stored
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Results in seconds
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              3 free comparisons daily
            </div>
          </div>
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
          {remaining !== null && (
            <p className="mb-4 text-sm font-medium text-gray-600 dark:text-stone-400">
              {remaining} free comparison{remaining !== 1 ? 's' : ''} left today
            </p>
          )}

          <button
            onClick={handleCompare}
            disabled={loading || isRateLimited}
            className={`flex items-center justify-center gap-3 px-10 py-5 bg-orange-600 text-white rounded-full font-bold text-xl shadow-xl hover:bg-orange-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-orange-600/20`}
          >
            {loading && (
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Analyzing...' : 'Compare Documents'}
          </button>

          {error && (
            <ErrorMessage
              message={isRateLimited ? "You've used your 3 free comparisons today. Pro coming soon — check back later or wait for reset." : error.message}
              type={error.type as any}
            >
              {isRateLimited && (
                <div className="mt-2 text-orange-700 dark:text-orange-300 font-semibold">
                  Next free use available in: <CountdownTimer resetAt={error.resetAt!} onFinish={() => setError(null)} />
                </div>
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
    </div>
  );
}
