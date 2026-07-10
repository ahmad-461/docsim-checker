"use client";

import React, { useState, useEffect } from 'react';
import DocumentInput from './components/DocumentInput';
import Results from './components/Results';
import CountdownTimer from './components/CountdownTimer';
import ErrorMessage from './components/ErrorMessage';
import { PageH2, PageP, PageStrong, PageLink } from './components/InfoPageLayout';
import { sampleDocA, sampleDocB, sampleResult, type ComparisonResult } from './sampleData';

interface DocContent {
  type: 'text' | 'file';
  content: string;
  filename?: string;
}

export default function Home() {
  const [docA, setDocA] = useState<DocContent>({ type: 'text', content: '' });
  const [docB, setDocB] = useState<DocContent>({ type: 'text', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; type?: string; resetAt?: string } | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isSample, setIsSample] = useState(false);

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

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');

      if (!response.ok) {
        console.error('Response failed with status:', response.status);
        if (isJson) {
          try {
            const data = await response.json();
            if (response.status === 429) {
              setError({
                message: data.message || "You've used all your free comparisons for today.",
                type: 'rate_limit',
                resetAt: data.reset_at
              });
              setRemaining(0);
              return;
            }
            throw new Error(data.message || data.error || 'Failed to compare documents');
          } catch (jsonErr) {
            console.error('Failed to parse error JSON response:', jsonErr);
            throw new Error('The server returned an unexpected response. Please try again, or try a smaller file.');
          }
        } else {
          // If response not OK and NOT JSON (e.g. Vercel HTML error page or Gateway Timeout)
          try {
            const textResponse = await response.text();
            console.error('Non-JSON error body:', textResponse.substring(0, 1000));
          } catch (textErr) {
            console.error('Failed to read non-JSON response body:', textErr);
          }
          throw new Error('The server returned an unexpected response. Please try again, or try a smaller file.');
        }
      }

      if (!isJson) {
        console.error('Response succeeded (2xx) but was not JSON. Content-Type:', contentType);
        try {
          const textResponse = await response.text();
          console.error('Non-JSON successful body:', textResponse.substring(0, 1000));
        } catch (textErr) {
          console.error('Failed to read non-JSON response body:', textErr);
        }
        throw new Error('The server returned an unexpected response. Please try again, or try a smaller file.');
      }

      // Safe JSON parsing of successful response
      let data;
      try {
        data = await response.json();
      } catch (parseErr) {
        console.error('Failed to parse successful JSON response:', parseErr);
        throw new Error('The server returned an unexpected response. Please try again, or try a smaller file.');
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

  const handleSampleCompare = () => {
    setDocA({ type: 'text', content: sampleDocA });
    setDocB({ type: 'text', content: sampleDocB });
    setResult(sampleResult);
    setIsSample(true);
    setError(null);

    // Scroll to results
    setTimeout(() => {
      const resultsSection = document.getElementById('results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleDocAChange = (content: DocContent) => {
    setDocA(content);
    setIsSample(false);
  };

  const handleDocBChange = (content: DocContent) => {
    setDocB(content);
    setIsSample(false);
  };

  const isRateLimited = error?.type === 'rate_limit';

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
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

        <div id="tool" className="scroll-mt-24">
          <div className="flex justify-center mb-8">
            <button
              onClick={handleSampleCompare}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-gray-600 dark:text-stone-300 bg-white dark:bg-stone-800 border-2 border-gray-200 dark:border-stone-700 rounded-xl hover:border-orange-500 dark:hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-500 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              Try a sample comparison
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DocumentInput
              label="Document A"
              value={docA.content}
              onContentChange={handleDocAChange}
            />
            <DocumentInput
              label="Document B"
              value={docB.content}
              onContentChange={handleDocBChange}
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
              className={`flex items-center justify-center gap-3 px-10 py-5 bg-orange-600 text-white rounded-xl font-bold text-xl shadow-xl hover:bg-orange-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-orange-600/20`}
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
        </div>
      </div>

      {result && (
        <div id="results-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 scroll-mt-24">
          <Results
            score={result.overall_similarity}
            method={result.method}
            sentencesA={result.sentences_a}
            sentencesB={result.sentences_b}
            isSample={isSample}
          />
        </div>
      )}

      {/* How It Works section */}
      <section className="py-24 bg-gray-50 dark:bg-stone-900/40 border-y border-gray-100 dark:border-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 dark:text-stone-400 max-w-2xl mx-auto">
              Compare your documents in three simple steps using our advanced analysis engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">1. Upload documents</h3>
              <p className="text-gray-600 dark:text-stone-400">
                Paste your text directly or upload .pdf, .docx, or .txt files for comparison.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">2. AI-Powered Analysis</h3>
              <p className="text-gray-600 dark:text-stone-400">
                We use semantic AI to catch paraphrased content that simple word-matching misses.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">3. Get Results</h3>
              <p className="text-gray-600 dark:text-stone-400">
                Receive a detailed similarity breakdown with highlighted matches in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why DocSim Checker section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl mb-4">Why DocSim Checker?</h2>
            <p className="text-lg text-gray-600 dark:text-stone-400 max-w-2xl mx-auto">
              Built for speed, privacy, and accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 bg-card border border-card-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-orange-600 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">Semantic Matching</h3>
              <p className="text-sm text-gray-600 dark:text-stone-400">
                Catches paraphrased content, not just exact word matches.
              </p>
            </div>

            <div className="p-8 bg-card border border-card-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-orange-600 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">Complete Privacy</h3>
              <p className="text-sm text-gray-600 dark:text-stone-400">
                Documents are never stored. Your data stays yours.
              </p>
            </div>

            <div className="p-8 bg-card border border-card-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-orange-600 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">Fast Results</h3>
              <p className="text-sm text-gray-600 dark:text-stone-400">
                Get your similarity score and breakdown in seconds.
              </p>
            </div>

            <div className="p-8 bg-card border border-card-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-orange-600 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">Multiple File Types</h3>
              <p className="text-sm text-gray-600 dark:text-stone-400">
                Supports .txt, .pdf, and .docx formats out of the box.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-8">
            Ready to compare your documents?
          </h2>
          <a
            href="#tool"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-orange-600 bg-white hover:bg-orange-50 transition-colors shadow-lg"
          >
            Try it now
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </a>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-24 bg-background border-t border-gray-100 dark:border-stone-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageH2>Why Use a Document Similarity Checker</PageH2>
          <PageP>
            Comparing two pieces of writing to see how closely they match is a task that comes up more often than people expect. Students revising drafts want to know if they&apos;ve accidentally repeated phrasing from an earlier version. Writers publishing across multiple platforms want to avoid submitting near-duplicate content. Small teams reviewing contracts, policies, or internal documentation need a fast way to spot what changed between two versions without manually reading every line. DocSim Checker was built to solve exactly this problem: a free, private, and fast way to compare two documents directly against each other.
          </PageP>
          <PageP>
            Unlike large-scale plagiarism detection platforms that check your writing against a vast index of the internet and academic papers, DocSim Checker focuses specifically on document-to-document comparison. You provide two documents — pasted text or uploaded files — and the tool tells you how similar they are, sentence by sentence, with a clear overall similarity percentage. This narrower focus makes it faster, simpler, and more private than institutional-grade tools, while still being genuinely useful for the situations most people actually run into.
          </PageP>

          <PageH2>How Document Similarity Is Calculated</PageH2>
          <PageP>
            DocSim Checker blends two different approaches to measure similarity. The first is TF-IDF (Term Frequency–Inverse Document Frequency) combined with cosine similarity, a well-established method in text analysis that measures how much vocabulary two pieces of text share, weighted by how distinctive that vocabulary is. This method is fast and effective for catching exact or near-exact wording matches.
          </PageP>
          <PageP>
            The second approach uses AI-powered semantic similarity through Google&apos;s Gemini API. Semantic analysis doesn&apos;t just look at matching words — it evaluates whether two sentences convey the same meaning, even when the wording is completely different. This is what allows DocSim Checker to catch paraphrased or reworded content that a simple word-overlap tool would miss entirely. By blending both scores, the tool balances precision (catching exact matches) with depth (catching meaning-based matches), giving a more complete picture than either method alone.
          </PageP>

          <PageH2>Who Uses a Free Document Comparison Tool</PageH2>
          <PageP>
            <PageStrong>Students</PageStrong> use similarity checkers to self-review essays, research papers, and assignments before submission — not to detect plagiarism from external sources, but to compare their own drafts against earlier versions, or to check if two sections of their own writing repeat themselves more than intended.
          </PageP>
          <PageP>
            <PageStrong>Writers and content creators</PageStrong> use this kind of tool when publishing across multiple platforms, newsletters, or clients, to avoid submitting content that overlaps too closely with something they&apos;ve already published elsewhere.
          </PageP>
          <PageP>
            <PageStrong>Small teams and businesses</PageStrong> compare contract drafts, internal policy documents, or process documentation across versions — a lightweight alternative to manually redlining every change by eye, especially useful when a formal document management system isn&apos;t in place.
          </PageP>

          <PageH2>Free Online Text Comparison — No Sign-Up Required</PageH2>
          <PageP>
            DocSim Checker is free to use, with no account or sign-up required to run a comparison. Free users get <PageLink href="/pricing">three comparisons per day</PageLink>, which resets daily, covering the vast majority of casual or occasional use cases without any cost or commitment. Documents can be pasted directly as text or uploaded as .txt, .pdf, or .docx files, up to 2MB each.
          </PageP>
          <PageP>
            Privacy is a core part of how the tool is built. Documents submitted for comparison are processed in memory to generate a similarity score and are never stored — not temporarily, not as a cache, not for any purpose beyond the single comparison request. This matters for a tool people are trusting with drafts of essays, unpublished writing, or business documents they wouldn&apos;t want stored on a third-party server indefinitely.
          </PageP>

          <PageH2>Document Similarity vs. Plagiarism Detection</PageH2>
          <PageP>
            It&apos;s worth being clear about what this tool is and isn&apos;t. Plagiarism detection services like Turnitin or Copyleaks check submitted work against enormous databases — the open web, academic journals, and previously submitted student papers — to identify whether content has been copied from an external source. DocSim Checker does not do this. It compares only the two documents you provide, directly against each other, with no external index or database involved.
          </PageP>
          <PageP>
            This makes it a poor substitute for institutional academic integrity checks, but a strong fit for the narrower, more common task of comparing two specific pieces of writing — whether that&apos;s two drafts, two versions of a contract, or two documents you suspect might overlap. If you already know which two documents you want to compare, DocSim Checker gives you a fast, free, and private answer without needing to submit anything to a larger, less transparent system.
          </PageP>

          <PageH2>Getting Started</PageH2>
          <PageP>
            Using DocSim Checker takes less than a minute: paste or upload your first document into Document A, your second into Document B, and click Compare. Within seconds, you&apos;ll see an overall similarity percentage along with a side-by-side view showing exactly which sentences matched and how strongly. No account, no credit card, and no document ever leaves your session stored anywhere.
          </PageP>
        </div>
      </section>
    </div>
  );
}
