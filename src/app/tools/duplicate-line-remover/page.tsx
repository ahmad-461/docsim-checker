"use client";

import React, { useState, ChangeEvent } from 'react';
import InfoPageLayout, { PageH2, PageP, PageStrong, PageLink } from '../../components/InfoPageLayout';

export default function DuplicateLineRemoverPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [stats, setStats] = useState({ removed: 0, original: 0, final: 0 });
  const [showOutput, setShowOutput] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Copy Results');

  const handleInputTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const removeDuplicates = () => {
    if (!inputText.trim()) return;

    const lines = inputText.split(/\r?\n/);
    const originalCount = lines.length;
    const seen = new Set();
    const resultLines: string[] = [];

    lines.forEach(line => {
      let processedLine = line;
      if (trimWhitespace) {
        processedLine = processedLine.trim();
      }

      const compareLine = isCaseSensitive ? processedLine : processedLine.toLowerCase();

      if (!seen.has(compareLine)) {
        seen.add(compareLine);
        resultLines.push(line); // Keep original line formatting (trimmed or not based on user choice? actually usually people want the line as is but the comparison to be smart)
        // Re-reading requirements: "ignore leading/trailing spaces when comparing lines"
        // I will keep the original line if it's the first time we see its "processed" version.
      }
    });

    const finalCount = resultLines.length;
    setOutputText(resultLines.join('\n'));
    setStats({
      removed: originalCount - finalCount,
      original: originalCount,
      final: finalCount
    });
    setShowOutput(true);
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy Results'), 2000);
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setShowOutput(false);
    setStats({ removed: 0, original: 0, final: 0 });
  };

  return (
    <InfoPageLayout
      title="Duplicate Line Remover"
      subtitle="Paste your list or text and instantly remove duplicate lines."
      cta={{
        label: "Compare documents instead →",
        href: "/#tool"
      }}
      maxWidth="max-w-4xl"
      noProse={true}
    >
      <div className="mx-auto">
        {/* Input Card */}
        <div className="bg-[#FAF8F5] dark:bg-[#181615] rounded-2xl border border-[#E6DDC4] dark:border-[#2C2420] shadow-lg overflow-hidden mb-8">
          <div className="p-4 border-b border-[#E6DDC4] dark:border-[#2C2420] flex justify-between items-center bg-[#FAF8F5]/55 dark:bg-[#181615]/50">
            <div className="flex items-center space-x-6">
              <span className="text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest">Input</span>
              <button
                onClick={clearAll}
                className="flex items-center gap-2 text-sm font-semibold text-stone-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear
              </button>
            </div>
          </div>
          <textarea
            className="w-full h-64 p-8 focus:outline-none resize-none bg-transparent text-[#1A1A1A] dark:text-[#F5F5F4] leading-relaxed text-lg"
            placeholder="Paste your lines here..."
            value={inputText}
            onChange={handleInputTextChange}
            id="duplicate-remover-input"
          />
          <div className="p-8 bg-[#FAF8F5]/60 dark:bg-[#181615]/60 border-t border-[#E6DDC4] dark:border-[#2C2420]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={isCaseSensitive}
                      onChange={(e) => setIsCaseSensitive(e.target.checked)}
                      className="peer appearance-none w-6 h-6 border-2 border-[#E6DDC4] dark:border-[#2C2420] rounded-md checked:bg-orange-600 checked:border-orange-600 transition-all cursor-pointer"
                    />
                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-stone-700 dark:text-stone-300 group-hover:text-orange-600 transition-colors">Case-sensitive</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={trimWhitespace}
                      onChange={(e) => setTrimWhitespace(e.target.checked)}
                      className="peer appearance-none w-6 h-6 border-2 border-[#E6DDC4] dark:border-[#2C2420] rounded-md checked:bg-orange-600 checked:border-orange-600 transition-all cursor-pointer"
                    />
                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-stone-700 dark:text-stone-300 group-hover:text-orange-600 transition-colors">Trim whitespace</span>
                </label>
              </div>
              <button
                onClick={removeDuplicates}
                disabled={!inputText.trim()}
                className="w-full md:w-auto px-10 py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 transform hover:scale-[1.02]"
              >
                Remove Duplicates
              </button>
            </div>
          </div>
        </div>

        {/* Output Card */}
        {showOutput && (
          <div className="bg-[#FAF8F5] dark:bg-[#181615] rounded-2xl border border-[#E6DDC4] dark:border-[#2C2420] shadow-lg overflow-hidden mb-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 border-b border-[#E6DDC4] dark:border-[#2C2420] flex justify-between items-center bg-orange-50/10 dark:bg-orange-950/10">
              <div className="flex items-center space-x-6">
                <span className="text-sm font-bold text-orange-600 uppercase tracking-widest">Cleaned Result</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  {copyStatus}
                </button>
              </div>
              <div className="text-xs font-bold text-stone-500 dark:text-stone-400">
                Removed <span className="text-orange-600">{stats.removed}</span> duplicate lines ({stats.original} → {stats.final} total lines)
              </div>
            </div>
            <textarea
              readOnly
              className="w-full h-64 p-8 focus:outline-none resize-none bg-transparent text-[#1A1A1A] dark:text-[#F5F5F4] leading-relaxed text-lg"
              value={outputText}
            />
          </div>
        )}

        {/* SEO Content Section */}
        <div className="mt-16 border-t border-gray-100 dark:border-stone-800/50 pt-16 space-y-12">
          <div>
            <PageH2>What a Duplicate Line Remover Does</PageH2>
            <PageP>
              A duplicate line remover scans a block of text or a list and removes any lines that repeat, leaving only unique entries behind. Merging email list data, notes, or code logs often introduces duplicate lines that are tedious to find manually. Paste your list, click Remove Duplicates, and clean your data instantly. If you need to check full documents for similarities rather than duplicate lists, you can use our primary <PageLink href="/">document similarity tool</PageLink>.
            </PageP>
          </div>

          <div>
            <PageH2>Case-Sensitive and Whitespace Options</PageH2>
            <PageP>
              Not all duplicates are exact matches. The tool includes a <PageStrong>case-sensitive</PageStrong> toggle, which determines if &quot;Apple&quot; and &quot;apple&quot; are treated as unique lines, and a <PageStrong>trim whitespace</PageStrong> option, which ignores leading or trailing spaces. These parameters make cleanups highly customizable, allowing you to normalize messy spreadsheet exports, configuration files, or script logs cleanly.
            </PageP>
          </div>

          <div>
            <PageH2>Private and Instant Processing</PageH2>
            <PageP>
              Everything in this duplicate removal tool happens locally in your browser using JavaScript. No lists or private texts are ever uploaded, stored, or processed on external servers. This makes it completely safe to use with sensitive data — such as emails, proprietary logs, or personal notes — with zero delay.
            </PageP>
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
}
