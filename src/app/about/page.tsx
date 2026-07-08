import React from 'react';
import InfoPageLayout, { PageH2, PageP, PageLink } from '../components/InfoPageLayout';
import { CONTACT_EMAIL } from '../constants';

const SectionDivider = () => (
  <div className="my-16 border-t border-gray-100 w-24 mx-auto" />
);

export default function AboutPage() {
  return (
    <InfoPageLayout
      title="About DocSim Checker"
      subtitle="The story behind DocSim Checker"
    >
      <div className="space-y-6">
        <PageP>
          DocSim Checker is a simple tool for comparing two documents and seeing how similar they are — sentence by sentence.
        </PageP>
        <PageP>
          We built it for students checking drafts, writers avoiding self-repetition, and small teams comparing document versions. It&apos;s not a substitute for institutional plagiarism detection tools like Turnitin, which check against the entire internet and academic databases — DocSim Checker only compares the two documents you give it, directly against each other.
        </PageP>
      </div>

      <SectionDivider />

      <section>
        <PageH2>Our approach to privacy</PageH2>
        <PageP>
          We don&apos;t store your documents. Ever. Your text is processed to generate a similarity score and then discarded — nothing is saved beyond the single comparison request.
        </PageP>
      </section>

      <SectionDivider />

      <section>
        <PageH2>How it works</PageH2>
        <PageP>
          We use a combination of text-matching techniques (TF-IDF) and AI-powered semantic analysis (via Google&apos;s Gemini API) to catch both exact matches and reworded/paraphrased similarities that simple word-matching would miss.
        </PageP>
      </section>

      <SectionDivider />

      <section>
        <PageH2>Who&apos;s behind this</PageH2>
        <PageP>
          DocSim Checker is an independently built tool, currently in active development. Have feedback or found a bug? <PageLink href={`mailto:${CONTACT_EMAIL}`}>Contact us</PageLink>.
        </PageP>
      </section>
    </InfoPageLayout>
  );
}
