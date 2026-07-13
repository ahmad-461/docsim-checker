"use client";

import React from 'react';
import InfoPageLayout, { PageP, PageLink } from '../components/InfoPageLayout';
import AccordionItem from '../components/AccordionItem';

export default function FaqPage() {
  const faqItems = [
    {
      question: "Do I need an account, and is my document stored anywhere?",
      answer: "No. The free tier works with no sign-up required. Your documents are processed in memory to generate a similarity score and immediately discarded — nothing is stored or saved."
    },
    {
      question: "How many comparisons can I run for free?",
      answer: "Free users get 3 comparisons per day. The limit resets daily at midnight UTC."
    },
    {
      question: "What file types are supported?",
      answer: ".txt, .pdf, and .docx files, up to 2MB each. You can also paste text directly instead of uploading a file."
    },
    {
      question: "How is the similarity score calculated?",
      answer: "We combine TF-IDF (word-overlap matching) and AI semantic analysis (via Gemini) to catch exact matches and reworded/paraphrased similarities."
    },
    {
      question: "Why did I get a lower score than I expected?",
      answer: "AI semantic matching accounts for meaning, not just wording. Use the overall score as a diagnostic signal rather than a perfect 1:1 human evaluation."
    },
    {
      question: "Is this the same as Turnitin?",
      answer: "No. DocSim Checker only compares the two documents you provide directly against each other. It does not scan the public internet or external academic databases."
    },
    {
      question: "Is there a paid plan?",
      answer: "A Pro tier is planned for higher daily limits and additional features, but it is not yet available."
    },
    {
      question: "Something went wrong or the score looks incorrect?",
      answer: "Please contact us with any issue details and we will investigate it."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <InfoPageLayout
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about how DocSim Checker works."
      cta={{
        label: "Still have questions? Contact us",
        href: "/contact",
        style: "subtle"
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="text-sm text-gray-500 dark:text-stone-500 mb-6 text-center">
        Last updated: <span className="font-semibold text-foreground">July 8, 2026</span>
      </div>

      <div className="bg-card rounded-3xl border border-card-border shadow-sm px-8 overflow-hidden">
        <AccordionItem question="Do I need an account, and is my document stored anywhere?">
          <PageP>No. The free tier works with no sign-up required. Your documents are processed in memory to generate a similarity score and immediately discarded — nothing is stored or saved.</PageP>
        </AccordionItem>

        <AccordionItem question="How many comparisons can I run for free?">
          <PageP>Free users get 3 comparisons per day. The limit resets daily at midnight UTC.</PageP>
        </AccordionItem>

        <AccordionItem question="What file types are supported?">
          <PageP>.txt, .pdf, and .docx files, up to 2MB each. You can also paste text directly instead of uploading a file.</PageP>
        </AccordionItem>

        <AccordionItem question="How is the similarity score calculated?">
          <PageP>We combine TF-IDF (word-overlap matching) and AI semantic analysis (via Gemini) to catch exact matches and reworded/paraphrased similarities.</PageP>
        </AccordionItem>

        <AccordionItem question="Why did I get a lower score than I expected?">
          <PageP>AI semantic matching accounts for meaning, not just wording. Use the overall score as a diagnostic signal rather than a perfect 1:1 human evaluation.</PageP>
        </AccordionItem>

        <AccordionItem question="Is this the same as Turnitin?">
          <PageP>No. DocSim Checker only compares the two documents you provide directly against each other. It does not scan the public internet or external academic databases.</PageP>
        </AccordionItem>

        <AccordionItem question="Is there a paid plan?">
          <PageP>A Pro tier is planned for higher daily limits and additional features, but it is not yet available.</PageP>
        </AccordionItem>

        <AccordionItem question="Something went wrong or the score looks incorrect?">
          <PageP>Please <PageLink href="/contact">contact us</PageLink> with any issue details and we will investigate it.</PageP>
        </AccordionItem>
      </div>
    </InfoPageLayout>
  );
}
