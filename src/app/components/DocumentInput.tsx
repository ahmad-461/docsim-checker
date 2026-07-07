"use client";

import React, { useState, useRef, ChangeEvent } from 'react';

interface DocumentInputProps {
  label: string;
  onContentChange: (content: { type: 'text' | 'file'; content: string; filename?: string }) => void;
  error?: string;
}

const DocumentInput: React.FC<DocumentInputProps> = ({ label, onContentChange, error }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
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
    onContentChange({ type: 'text', content: text });
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <textarea
          className={`w-full h-64 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
            file ? 'bg-gray-100 text-gray-500 italic' : 'bg-white'
          }`}
          placeholder={file ? "Using uploaded file..." : "Paste document text here..."}
          value={file ? "" : text}
          onChange={handleTextChange}
          readOnly={!!file}
        />
        {file && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-white px-3 py-1 rounded-full border shadow-sm text-sm font-medium text-gray-700">
              File: {file.name}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
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
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            {file ? "Change File" : "Upload File"}
          </button>
          {file && (
            <button
              type="button"
              onClick={clearFile}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          )}
        </div>
        <span className="text-xs text-gray-400">.txt, .pdf, .docx (max 2MB)</span>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default DocumentInput;
