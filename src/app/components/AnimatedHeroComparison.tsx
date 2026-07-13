"use client";

import React, { useState, useEffect } from 'react';

interface Sentence {
  text: string;
  highlighted: boolean;
}

export default function AnimatedHeroComparison() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const sentencesA = [
    "The application of artificial intelligence in healthcare has revolutionized patient diagnostics.",
    "However, researchers must address data privacy concerns to ensure ethical implementation.",
    "Ultimately, collaboration between clinicians and software developers is vital for long-term clinical integration."
  ];

  const sentencesB = [
    "Patient diagnostics have been completely transformed by implementing artificial intelligence in medical care.",
    "Nevertheless, to guarantee ethical deployment, scientists need to resolve issues regarding data confidentiality.",
    "In the end, partnership between medical professionals and programmers is crucial for sustained adoption."
  ];

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', listener);

    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setActiveIdx(0); // Freeze on first
      return;
    }

    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % sentencesA.length);
    }, 4500); // 4.5 seconds per pair of sentences

    return () => clearInterval(interval);
  }, [reducedMotion, sentencesA.length]);

  return (
    <div className="relative w-full max-w-2xl mx-auto lg:max-w-none mt-12 lg:mt-0" data-html2canvas-ignore="true">
      {/* Decorative background paper-texture circles or shadows */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-orange-600/5 blur-3xl -z-10 rounded-full" />

      <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 items-stretch relative">
        {/* Document A (Original) */}
        <div className="flex-1 bg-[#FAF7F2] dark:bg-[#1E1A17] border border-[#E6DDC4] dark:border-[#3A302B] rounded-2xl p-6 sm:p-8 shadow-xl relative transition-all duration-500 transform lg:-rotate-1 hover:rotate-0 hover:scale-[1.01]">
          {/* Paper line indicator top-left */}
          <div className="absolute top-4 left-6 flex items-center gap-1.5">
            <span className="text-[10px] font-mono tracking-widest text-stone-400 dark:text-stone-500 uppercase font-bold">Doc A: Source</span>
          </div>
          <div className="absolute top-4 right-6 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-700" />
            <span className="w-2 h-2 rounded-full bg-stone-200 dark:bg-stone-800" />
          </div>

          <div className="mt-6 space-y-4 text-stone-700 dark:text-stone-300 font-sans text-sm sm:text-base leading-relaxed">
            {sentencesA.map((sentence, idx) => {
              const isActive = idx === activeIdx;
              return (
                <span
                  key={idx}
                  className={`inline block transition-all duration-700 rounded px-1.5 py-0.5 ${
                    isActive
                      ? "bg-orange-100 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200 shadow-sm border-l-2 border-orange-500 font-medium"
                      : "opacity-60 dark:opacity-40"
                  }`}
                >
                  {sentence}{" "}
                </span>
              );
            })}
          </div>
        </div>

        {/* Document B (Paraphrased with matching highlights) */}
        <div className="flex-1 bg-[#FAF7F2] dark:bg-[#1E1A17] border border-[#E6DDC4] dark:border-[#3A302B] rounded-2xl p-6 sm:p-8 shadow-2xl relative transition-all duration-500 transform lg:rotate-2 hover:rotate-0 hover:scale-[1.01] sm:mt-8 lg:mt-6">
          {/* Redline indicator or tracked change motif */}
          <div className="absolute top-4 left-6 flex items-center gap-1.5">
            <span className="text-[10px] font-mono tracking-widest text-orange-600 dark:text-orange-400 uppercase font-bold">Doc B: Paraphrase</span>
          </div>
          <div className="absolute top-4 right-6 flex items-center gap-1">
            <div className="text-[10px] font-mono text-orange-600 dark:text-orange-400 font-bold bg-orange-100 dark:bg-orange-950/40 px-1.5 py-0.5 rounded">
              92% Match
            </div>
          </div>

          <div className="mt-6 space-y-4 text-stone-700 dark:text-stone-300 font-sans text-sm sm:text-base leading-relaxed">
            {sentencesB.map((sentence, idx) => {
              const isActive = idx === activeIdx;
              return (
                <span
                  key={idx}
                  className={`inline block transition-all duration-700 rounded px-1.5 py-0.5 ${
                    isActive
                      ? "bg-orange-500/15 dark:bg-orange-500/25 text-orange-900 dark:text-orange-100 font-medium relative"
                      : "opacity-60 dark:opacity-40"
                  }`}
                >
                  {sentence}{" "}
                  {isActive && (
                    <span className="absolute -left-1.5 top-0 bottom-0 w-0.5 bg-orange-600 animate-pulse" />
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Connection Indicator Overlay */}
      <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="bg-white dark:bg-stone-900 border border-[#E6DDC4] dark:border-[#3A302B] text-orange-600 px-3 py-1.5 rounded-full shadow-lg text-xs font-bold font-mono tracking-wider uppercase flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 animate-spin text-orange-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Semantic Match Detected
        </div>
      </div>
    </div>
  );
}
