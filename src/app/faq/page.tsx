"use client";

import React, { useState } from 'react';
import InfoPageLayout, { PageP, PageLink } from '../components/InfoPageLayout';
import { CONTACT_EMAIL } from '../constants';

const AccordionItem = ({ question, children }: { question: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 dark:border-stone-800 last:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
      >
        <span className={`text-xl font-bold transition-colors ${isOpen ? 'text-orange-600' : 'text-foreground group-hover:text-orange-600'}`}>
          {question}
        </span>
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

export default function FaqPage() {
  return (
    <InfoPageLayout
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about how DocSim Checker works."
      cta={{
        label: "Still have questions? Contact us",
        href: `mailto:${CONTACT_EMAIL}`,
        style: "subtle"
      }}
    >
      <div className="bg-card rounded-3xl border border-card-border shadow-sm px-8 overflow-hidden">
        <AccordionItem question="Is my document stored anywhere?">
          <PageP>No. Your documents are processed to generate a similarity score and immediately discarded. We never save your document content.</PageP>
        </AccordionItem>

        <AccordionItem question="How many comparisons can I run for free?">
          <PageP>Free users get 3 comparisons per day. The limit resets daily at midnight UTC.</PageP>
        </AccordionItem>

        <AccordionItem question="What file types are supported?">
          <PageP>.txt, .pdf, and .docx files, up to 2MB each. You can also paste text directly instead of uploading a file.</PageP>
        </AccordionItem>

        <AccordionItem question="How is the similarity score calculated?">
          <PageP>We combine two methods: TF-IDF (word-overlap matching) and AI-powered semantic analysis (via Gemini), which can catch paraphrased or reworded similarities that simple word-matching would miss.</PageP>
        </AccordionItem>

        <AccordionItem question="Why did I get a lower score than I expected?">
          <PageP>Semantic matching accounts for meaning, not just exact wording — two sentences that say similar things with different words may still score high, but scores are never a perfect 1:1 with human judgment. Use the score as a signal, not an absolute answer.</PageP>
        </AccordionItem>

        <AccordionItem question="Is this the same as Turnitin?">
          <PageP>No. Turnitin (and similar tools) check your document against a massive database of academic papers, websites, and previously submitted work. DocSim Checker only compares the two documents you provide, directly against each other — it does not check against the internet or any external database.</PageP>
        </AccordionItem>

        <AccordionItem question="Do I need an account?">
          <PageP>No. The free tier works with no sign-up required. Your usage is tracked anonymously via your hashed IP address.</PageP>
        </AccordionItem>

        <AccordionItem question="Is there a paid plan?">
          <PageP>A Pro tier is planned for higher daily limits and additional features, but it is not yet available.</PageP>
        </AccordionItem>

        <AccordionItem question="Something went wrong or the score looks incorrect?">
          <PageP><PageLink href={`mailto:${CONTACT_EMAIL}`}>Contact us</PageLink> with details and we&apos;ll look into it.</PageP>
        </AccordionItem>
      </div>
    </InfoPageLayout>
  );
}
