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
        <div className="bg-card rounded-2xl border border-card-border shadow-lg overflow-hidden mb-8">
          <div className="p-4 border-b border-card-border flex justify-between items-center bg-gray-50/50 dark:bg-stone-800/50">
            <div className="flex items-center space-x-6">
              <span className="text-sm font-bold text-gray-700 dark:text-stone-300 uppercase tracking-wider">Input</span>
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
          </div>
          <textarea
            className="w-full h-64 p-8 focus:outline-none resize-none bg-transparent text-foreground leading-relaxed text-lg"
            placeholder="Paste your lines here..."
            value={inputText}
            onChange={handleInputTextChange}
            id="duplicate-remover-input"
          />
          <div className="p-8 bg-gray-50/50 dark:bg-stone-800/50 border-t border-card-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={isCaseSensitive}
                      onChange={(e) => setIsCaseSensitive(e.target.checked)}
                      className="peer appearance-none w-6 h-6 border-2 border-gray-300 dark:border-stone-600 rounded-md checked:bg-orange-600 checked:border-orange-600 transition-all cursor-pointer"
                    />
                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-stone-300 group-hover:text-orange-600 transition-colors">Case-sensitive</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={trimWhitespace}
                      onChange={(e) => setTrimWhitespace(e.target.checked)}
                      className="peer appearance-none w-6 h-6 border-2 border-gray-300 dark:border-stone-600 rounded-md checked:bg-orange-600 checked:border-orange-600 transition-all cursor-pointer"
                    />
                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-stone-300 group-hover:text-orange-600 transition-colors">Trim whitespace</span>
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
          <div className="bg-card rounded-2xl border border-card-border shadow-lg overflow-hidden mb-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 border-b border-card-border flex justify-between items-center bg-orange-50/30 dark:bg-orange-950/10">
              <div className="flex items-center space-x-6">
                <span className="text-sm font-bold text-orange-600 uppercase tracking-wider">Cleaned Result</span>
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
              <div className="text-xs font-bold text-gray-500 dark:text-stone-400">
                Removed <span className="text-orange-600">{stats.removed}</span> duplicate lines ({stats.original} → {stats.final} total lines)
              </div>
            </div>
            <textarea
              readOnly
              className="w-full h-64 p-8 focus:outline-none resize-none bg-gray-50/30 dark:bg-stone-900/20 text-foreground leading-relaxed text-lg"
              value={outputText}
            />
          </div>
        )}

        {/* SEO Content Section */}
        <div className="mt-16 border-t border-gray-100 dark:border-stone-800/50 pt-16">
          <PageH2>What a Duplicate Line Remover Does</PageH2>
          <PageP>
            A duplicate line remover scans a block of text or a list and removes any lines that repeat, leaving only unique entries behind. This is a small but frequently needed task — anyone who has ever merged two lists, cleaned up exported data, or compiled notes from multiple sources has likely run into duplicate lines that need to be manually found and deleted, which becomes impractical once a list grows beyond a handful of entries.
          </PageP>
          <PageP>
            DocSim Checker&apos;s Duplicate Line Remover handles this instantly: paste your text, click Remove Duplicates, and get back a cleaned version with repeated lines removed, along with a clear count of exactly how many duplicates were found.
          </PageP>

          <PageH2>Common Situations Where This Tool Helps</PageH2>
          <PageP>
            <PageStrong>Data cleanup</PageStrong> — merging email lists, contact lists, or exported spreadsheet data (pasted as plain text) often introduces duplicate entries that need to be removed before the data is usable.
          </PageP>
          <PageP>
            <PageStrong>Note consolidation</PageStrong> — combining notes from multiple sources or drafts frequently results in repeated lines, especially when copying sections between documents.
          </PageP>
          <PageP>
            <PageStrong>Content and SEO work</PageStrong> — checking lists of keywords, URLs, or tags for accidental duplicates before using them in a campaign or content plan.
          </PageP>
          <PageP>
            <PageStrong>Developers and technical users</PageStrong> — cleaning up log files, configuration lists, or exported data where duplicate lines can cause errors or confusion downstream.
          </PageP>

          <PageH2>Case-Sensitive and Whitespace Options</PageH2>
          <PageP>
            Not all duplicates are exact character-for-character matches. The tool includes two configurable options to handle this: a <PageStrong>case-sensitive</PageStrong> toggle, which determines whether &quot;Apple&quot; and &quot;apple&quot; are treated as the same line or as different lines, and a <PageStrong>trim whitespace</PageStrong> option, which ignores leading or trailing spaces when comparing lines — useful when pasted data includes inconsistent spacing that would otherwise cause visually identical lines to be treated as unique.
          </PageP>
          <PageP>
            These options matter because real-world pasted data is rarely perfectly clean. A list exported from a spreadsheet, for example, might have trailing spaces on some entries but not others, which would cause a naive duplicate check to miss matches that are functionally identical.
          </PageP>

          <PageH2>How the Comparison Works</PageH2>
          <PageP>
            Once you click &quot;Remove Duplicates,&quot; the tool processes your text line by line, comparing each line against every other line based on the options you&apos;ve selected, and returns a cleaned version showing only the first occurrence of each unique line. A summary line shows exactly how many duplicate lines were removed and the resulting total line count, so you can quickly confirm the cleanup worked as expected before copying the result.
          </PageP>

          <PageH2>Private and Instant Processing</PageH2>
          <PageP>
            As with DocSim Checker&apos;s other supporting tools, duplicate removal happens entirely in your browser using JavaScript — no text is uploaded, stored, or sent to any server. This makes it safe to use with sensitive lists (contact information, internal notes, or proprietary data) without any privacy concern, and means results appear instantly with no processing delay regardless of how large the pasted text is.
          </PageP>

          <PageH2>Part of a Larger Toolset</PageH2>
          <PageP>
            The Duplicate Line Remover is one of several free, no-sign-up writing and text utilities built alongside <PageLink href="/">DocSim Checker&apos;s core document comparison tool</PageLink>. If your goal is closer to comparing two full documents for overlapping content — rather than cleaning duplicate lines within a single list — DocSim Checker&apos;s main similarity checker provides a detailed side-by-side comparison with both keyword-based and AI-powered semantic matching, useful for catching not just exact repeats but paraphrased or reworded overlap between two separate documents.
          </PageP>
        </div>
      </div>
    </InfoPageLayout>
  );
}
