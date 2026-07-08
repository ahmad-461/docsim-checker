import React from 'react';
import InfoPageLayout, { PageP, PageLink, PageStrong } from '../components/InfoPageLayout';
import { CONTACT_EMAIL } from '../constants';

const FaqItem = ({ question, children }: { question: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <PageP><PageStrong>{question}</PageStrong></PageP>
    <div className="-mt-4">
      {children}
    </div>
  </div>
);

export default function FaqPage() {
  return (
    <InfoPageLayout title="Frequently Asked Questions">
      <FaqItem question="Is my document stored anywhere?">
        <PageP>No. Your documents are processed to generate a similarity score and immediately discarded. We never save your document content.</PageP>
      </FaqItem>

      <FaqItem question="How many comparisons can I run for free?">
        <PageP>Free users get 3 comparisons per day. The limit resets daily.</PageP>
      </FaqItem>

      <FaqItem question="What file types are supported?">
        <PageP>.txt, .pdf, and .docx files, up to 2MB each. You can also paste text directly instead of uploading a file.</PageP>
      </FaqItem>

      <FaqItem question="How is the similarity score calculated?">
        <PageP>We combine two methods: TF-IDF (word-overlap matching) and AI-powered semantic analysis (via Gemini), which can catch paraphrased or reworded similarities that simple word-matching would miss.</PageP>
      </FaqItem>

      <FaqItem question="Why did I get a lower score than I expected?">
        <PageP>Semantic matching accounts for meaning, not just exact wording — two sentences that say similar things with different words may still score high, but scores are never a perfect 1:1 with human judgment. Use the score as a signal, not an absolute answer.</PageP>
      </FaqItem>

      <FaqItem question="Is this the same as Turnitin?">
        <PageP>No. Turnitin (and similar tools) check your document against a massive database of academic papers, websites, and previously submitted work. DocSim Checker only compares the two documents you provide, directly against each other — it does not check against the internet or any external database.</PageP>
      </FaqItem>

      <FaqItem question="Do I need an account?">
        <PageP>No. The free tier works with no sign-up required.</PageP>
      </FaqItem>

      <FaqItem question="Is there a paid plan?">
        <PageP>A Pro tier is planned for higher daily limits and additional features, but it is not yet available.</PageP>
      </FaqItem>

      <FaqItem question="Something went wrong or the score looks incorrect — what do I do?">
        <PageP><PageLink href={`mailto:${CONTACT_EMAIL}`}>Contact us</PageLink> with details and we&apos;ll look into it.</PageP>
      </FaqItem>
    </InfoPageLayout>
  );
}
