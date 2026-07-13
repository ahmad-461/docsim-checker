import React from "react";
import { Metadata } from "next";
import InfoPageLayout, { PageP } from "../components/InfoPageLayout";

export const metadata: Metadata = {
  title: "How DocSim Checker Works — AI-Powered Similarity Detection",
  description: "Discover how DocSim Checker uses a combination of advanced text-matching (TF-IDF) and semantic AI embeddings to analyze and highlight document overlap.",
};

const Step = ({ number, title, description }: { number: number; title: string; description: string }) => (
  <div className="flex gap-6 mb-12 last:mb-0">
    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm">
      {number}
    </div>
    <div>
      <h2 className="text-2xl font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4] mb-2">{title}</h2>
      <p className="text-lg text-stone-600 dark:text-stone-300 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default function HowItWorksPage() {
  return (
    <InfoPageLayout
      title="How It Works"
      subtitle="From upload to results in seconds"
    >
      <div className="mb-10 p-6 bg-orange-50/50 dark:bg-orange-950/10 border-l-4 border-orange-500 rounded-r-xl shadow-sm">
        <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
          <span className="font-bold text-orange-600 dark:text-orange-400">Important:</span> DocSim Checker compares your two documents directly against each other. It does not search the public internet or external academic databases like Turnitin or Copyleaks. This direct comparison model is what enables our strict privacy promise.
        </p>
      </div>

      <div className="bg-[#FAF8F5] dark:bg-[#181615] rounded-3xl p-8 md:p-12 border border-[#E6DDC4] dark:border-[#2C2420] shadow-sm mb-12">
        <Step
          number={1}
          title="Input Documents"
          description="Upload PDFs, Word docs, or paste text directly into the two comparison slots. We support .txt, .pdf, and .docx files up to 2MB each."
        />
        <Step
          number={2}
          title="AI-Powered Analysis"
          description="Our system uses a blend of TF-IDF (keyword matching) and Gemini AI embeddings to understand the semantic meaning of your text, not just exact word matches. This allows us to catch paraphrased or reworded content."
        />
        <Step
          number={3}
          title="Detailed Results"
          description="Get an overall similarity score and a side-by-side comparison with matching sentences highlighted. Darker highlights indicate stronger matches, helping you pinpoint overlapping content quickly."
        />
      </div>

      <div className="bg-[#FAF8F5] dark:bg-[#181615] rounded-3xl p-8 md:p-12 border border-[#E6DDC4] dark:border-[#2C2420] space-y-6 shadow-sm">
        <h2 className="text-2xl font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4] mb-4">Under the Hood: Our Hybrid Similarity Engine</h2>

        <div className="space-y-4">
          <h3 className="text-lg font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4]">1. Syntactic Alignment (TF-IDF &amp; Cosine Similarity)</h3>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
            The first layer of our analysis pipeline parses documents into individual word tokens, filters out common stop-words, and calculates a TF-IDF (Term Frequency–Inverse Document Frequency) score for each term. This score reflects how unique or distinctive a word is within the context of the compared text blocks. The documents are then modeled as vector representations, and we compute the Cosine Similarity between them. This statistical baseline ensures we catch exact phrasing, duplicate clauses, and direct copy-paste edits with high precision.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-[#E6DDC4] dark:border-[#2C2420]">
          <h3 className="text-lg font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4]">2. Semantic AI Mapping (Google Gemini Embeddings)</h3>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
            Standard keyword matching is blind to heavy paraphrasing and re-wording. To solve this, our second analysis layer generates dense mathematical vector representations of each sentence using Google&apos;s advanced Gemini embedding model. These embeddings map sentences into a multi-dimensional semantic space where sentences with identical or highly similar meanings are positioned close to one another, regardless of whether they share any vocabulary. Computing the proximity of these semantic vectors allows us to accurately highlight heavily rephrased or plagiarized ideas.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-[#E6DDC4] dark:border-[#2C2420]">
          <h3 className="text-lg font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4]">3. Honest Boundaries &amp; Direct Comparison</h3>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
            Unlike commercial plagiarism checkers, we don&apos;t index our users&apos; papers or check them against the public web or third-party academic catalogs. DocSim Checker operates strictly as a side-by-side comparison engine. By limiting our comparison scope directly to the two files you provide, we eliminate any risk of your work being stored, leaked, or flagged as self-plagiarism in institutional systems. It is a focused, mathematically precise, and privacy-first implementation.
          </p>
        </div>
      </div>
    </InfoPageLayout>
  );
}
