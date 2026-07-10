'use client';

import React, { useState } from 'react';

interface AccordionItemProps {
  question: string;
  children: React.ReactNode;
}

const AccordionItem = ({ question, children }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 dark:border-stone-800 last:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
      >
        <h3 className={`text-xl font-bold transition-colors ${isOpen ? 'text-orange-600' : 'text-foreground group-hover:text-orange-600'}`}>
          {question}
        </h3>
        <span className={`ml-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180 text-orange-600' : 'text-gray-400 dark:text-stone-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="text-gray-600 dark:text-stone-400">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
