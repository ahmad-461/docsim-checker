"use client";

import React, { useState } from 'react';
import DocumentInput from './components/DocumentInput';
import Results from './components/Results';
import CountdownTimer from './components/CountdownTimer';
import ErrorMessage from './components/ErrorMessage';
import { PageH2, PageP, PageStrong, PageLink } from './components/InfoPageLayout';
import { sampleDocA, sampleDocB, sampleResult, type ComparisonResult } from './sampleData';
import AnimatedHeroComparison from './components/AnimatedHeroComparison';

interface DocContent {
  type: 'text' | 'file';
  content: string;
  filename?: string;
}

const getFriendlyErrorMessage = (errorKeyOrMessage: string, serverMessage?: string): string => {
  const message = serverMessage || errorKeyOrMessage || 'An unexpected error occurred';

  switch (errorKeyOrMessage) {
    case 'rate_limit_exceeded':
      return "You've used all your free comparisons for today.";
    case 'extraction_failed':
      return "Couldn't extract text from this file. Please try another file or paste text directly.";
    case 'similarity_computation_failed':
      return "Similarity computation failed. Please try again with a smaller document.";
    case 'server_error':
      return "An unexpected server error occurred. Please try again later.";
    case 'startup_error':
    case 'startup_import_error':
      return "Server initialization error. Please contact support.";
  }

  if (message.includes('rate_limit_exceeded')) {
    return "You've used all your free comparisons for today.";
  }
  if (message.includes('extraction_failed')) {
    return "Couldn't extract text from this file. Please try another file or paste text directly.";
  }
  if (message.includes('similarity_computation_failed')) {
    return "Similarity computation failed. Please try again with a smaller document.";
  }
  if (message.includes('server_error')) {
    return "An unexpected server error occurred. Please try again later.";
  }
  if (message.includes('startup_error') || message.includes('startup_import_error')) {
    return "Server initialization error. Please contact support.";
  }

  return message.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
};

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
                message: getFriendlyErrorMessage('rate_limit_exceeded', data.message),
                type: 'rate_limit',
                resetAt: data.reset_at
              });
              setRemaining(0);
              return;
            }
            throw new Error(getFriendlyErrorMessage(data.error || '', data.message));
          } catch (jsonErr: unknown) {
            console.error('Failed to parse error JSON response:', jsonErr);
            const errMsg = jsonErr instanceof Error ? jsonErr.message : 'The server returned an unexpected response. Please try again, or try a smaller file.';
            throw new Error(errMsg);
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
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError({ message: getFriendlyErrorMessage(errMsg) });
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
      {/* Editorial / Manuscript Hero Section with Asymmetric Layout */}
      <section className="relative overflow-hidden bg-[#FBF9F6] dark:bg-[#141211] border-b border-[#E6DDC4]/60 dark:border-[#2C2420]/60 py-16 lg:py-24 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left side: Editorial Typography and Headlines */}
            <div className="lg:col-span-5 flex flex-col justify-center text-left relative">
              {/* Highlight / Redline Editorial Motif behind the main header */}
              <div className="absolute -left-4 -top-8 w-24 h-24 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100/60 dark:bg-orange-950/20 text-orange-800 dark:text-orange-400 border border-orange-200/40 dark:border-orange-900/30 rounded-full text-xs font-semibold font-mono tracking-wider uppercase mb-6 self-start">
                <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                Editorial Manuscript Standard
              </div>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1A1A1A] dark:text-[#F5F5F4] tracking-tight leading-[1.1] mb-6 font-bold">
                Compare Documents. <br />
                Catch Similarities. <br />
                <span className="relative inline-block text-orange-600 dark:text-orange-500 font-bold">
                  Instantly.
                  <span className="absolute -bottom-1.5 left-0 w-full h-[3px] bg-orange-600/60 dark:bg-orange-500/60 rounded" />
                </span>
              </h1>

              <p className="font-sans text-base sm:text-lg text-stone-600 dark:text-stone-400 mb-8 max-w-xl leading-relaxed">
                Free, private, and fast. Paste or upload two documents to reveal a detailed semantic similarity analysis in seconds. No credentials, tracking, or document indexing.
              </p>

              {/* Editorial styled Trust Marks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-[#E6DDC4] dark:border-[#3A302B] py-6 mb-8 text-xs font-mono tracking-wide text-stone-600 dark:text-stone-400">
                <div className="flex items-center gap-2">
                  <span className="text-orange-600 dark:text-orange-500 font-bold">✓</span>
                  No documents stored
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-600 dark:text-orange-500 font-bold">✓</span>
                  Results in seconds
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-600 dark:text-orange-500 font-bold">✓</span>
                  3 free comparisons daily
                </div>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#tool"
                  className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-600/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
                >
                  Start Comparing
                </a>
                <button
                  onClick={handleSampleCompare}
                  className="px-6 py-3.5 bg-transparent hover:bg-orange-50/40 dark:hover:bg-orange-950/10 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:border-orange-500 rounded-xl transition-all font-semibold text-center"
                >
                  Try Sample Comparison
                </button>
              </div>
            </div>

            {/* Right side: Animated visual centerpiece */}
            <div className="lg:col-span-7 flex justify-center lg:pl-4">
              <AnimatedHeroComparison />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
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
                type={error.type as 'rate_limit' | 'fallback' | 'error' | undefined}
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

      {/* How It Works section — Editorial Timeline Layout */}
      <section className="py-24 bg-[#FAF8F5] dark:bg-[#181615] border-y border-[#E6DDC4]/50 dark:border-[#2C2420]/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left side column: Section Title */}
            <div className="lg:col-span-4 lg:sticky lg:top-28">
              <div className="inline-block text-[10px] font-mono tracking-widest text-orange-600 dark:text-orange-400 font-bold uppercase mb-3 bg-orange-100/60 dark:bg-orange-950/20 px-2.5 py-1 rounded">
                The Methodology
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1A1A] dark:text-[#F5F5F4] leading-tight mb-4">
                How It Works
              </h2>
              <p className="font-sans text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed max-w-sm">
                Compare your manuscripts in three deliberate stages designed for precision, clarity, and absolute confidentiality.
              </p>

              <div className="mt-8 hidden lg:block border-l-2 border-orange-500/30 pl-4 py-2 font-mono text-xs text-stone-400 dark:text-stone-500 space-y-2">
                <div>// COMPILATION</div>
                <div>// SEMANTIC MAPPING</div>
                <div>// HIGHLIGHT INTEGRATION</div>
              </div>
            </div>

            {/* Right side column: Timeline Steps */}
            <div className="lg:col-span-8 space-y-12 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#E6DDC4] dark:before:bg-[#3A302B] sm:before:left-6">
              {/* Step 1 */}
              <div className="relative pl-12 sm:pl-16">
                <div className="absolute left-0 sm:left-2 top-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FBF9F6] dark:bg-[#141211] border border-orange-500 text-orange-600 flex items-center justify-center font-editorial font-bold text-sm sm:text-base shadow-sm">
                  1
                </div>
                <h3 className="font-editorial text-xl font-bold text-[#1A1A1A] dark:text-[#F5F5F4] mb-3 flex items-center gap-2">
                  Prepare Your Manuscripts
                </h3>
                <p className="font-sans text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl">
                  Paste raw text directly or upload document formats such as <span className="font-semibold text-stone-800 dark:text-stone-200">.pdf, .docx, or .txt</span>. Our offline extraction handles character sets without retaining any files.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative pl-12 sm:pl-16">
                <div className="absolute left-0 sm:left-2 top-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FBF9F6] dark:bg-[#141211] border border-orange-500 text-orange-600 flex items-center justify-center font-editorial font-bold text-sm sm:text-base shadow-sm">
                  2
                </div>
                <h3 className="font-editorial text-xl font-bold text-[#1A1A1A] dark:text-[#F5F5F4] mb-3">
                  AI-Powered Semantic Mapping
                </h3>
                <p className="font-sans text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl">
                  We generate high-dimensional vectors representing sentence concepts. This flags paraphrased claims, synonyms, and restructured sentences that traditional word-for-word detectors completely ignore.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative pl-12 sm:pl-16">
                <div className="absolute left-0 sm:left-2 top-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FBF9F6] dark:bg-[#141211] border border-orange-500 text-orange-600 flex items-center justify-center font-editorial font-bold text-sm sm:text-base shadow-sm">
                  3
                </div>
                <h3 className="font-editorial text-xl font-bold text-[#1A1A1A] dark:text-[#F5F5F4] mb-3">
                  Read the Side-by-Side Redline Breakdown
                </h3>
                <p className="font-sans text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl">
                  View an interactive comparison report highlighting similar passages in real-time. Export standard PDF reports for legal, academic, or professional validation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why DocSim Checker section — Asymmetric Newspaper Block Layout */}
      <section className="py-24 bg-[#FBF9F6] dark:bg-[#141211] border-b border-[#E6DDC4]/40 dark:border-[#2C2420]/40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-end">
            <div className="lg:col-span-6">
              <div className="inline-block text-[10px] font-mono tracking-widest text-orange-600 dark:text-orange-400 font-bold uppercase mb-3 bg-orange-100/60 dark:bg-orange-950/20 px-2.5 py-1 rounded">
                Distinction
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1A1A] dark:text-[#F5F5F4] leading-tight">
                Why DocSim Checker?
              </h2>
            </div>
            <div className="lg:col-span-6">
              <p className="font-sans text-sm sm:text-base text-stone-500 dark:text-stone-400 leading-relaxed max-w-xl">
                A non-commercial, privacy-first instrument designed for rigorous writers, researchers, and legal counsel who require absolute data boundaries and state-of-the-art accuracy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#E6DDC4]/80 dark:bg-[#3A302B]/80 rounded-2xl overflow-hidden border border-[#E6DDC4] dark:border-[#3A302B] shadow-lg">
            {/* Feature 1 */}
            <div className="p-8 sm:p-10 bg-[#FAF8F5] dark:bg-[#181615] relative group transition-colors hover:bg-white dark:hover:bg-[#1D1917]">
              <div className="text-orange-600 dark:text-orange-500 mb-6 font-editorial text-4xl font-semibold opacity-30 group-hover:opacity-100 transition-opacity">
                I.
              </div>
              <h3 className="font-editorial text-lg sm:text-xl font-bold mb-3 text-[#1A1A1A] dark:text-[#F5F5F4]">
                Semantic Match Alignment
              </h3>
              <p className="font-sans text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                Using deep-learning semantic models, our system detects when thoughts or facts are replicated, even when the phrasing, synonyms, or structure are modified.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 sm:p-10 bg-[#FAF8F5] dark:bg-[#181615] relative group transition-colors hover:bg-white dark:hover:bg-[#1D1917]">
              <div className="text-orange-600 dark:text-orange-500 mb-6 font-editorial text-4xl font-semibold opacity-30 group-hover:opacity-100 transition-opacity">
                II.
              </div>
              <h3 className="font-editorial text-lg sm:text-xl font-bold mb-3 text-[#1A1A1A] dark:text-[#F5F5F4]">
                Guaranteed Local Confidentiality
              </h3>
              <p className="font-sans text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                Your intellectual property is never stored, indexed, or cached. Your files are processed securely and deleted from server memory immediately after analysis.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 sm:p-10 bg-[#FAF8F5] dark:bg-[#181615] relative group transition-colors hover:bg-white dark:hover:bg-[#1D1917]">
              <div className="text-orange-600 dark:text-orange-500 mb-6 font-editorial text-4xl font-semibold opacity-30 group-hover:opacity-100 transition-opacity">
                III.
              </div>
              <h3 className="font-editorial text-lg sm:text-xl font-bold mb-3 text-[#1A1A1A] dark:text-[#F5F5F4]">
                Speed &amp; Standard Calibration
              </h3>
              <p className="font-sans text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                Compute vectors and generate interactive reports in fractions of a second. Side-by-side highlighting updates on-the-fly as you adjust threshold standards.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 sm:p-10 bg-[#FAF8F5] dark:bg-[#181615] relative group transition-colors hover:bg-white dark:hover:bg-[#1D1917]">
              <div className="text-orange-600 dark:text-orange-500 mb-6 font-editorial text-4xl font-semibold opacity-30 group-hover:opacity-100 transition-opacity">
                IV.
              </div>
              <h3 className="font-editorial text-lg sm:text-xl font-bold mb-3 text-[#1A1A1A] dark:text-[#F5F5F4]">
                Unified Document Ingestion
              </h3>
              <p className="font-sans text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                Complete, multi-format capabilities natively parsing PDFs, Microsoft Word manuscripts (.docx), and plain text files with consistent results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section — Elegant Editorial Block */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-br from-[#1E1A17] to-[#12100F] border-b border-[#2C2420]/60 text-center transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(#EA580C_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-[10px] font-mono tracking-widest text-orange-500 font-bold uppercase mb-4 inline-block">
            Commitment-Free Utility
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#F5F5F4] leading-tight mb-8">
            Ready to compare <br className="sm:hidden" />
            your manuscripts?
          </h2>
          <p className="font-sans text-stone-400 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Run a detailed analysis across two files in under five seconds. Zero sign-ups or credentials required.
          </p>
          <div className="flex justify-center">
            <a
              href="#tool"
              className="inline-flex items-center justify-center px-10 py-4 text-base font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-orange-600/20"
            >
              Analyze Now
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-24 bg-background border-t border-gray-100 dark:border-stone-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <PageH2>How Document Similarity Is Calculated</PageH2>
            <div className="my-6 p-6 bg-orange-50/50 dark:bg-orange-950/10 border-l-4 border-orange-500 rounded-r-xl">
              <p className="text-base text-gray-700 dark:text-stone-300 leading-relaxed font-medium">
                <span className="font-bold text-orange-600 dark:text-orange-500">Important:</span> DocSim Checker compares your two documents directly against each other. It does not search the public internet or external academic databases like Turnitin or Copyleaks. This direct comparison model is what enables our strict privacy promise.
              </p>
            </div>

            <PageP>
              DocSim Checker is free to use, with no account or sign-up required to run a comparison. Free users get <PageLink href="/pricing">three comparisons per day</PageLink>, which resets daily, covering the vast majority of casual or occasional use cases without any cost or commitment. The tool blends two different approaches to measure similarity to give an accurate, multi-layered score:
            </PageP>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="p-6 bg-card border border-card-border rounded-xl">
                <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                  <span className="text-orange-600 font-black">1.</span>{" "}TF-IDF &amp; Cosine Similarity
                </h3>
                <p className="text-sm text-gray-600 dark:text-stone-400 leading-relaxed">
                  TF-IDF evaluates word importance relative to your text. Combined with Cosine Similarity, it mathematically maps documents as multi-dimensional vectors to measure vocabulary alignment. This is highly effective at identifying exact matches, identical paragraphs, and minor word rearrangements.
                </p>
              </div>

              <div className="p-6 bg-card border border-card-border rounded-xl">
                <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                  <span className="text-orange-600 font-black">2.</span>{" "}AI Semantic Matching
                </h3>
                <p className="text-sm text-gray-600 dark:text-stone-400 leading-relaxed">
                  We leverage Google&apos;s Gemini API to generate deep semantic embeddings representing the meaning of each sentence. By measuring the similarity of these vectors, we identify sentences expressing the exact same ideas or facts, even if they use completely different vocabularies or are fully paraphrased.
                </p>
              </div>
            </div>

            <PageP>
              By blending both methods, DocSim Checker balances precision (syntactic vocabulary alignment) with conceptual depth (semantic paraphrasing detection), giving you an exhaustive side-by-side comparison without uploading or storing any files.
            </PageP>
          </div>

          <div>
            <PageH2>Document Similarity vs. Plagiarism Detection</PageH2>
            <PageP>
              It&apos;s worth being clear about what this tool is and isn&apos;t. Plagiarism detection services like Turnitin or Copyleaks check submitted work against enormous databases — the open web, academic journals, and previously submitted student papers — to identify whether content has been copied from an external source. DocSim Checker does not do this. It compares only the two documents you provide, directly against each other, with no external index or database involved.
            </PageP>
            <PageP>
              This makes it a strong fit for the narrower, more common task of comparing two specific pieces of writing — whether that&apos;s two drafts, two versions of a contract, or two documents you suspect might overlap. If you already know which two documents you want to compare, DocSim Checker gives you a fast, free, and private answer without needing to submit anything to a larger, less transparent system.
            </PageP>
          </div>
        </div>
      </section>
    </div>
  );
}
