import React from 'react';
import InfoPageLayout, { PageP } from '../components/InfoPageLayout';

const Step = ({ number, title, description }: { number: number, title: string, description: string }) => (
  <div className="flex gap-6 mb-12 last:mb-0">
    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm">
      {number}
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default function HowItWorksPage() {
  return (
    <InfoPageLayout
      title="How It Works"
      subtitle="From upload to results in seconds"
    >
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm mb-12">
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

      <div className="bg-orange-50 rounded-3xl p-8 md:p-12 border border-orange-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Our Technology</h3>
        <PageP>
          DocSim Checker leverages state-of-the-art Large Language Models via Google's Gemini API to generate vector embeddings of your text. These embeddings represent the "meaning" of sentences in a high-dimensional space. By calculating the cosine similarity between these vectors, we can identify sentences that are semantically similar even if they use different vocabulary.
        </PageP>
      </div>
    </InfoPageLayout>
  );
}
