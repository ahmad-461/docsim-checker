import React from 'react';
import InfoPageLayout, { PageP, PageLink } from '../components/InfoPageLayout';
import { CONTACT_EMAIL } from '../constants';

export default function AboutPage() {
  return (
    <InfoPageLayout
      title="About DocSim Checker"
      subtitle="Built for writers, students, and teams who care about originality."
      cta={{
        label: "Try it now →",
        href: "/#tool"
      }}
    >
      <div className="space-y-8">
        <div className="p-8 bg-card border border-card-border rounded-2xl shadow-sm">
          <PageP>
            DocSim Checker is a simple tool for comparing two documents and seeing how similar they are — sentence by sentence.
          </PageP>
          <PageP>
            We built it for students checking drafts, writers avoiding self-repetition, and small teams comparing document versions. It&apos;s not a substitute for institutional plagiarism detection tools like Turnitin, which check against the entire internet and academic databases — DocSim Checker only compares the two documents you give it, directly against each other.
          </PageP>
        </div>

        <section className="p-8 bg-card border border-card-border rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-orange-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Our approach to privacy</h2>
          </div>
          <PageP>
            We don&apos;t store your documents. Ever. Your text is processed to generate a similarity score and then discarded — nothing is saved beyond the single comparison request.
          </PageP>
        </section>

        <section className="p-8 bg-card border border-card-border rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-orange-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">How it works</h2>
          </div>
          <PageP>
            We use a combination of text-matching techniques (TF-IDF) and AI-powered semantic analysis (via Google&apos;s Gemini API) to catch both exact matches and reworded/paraphrased similarities that simple word-matching would miss.
          </PageP>
        </section>

        <section className="p-8 bg-card border border-card-border rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-orange-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Who&apos;s behind this</h2>
          </div>
          <PageP>
            DocSim Checker is an independently built tool, currently in active development. Have feedback or found a bug? <PageLink href={`mailto:${CONTACT_EMAIL}`}>Contact us</PageLink>.
          </PageP>
        </section>
      </div>
    </InfoPageLayout>
  );
}
