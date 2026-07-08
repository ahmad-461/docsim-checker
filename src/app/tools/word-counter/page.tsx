"use client";

import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';

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
    readingTime: 0
  });

  const calculateStats = () => {
    const trimmedText = text.trim();

    // Word count
    const words = trimmedText === '' ? 0 : trimmedText.split(/\s+/).length;

    // Character counts
    const charsWithSpaces = text.length;
    const charsWithoutSpaces = text.replace(/\s/g, '').length;

    // Sentence count (matching the backend's simple regex split)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    // Reading time (~200 words per minute)
    const readingTime = Math.ceil(words / 200);

    setStats({
      words,
      charsWithSpaces,
      charsWithoutSpaces,
      sentences,
      readingTime
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
      readingTime: 0
    });
    setIsStale(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Word Counter</h1>
          <p className="text-gray-600 dark:text-stone-400 leading-relaxed">
            Word Counter is a free, instant tool for checking the word count, character count, and estimated reading time of any text. Whether you're hitting a strict word limit for an essay, application, or article, or just curious how long a piece of writing really is, this tool gives you accurate counts. No file size limits, no sign-up, and nothing you type is stored or sent anywhere — all counting happens directly in your browser. It's a simple companion to DocSim Checker's full document comparison tool, built for the moments you just need a quick count rather than a full similarity analysis.
          </p>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 transition-opacity duration-200 ${isStale ? 'opacity-50' : 'opacity-100'}`}>
          <div className="bg-card p-4 rounded-xl border border-card-border shadow-sm text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.words}</div>
            <div className="text-xs text-gray-500 dark:text-stone-500 uppercase tracking-wider font-medium">Words</div>
          </div>
          <div className="bg-card p-4 rounded-xl border border-card-border shadow-sm text-center">
            <div className="text-2xl font-bold text-foreground">{stats.charsWithSpaces}</div>
            <div className="text-xs text-gray-500 dark:text-stone-500 uppercase tracking-wider font-medium">Chars</div>
          </div>
          <div className="bg-card p-4 rounded-xl border border-card-border shadow-sm text-center">
            <div className="text-2xl font-bold text-foreground">{stats.charsWithoutSpaces}</div>
            <div className="text-xs text-gray-500 dark:text-stone-500 uppercase tracking-wider font-medium">No Spaces</div>
          </div>
          <div className="bg-card p-4 rounded-xl border border-card-border shadow-sm text-center">
            <div className="text-2xl font-bold text-foreground">{stats.sentences}</div>
            <div className="text-xs text-gray-500 dark:text-stone-500 uppercase tracking-wider font-medium">Sentences</div>
          </div>
          <div className="bg-card p-4 rounded-xl border border-card-border shadow-sm text-center col-span-2 md:col-span-1">
            <div className="text-2xl font-bold text-foreground">~{stats.readingTime} min</div>
            <div className="text-xs text-gray-500 dark:text-stone-500 uppercase tracking-wider font-medium">Read Time</div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="bg-card rounded-2xl border border-card-border shadow-sm overflow-hidden mb-8">
          <div className="p-4 border-b border-card-border flex justify-between items-center bg-gray-50/50 dark:bg-stone-800/50">
            <div className="flex items-center space-x-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-medium text-gray-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
              >
                Upload .txt
              </button>
              <button
                onClick={clearAll}
                className="text-sm font-medium text-gray-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="text-xs text-gray-400 dark:text-stone-500">
              {file ? `File: ${file.name}` : "Supports pasted text or .txt files"}
            </div>
          </div>
          <textarea
            className="w-full h-96 p-6 focus:outline-none resize-none bg-transparent text-foreground leading-relaxed"
            placeholder="Start typing or paste your text here..."
            value={text}
            onChange={handleTextChange}
          />
          <div className="p-4 bg-gray-50/50 dark:bg-stone-800/50 border-t border-card-border flex justify-center">
            <button
              onClick={calculateStats}
              disabled={text.trim().length === 0}
              className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
            >
              Count
            </button>
          </div>
        </div>

        {/* Cross-Promotion CTA */}
        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-800 dark:text-stone-200 font-medium mb-4 md:mb-0">
            Need to compare two documents instead?
          </div>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
          >
            Try DocSim Checker →
          </Link>
        </div>
      </div>
    </div>
  );
}
