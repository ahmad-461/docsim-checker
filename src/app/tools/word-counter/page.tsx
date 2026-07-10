"use client";

import React, { useState, useRef, ChangeEvent } from 'react';
import InfoPageLayout, { PageH2, PageP, PageStrong, PageLink } from '../../components/InfoPageLayout';

export default function WordCounterPage() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isStale, setIsStale] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stats, setStats] = useState({
    words: 0,
    charsWithSpaces: 0,
    charsWithoutSpaces: 0,
    sentences: 0,
    readingTime: 0,
    paragraphs: 0,
    avgWordsPerSentence: 0,
    longestWord: '',
    punctuation: {
      periods: 0,
      commas: 0,
      questions: 0,
      exclamations: 0
    }
  });

  const calculateStats = () => {
    const trimmedText = text.trim();

    // Word count
    const wordsArr = trimmedText === '' ? [] : trimmedText.split(/\s+/);
    const words = wordsArr.length;

    // Character counts
    const charsWithSpaces = text.length;
    const charsWithoutSpaces = text.replace(/\s/g, '').length;

    // Sentence count
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    // Reading time (~200 words per minute)
    const readingTime = Math.ceil(words / 200);

    // Paragraph count (double line break)
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;

    // Average words per sentence
    const avgWordsPerSentence = sentences > 0 ? parseFloat((words / sentences).toFixed(1)) : 0;

    // Longest word
    let longestWord = '';
    wordsArr.forEach(word => {
      // Strip punctuation for "clean" word check
      const cleanWord = word.replace(/[.,!?;:()]/g, '');
      if (cleanWord.length > longestWord.length) {
        longestWord = cleanWord;
      }
    });

    // Punctuation breakdown
    const periods = (text.match(/\./g) || []).length;
    const commas = (text.match(/,/g) || []).length;
    const questions = (text.match(/\?/g) || []).length;
    const exclamations = (text.match(/!/g) || []).length;

    setStats({
      words,
      charsWithSpaces,
      charsWithoutSpaces,
      sentences,
      readingTime,
      paragraphs,
      avgWordsPerSentence,
      longestWord,
      punctuation: {
        periods,
        commas,
        questions,
        exclamations
      }
    });
    setIsStale(false);
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setIsStale(true);
    if (file) {
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.txt')) {
        alert("Currently only .txt files are supported for direct upload. Please paste text from other formats.");
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setText(content);
        setIsStale(true);
      };
      reader.readAsText(selectedFile);
    }
  };

  const clearAll = () => {
    setText('');
    setFile(null);
    setStats({
      words: 0,
      charsWithSpaces: 0,
      charsWithoutSpaces: 0,
      sentences: 0,
      readingTime: 0,
      paragraphs: 0,
      avgWordsPerSentence: 0,
      longestWord: '',
      punctuation: {
        periods: 0,
        commas: 0,
        questions: 0,
        exclamations: 0
      }
    });
    setIsStale(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <InfoPageLayout
      title="Word Counter"
      subtitle="Instantly check word count, character count, and reading time — free, private, no sign-up."
      cta={{
        label: "Compare documents instead →",
        href: "/#tool"
      }}
      maxWidth="max-w-4xl"
      noProse={true}
    >
      <div className="mx-auto">
        {/* Primary Stats Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 transition-opacity duration-200 ${isStale ? 'opacity-50' : 'opacity-100'}`}>
          <div className="bg-card p-6 rounded-2xl border-2 border-orange-100 dark:border-orange-900/20 shadow-sm text-center transform transition-transform hover:scale-[1.02]">
            <div className="text-3xl font-black text-orange-600">{stats.words}</div>
            <div className="text-xs text-gray-600 dark:text-stone-400 uppercase tracking-widest font-bold mt-1">Words</div>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-card-border shadow-sm text-center">
            <div className="text-3xl font-bold text-foreground">{stats.charsWithSpaces}</div>
            <div className="text-xs text-gray-600 dark:text-stone-400 uppercase tracking-widest font-bold mt-1">Characters</div>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-card-border shadow-sm text-center">
            <div className="text-3xl font-bold text-foreground">{stats.sentences}</div>
            <div className="text-xs text-gray-600 dark:text-stone-400 uppercase tracking-widest font-bold mt-1">Sentences</div>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-card-border shadow-sm text-center">
            <div className="text-3xl font-bold text-foreground">{stats.paragraphs}</div>
            <div className="text-xs text-gray-600 dark:text-stone-400 uppercase tracking-widest font-bold mt-1">Paragraphs</div>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-card-border shadow-sm text-center col-span-2 md:col-span-1">
            <div className="text-3xl font-bold text-foreground">~{stats.readingTime}</div>
            <div className="text-xs text-gray-600 dark:text-stone-400 uppercase tracking-widest font-bold mt-1">Min Read</div>
          </div>
        </div>

        {/* Secondary Stats Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8 transition-opacity duration-200 ${isStale ? 'opacity-50' : 'opacity-100'}`}>
          <div className="bg-gray-50/50 dark:bg-stone-800/30 p-3 rounded-xl border border-card-border text-center">
            <div className="text-lg font-bold text-foreground">{stats.punctuation.periods}</div>
            <div className="text-[10px] text-gray-500 dark:text-stone-400 uppercase font-bold">Periods (.)</div>
          </div>
          <div className="bg-gray-50/50 dark:bg-stone-800/30 p-3 rounded-xl border border-card-border text-center">
            <div className="text-lg font-bold text-foreground">{stats.punctuation.commas}</div>
            <div className="text-[10px] text-gray-500 dark:text-stone-400 uppercase font-bold">Commas (,)</div>
          </div>
          <div className="bg-gray-50/50 dark:bg-stone-800/30 p-3 rounded-xl border border-card-border text-center">
            <div className="text-lg font-bold text-foreground">{stats.punctuation.questions}</div>
            <div className="text-[10px] text-gray-500 dark:text-stone-400 uppercase font-bold">Questions (?)</div>
          </div>
          <div className="bg-gray-50/50 dark:bg-stone-800/30 p-3 rounded-xl border border-card-border text-center">
            <div className="text-lg font-bold text-foreground">{stats.punctuation.exclamations}</div>
            <div className="text-[10px] text-gray-500 dark:text-stone-400 uppercase font-bold">Exclaims (!)</div>
          </div>
          <div className="bg-gray-50/50 dark:bg-stone-800/30 p-3 rounded-xl border border-card-border text-center">
            <div className="text-lg font-bold text-foreground">{stats.avgWordsPerSentence}</div>
            <div className="text-[10px] text-gray-500 dark:text-stone-400 uppercase font-bold">Words/Sent</div>
          </div>
          <div className="bg-gray-50/50 dark:bg-stone-800/30 p-3 rounded-xl border border-card-border text-center col-span-2">
            <div className="text-lg font-bold text-foreground truncate px-2" title={stats.longestWord}>
              {stats.longestWord || '-'}
            </div>
            <div className="text-[10px] text-gray-500 dark:text-stone-400 uppercase font-bold">Longest Word</div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="bg-card rounded-2xl border border-card-border shadow-lg overflow-hidden mb-8">
          <div className="p-4 border-b border-card-border flex justify-between items-center bg-gray-50/50 dark:bg-stone-800/50">
            <div className="flex items-center space-x-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload .txt
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
              {file ? `File: ${file.name}` : "Supports pasted text or .txt files"}
            </div>
          </div>
          <textarea
            className="w-full h-96 p-8 focus:outline-none resize-none bg-transparent text-foreground leading-relaxed text-lg"
            placeholder="Start typing or paste your text here..."
            value={text}
            onChange={handleTextChange}
            id="word-counter-input"
          />
          <div className="p-6 bg-gray-50/50 dark:bg-stone-800/50 border-t border-card-border flex justify-center">
            <button
              onClick={calculateStats}
              disabled={text.trim().length === 0}
              className="px-12 py-4 bg-orange-600 text-white font-bold text-lg rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 transform hover:scale-[1.02]"
            >
              Count Text
            </button>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-16 border-t border-gray-100 dark:border-stone-800/50 pt-16">
          <PageH2>Why Word Count Matters</PageH2>
          <PageP>
            Word count is one of the most common constraints in writing — whether it&apos;s a strict essay limit set by a teacher, a word cap on a job application, a character limit for a social media post, or a target length for an article pitch. Going over or under a specified limit can mean the difference between a submission being accepted or rejected outright, which is why having an instant, accurate way to check is genuinely useful rather than a novelty.
          </PageP>
          <PageP>
            DocSim Checker&apos;s Word Counter gives you real-time word count, character count (with and without spaces), sentence count, paragraph count, and an estimated reading time — all calculated instantly in your browser as you type or paste, with no need to submit anything to a server.
          </PageP>

          <PageH2>Who Uses an Online Word Counter</PageH2>
          <PageP>
            <PageStrong>Students and academics</PageStrong> rely on word counters constantly — essays, dissertations, and research papers almost always come with strict minimum or maximum word requirements, and manually counting is impractical for anything beyond a few sentences.
          </PageP>
          <PageP>
            <PageStrong>Job seekers</PageStrong> writing cover letters or application responses often face character or word limits imposed by application portals, where going over the limit can cause a submission to be rejected or truncated.
          </PageP>
          <PageP>
            <PageStrong>Bloggers, copywriters, and marketers</PageStrong> use word counters to hit target lengths for SEO-optimized content, social media captions with strict character limits, or client deliverables with agreed-upon word counts.
          </PageP>
          <PageP>
            <PageStrong>Speakers and presenters</PageStrong> use the reading time estimate to gauge how long a script or speech will take to deliver, based on an average speaking/reading pace of roughly 200 words per minute.
          </PageP>

          <PageH2>What Gets Counted, and How</PageH2>
          <PageP>
            Word count is calculated by splitting text on whitespace and counting resulting tokens — a straightforward, widely-used method that matches how most word processors calculate word count. Character count is shown both including and excluding spaces, since some limits (particularly on social platforms or form fields) count spaces toward the total and others don&apos;t.
          </PageP>
          <PageP>
            Sentence count uses punctuation-based splitting on periods, question marks, and exclamation points. Paragraph count is based on double line breaks in the text, treating single line breaks as soft wraps within the same paragraph rather than a new one — the same convention most writing and publishing tools use.
          </PageP>

          <PageH2>Free, Private, and Instant</PageH2>
          <PageP>
            Everything in the Word Counter runs entirely in your browser. No text you type or paste is sent to a server, stored, or logged anywhere — calculations happen client-side using JavaScript, which is also why results update instantly with no loading delay. There&apos;s no file size limit, no sign-up requirement, and no daily usage cap, since the tool costs nothing to run at any scale.
          </PageP>
          <PageP>
            This also means the Word Counter works with sensitive or unpublished writing without any privacy concern — drafts, personal essays, or confidential documents never leave your device.
          </PageP>

          <PageH2>Beyond Basic Counting</PageH2>
          <PageP>
            For text that needs more than a raw count, DocSim Checker&apos;s Word Counter also calculates average words per sentence (useful for gauging readability — shorter average sentence length generally reads as more accessible), and a punctuation breakdown showing how many periods, commas, question marks, and exclamation marks appear in the text, which can be a useful signal for editing tone or catching overused punctuation patterns.
          </PageP>

          <PageH2>When You Need More Than a Count</PageH2>
          <PageP>
            If you&apos;re comparing two versions of a document rather than just counting one, <PageLink href="/">DocSim Checker&apos;s full similarity comparison tool</PageLink> shows exactly which sentences match or differ between two pieces of writing, with a detailed similarity score powered by both keyword and AI-based semantic analysis. The Word Counter and the Comparison tool are built to work together — check your word count here, then compare drafts using the main tool when you need a deeper look at what&apos;s changed.
          </PageP>
        </div>
      </div>
    </InfoPageLayout>
  );
}
