"use client";

import React, { useState, ChangeEvent } from 'react';
import InfoPageLayout, { PageH2, PageP, PageStrong, PageLink } from '../../components/InfoPageLayout';

export default function CaseConverterPage() {
  const [text, setText] = useState('');
  const [copyStatus, setCopyStatus] = useState('Copy');

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const transformText = (type: string) => {
    if (!text) return;
    let result = text;

    const getWords = (str: string) => {
      return str
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // split camelCase
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // split multiple capitals
        .replace(/[_-]/g, ' ') // treat underscores and hyphens as spaces
        .replace(/[^a-zA-Z0-9 ]/g, '') // remove other punctuation
        .trim()
        .split(/\s+/);
    };

    switch (type) {
      case 'UPPERCASE':
        result = text.toUpperCase();
        break;
      case 'lowercase':
        result = text.toLowerCase();
        break;
      case 'Title Case':
        result = text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        break;
      case 'Sentence case':
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'camelCase':
        result = getWords(text)
          .map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join('');
        break;
      case 'snake_case':
        result = getWords(text)
          .map(word => word.toLowerCase())
          .join('_');
        break;
    }

    setText(result);
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy'), 2000);
  };

  const clearAll = () => {
    setText('');
  };

  const conversionTypes = [
    'UPPERCASE',
    'lowercase',
    'Title Case',
    'Sentence case',
    'camelCase',
    'snake_case'
  ];

  return (
    <InfoPageLayout
      title="Case Converter"
      subtitle="Instantly convert text between UPPERCASE, lowercase, Title Case, and more."
      cta={{
        label: "Compare documents instead →",
        href: "/#tool"
      }}
      maxWidth="max-w-4xl"
      noProse={true}
    >
      <div className="mx-auto">
        <div className="bg-card rounded-2xl border border-card-border shadow-lg overflow-hidden mb-8">
          <div className="p-4 border-b border-card-border flex justify-between items-center bg-gray-50/50 dark:bg-stone-800/50">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleCopy}
                disabled={!text}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {copyStatus}
              </button>
              <button
                onClick={clearAll}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear
              </button>
            </div>
            <div className="hidden sm:block text-xs font-medium text-gray-500 dark:text-stone-400 italic">
              Paste or type your text to convert instantly
            </div>
          </div>
          <textarea
            className="w-full h-96 p-8 focus:outline-none resize-none bg-transparent text-foreground leading-relaxed text-lg"
            placeholder="Start typing or paste your text here..."
            value={text}
            onChange={handleTextChange}
            id="case-converter-input"
          />
          <div className="p-8 bg-gray-50/50 dark:bg-stone-800/50 border-t border-card-border">
            <div className="text-center mb-6">
              <p className="text-sm font-medium text-gray-500 dark:text-stone-400">
                Choose a format to transform your text instantly.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {conversionTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => transformText(type)}
                  disabled={!text}
                  className="px-6 py-3 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-xl text-sm font-bold text-gray-700 dark:text-stone-300 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-500 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-16 border-t border-gray-100 dark:border-stone-800/50 pt-16">
          <PageH2>What Is a Text Case Converter</PageH2>
          <PageP>
            A case converter transforms text between different capitalization styles — UPPERCASE, lowercase, Title Case, Sentence case, camelCase, and snake_case — without requiring you to manually retype or reformat anything. This sounds like a small convenience, but it solves a genuinely common friction point: reformatting text by hand is tedious, error-prone, and slow, especially for longer passages.
          </PageP>
          <PageP>
            DocSim Checker&apos;s Case Converter handles this instantly in your browser. Paste any text, choose a format, and the conversion happens immediately — no waiting, no submission, no account required.
          </PageP>

          <PageH2>Common Uses for Case Conversion</PageH2>
          <PageP>
            <PageStrong>Writers and editors</PageStrong> often need to fix text that was accidentally typed in all caps (a common issue when Caps Lock is left on by mistake), or need to convert a heading into Title Case to match a style guide.
          </PageP>
          <PageP>
            <PageStrong>Developers</PageStrong> frequently need to convert variable or function names between camelCase and snake_case depending on the programming language or style convention they&apos;re working in — JavaScript commonly uses camelCase, while Python and many database schemas favor snake_case.
          </PageP>
          <PageP>
            <PageStrong>Social media managers and marketers</PageStrong> use case conversion to quickly reformat captions, headlines, or ad copy to match platform conventions or brand style guidelines, without retyping content from scratch.
          </PageP>
          <PageP>
            <PageStrong>Students</PageStrong> converting headings or titles for papers into the correct capitalization style required by formatting guides like APA or MLA, which often specify Title Case for headings.
          </PageP>

          <PageH2>How Each Case Format Works</PageH2>
          <PageP>
            <PageStrong>UPPERCASE</PageStrong> converts every letter in the text to capital letters — commonly used for emphasis, headers, or acronyms.
          </PageP>
          <PageP>
            <PageStrong>lowercase</PageStrong> converts every letter to lowercase — useful for normalizing text before further processing, or for stylistic effect in casual writing and design.
          </PageP>
          <PageP>
            <PageStrong>Title Case</PageStrong> capitalizes the first letter of every word, commonly used for headlines, titles, and headings across most style guides.
          </PageP>
          <PageP>
            <PageStrong>Sentence case</PageStrong> capitalizes only the first letter of each sentence (and the first word of the text), matching normal prose writing conventions — useful for correcting text that was pasted from a source using different capitalization rules.
          </PageP>
          <PageP>
            <PageStrong>camelCase</PageStrong> removes spaces and punctuation, joining words together with each word after the first capitalized (e.g., &quot;hello world&quot; becomes &quot;helloWorld&quot;) — the standard naming convention in many programming languages for variables and functions.
          </PageP>
          <PageP>
            <PageStrong>snake_case</PageStrong> similarly removes spaces and punctuation but joins words with underscores in all lowercase (e.g., &quot;hello world&quot; becomes &quot;hello_world&quot;) — commonly used in Python, database column names, and file naming conventions.
          </PageP>

          <PageH2>Free and Instant, No Sign-Up Required</PageH2>
          <PageP>
            Like all of DocSim Checker&apos;s supporting tools, the Case Converter runs entirely client-side in your browser. Nothing you paste is sent to a server, stored, or logged — conversions happen instantly using JavaScript running locally on your device. There&apos;s no character limit, no daily usage cap, and no account needed.
          </PageP>

          <PageH2>A Companion to DocSim Checker&apos;s Full Toolset</PageH2>
          <PageP>
            The Case Converter is one of several free writing utilities available alongside DocSim Checker&apos;s main document comparison tool. If you&apos;re preparing text for formatting, cleaning up copy-pasted content, or standardizing naming conventions in code, this tool handles that instantly. For deeper analysis — comparing two full documents to see how similar they are — <PageLink href="/">DocSim Checker&apos;s primary comparison tool</PageLink> provides a detailed, sentence-by-sentence similarity breakdown using both keyword-based and AI-powered semantic matching.
          </PageP>
        </div>
      </div>
    </InfoPageLayout>
  );
}
