"use client";

import React from 'react';
import InfoPageLayout, { PageP, PageLink } from '../components/InfoPageLayout';
import AccordionItem from '../components/AccordionItem';

export default function FaqPage() {
  const faqItems = [
    {
      question: "Is my document stored anywhere?",
      answer: "No. Your documents are processed to generate a similarity score and immediately discarded. We never save your document content."
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
      answer: "We combine two methods: TF-IDF (word-overlap matching) and AI-powered semantic analysis (via Gemini), which can catch paraphrased or reworded similarities that simple word-matching would miss."
    },
    {
      question: "Why did I get a lower score than I expected?",
      answer: "Semantic matching accounts for meaning, not just exact wording — two sentences that say similar things with different words may still score high, but scores are never a perfect 1:1 with human judgment. Use the score as a signal, not an absolute answer."
    },
    {
      question: "Is this the same as Turnitin?",
      answer: "No. Turnitin (and similar tools) check your document against a massive database of academic papers, websites, and previously submitted work. DocSim Checker only compares the two documents you provide, directly against each other — it does not check against the internet or any external database."
    },
    {
      question: "Do I need an account?",
      answer: "No. The free tier works with no sign-up required. Your usage is tracked anonymously via your hashed IP address."
    },
    {
      question: "Is there a paid plan?",
      answer: "A Pro tier is planned for higher daily limits and additional features, but it is not yet available."
    },
    {
      question: "Something went wrong or the score looks incorrect?",
      answer: "Contact us with details and we'll look into it."
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
          <PageP><PageLink href="/contact">Contact us</PageLink> with details and we&apos;ll look into it.</PageP>
        </AccordionItem>
      </div>
    </InfoPageLayout>
  );
}
