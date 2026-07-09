"use client";

import React, { useState, ChangeEvent } from 'react';
import InfoPageLayout from '../../components/InfoPageLayout';

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
            <div className="hidden sm:block text-xs font-medium text-gray-400 dark:text-stone-500 italic">
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
                  className="px-6 py-3 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-full text-sm font-bold text-gray-700 dark:text-stone-300 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-500 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
}
