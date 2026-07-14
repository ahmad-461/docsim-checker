"use client";

import React, { useState, useRef, ChangeEvent } from 'react';

interface DocumentInputProps {
  label: string;
  onContentChange: (content: { type: 'text' | 'file'; content: string; filename?: string }) => void;
  error?: string;
  value?: string;
}

const DocumentInput: React.FC<DocumentInputProps> = ({ label, onContentChange, error, value }) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (!file) {
      onContentChange({ type: 'text', content: newText });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        alert("File too large. Max 2MB.");
        return;
      }
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Content = (event.target?.result as string).split(',')[1];
        onContentChange({
          type: 'file',
          content: base64Content,
          filename: selectedFile.name
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onContentChange({ type: 'text', content: '' });
  };

  const textareaId = `textarea-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const isDocA = label.toLowerCase().includes('a');
  const docLetter = isDocA ? 'A' : 'B';

  return (
    <div className="flex flex-col space-y-4 bg-card dark:bg-[#181615] p-6 sm:p-8 rounded-2xl border border-card-border dark:border-[#2C2420] shadow-md hover:shadow-lg dark:shadow-none dark:hover:shadow-none transition-all duration-300 focus-within:border-orange-600 dark:focus-within:border-orange-500 relative">
      {/* Editorial Header */}
      <div className="flex items-center justify-between border-b border-card-border/60 dark:border-[#2C2420]/60 pb-3">
        <span className="font-editorial text-xl font-bold text-[#1A1A1A] dark:text-[#F5F5F4] tracking-tight flex items-center gap-2">
          <span className="text-orange-600 dark:text-orange-500 font-editorial font-bold">Doc {docLetter}</span>
          <span className="text-stone-300 dark:text-stone-700">|</span>
          <span className="text-xs font-mono tracking-widest text-stone-500 dark:text-stone-400 uppercase font-bold">Manuscript</span>
        </span>
        {/* Paper line indicator / circles in top corner to match animated hero */}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700" />
          <span className="w-1.5 h-1.5 rounded-full bg-stone-200 dark:bg-stone-800" />
        </div>
      </div>

      <div className="relative flex-1">
        <textarea
          id={textareaId}
          className={`w-full h-64 p-0 bg-transparent border-0 resize-none outline-none focus:outline-none focus:ring-0 text-[#1A1A1A] dark:text-[#F5F5F4] leading-relaxed transition-all duration-200 ${
            file
              ? 'text-stone-400 dark:text-stone-500 italic font-editorial font-medium'
              : 'placeholder:font-editorial placeholder:italic placeholder:font-medium placeholder:text-stone-400/80 dark:placeholder:text-stone-500/80'
          }`}
          placeholder={file ? "Using uploaded file..." : "Paste document text here..."}
          value={file ? "" : (value || "")}
          onChange={handleTextChange}
          readOnly={!!file}
        />
        {file && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-3 p-5 bg-orange-50/50 dark:bg-orange-950/10 border border-orange-200/40 dark:border-orange-900/30 rounded-2xl max-w-xs text-center shadow-sm animate-in fade-in zoom-in-95 duration-300">
              <svg className="w-10 h-10 text-orange-600 dark:text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p className="text-sm font-bold text-stone-800 dark:text-stone-200 truncate max-w-[200px]">
                  {file.name}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  File content loaded successfully
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 border-t border-card-border/60 dark:border-[#2C2420]/60 pt-3">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt,.pdf,.docx"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 bg-white/50 dark:bg-stone-900/50 border border-card-border dark:border-stone-800 rounded-xl hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50/20 dark:hover:bg-orange-950/15 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
          >
            {file ? "Change File" : "Upload File"}
          </button>
          {file && (
            <button
              type="button"
              onClick={clearFile}
              className="text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors cursor-pointer px-3 py-2"
            >
              Remove
            </button>
          )}
        </div>
        <span className="text-xs font-mono tracking-wide text-stone-500 dark:text-stone-400">.txt, .pdf, .docx (max 2MB)</span>
      </div>
      {error && (
        <p className="text-xs font-mono text-red-600 dark:text-red-400 mt-2 flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400" />
          {error}
        </p>
      )}
    </div>
  );
};

export default DocumentInput;
