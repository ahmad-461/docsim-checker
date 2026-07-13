import React from "react";
import { Metadata } from "next";
import InfoPageLayout, { PageH2, PageP, PageLink, PageStrong } from "../components/InfoPageLayout";
import { CONTACT_EMAIL } from "../constants";

export const metadata: Metadata = {
  title: "About DocSim Checker — Free & Private Text Comparison",
  description: "Learn about DocSim Checker's secure, private approach to side-by-side document comparison and text similarity analysis without storing your files.",
};

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
        <div className="p-8 bg-[#FAF8F5] dark:bg-[#181615] border border-[#E6DDC4] dark:border-[#2C2420] rounded-2xl shadow-sm">
          <PageP>
            DocSim Checker is a simple tool for comparing two documents and seeing how similar they are — sentence by sentence.
          </PageP>
          <PageP>
            We built it for students checking drafts, writers avoiding self-repetition, and small teams comparing document versions. It&apos;s not a substitute for institutional plagiarism detection tools like Turnitin, which check against the entire internet and academic databases — DocSim Checker only compares the two documents you give it, directly against each other.
          </PageP>
        </div>

        <section className="p-8 bg-[#FAF8F5] dark:bg-[#181615] border border-[#E6DDC4] dark:border-[#2C2420] rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-orange-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4] tracking-tight">Our approach to privacy</h2>
          </div>
          <PageP>
            We don&apos;t store your documents. Ever. Your text is processed to generate a similarity score and then discarded — nothing is saved beyond the single comparison request.
          </PageP>
        </section>

        <section className="p-8 bg-[#FAF8F5] dark:bg-[#181615] border border-[#E6DDC4] dark:border-[#2C2420] rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-orange-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4] tracking-tight">How it works</h2>
          </div>
          <PageP>
            We use a <PageLink href="/how-it-works">combination of text-matching techniques (TF-IDF) and AI-powered semantic analysis</PageLink> (via Google&apos;s Gemini API) to catch both exact matches and reworded/paraphrased similarities that simple word-matching would miss.
          </PageP>
        </section>

        <section className="p-8 bg-[#FAF8F5] dark:bg-[#181615] border border-[#E6DDC4] dark:border-[#2C2420] rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-orange-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4] tracking-tight">Who&apos;s behind this</h2>
          </div>
          <PageP>
            DocSim Checker was built by <PageStrong>Muhammad Ahmad Khan</PageStrong>, an independent developer focused on building free, privacy-first tools for writers, students, and small teams. It is an independently built project, currently in active development.
          </PageP>
          <PageP>
            The project started with a clear philosophy: software shouldn&apos;t require invasive tracking, complex accounts, or credit cards just to perform helpful, everyday utility tasks.
          </PageP>
          <PageP>
            Have feedback, feature requests, or found a bug? Please <PageLink href="/contact">Contact us</PageLink> — we are always looking to improve based on real user suggestions.
          </PageP>
        </section>

        <section className="pt-8 space-y-12">
          <div className="text-sm text-gray-500 dark:text-stone-500 border-b border-gray-100 dark:border-stone-800 pb-4">
            Last updated: <span className="font-semibold text-foreground">July 8, 2026</span>
          </div>

          <div>
            <PageH2>The Problem DocSim Checker Solves</PageH2>
            <PageP>
              Most existing plagiarism and similarity tools are built for institutions checking submitted work against enormous databases of existing content. That&apos;s a legitimate and different need than the one most individual writers, students, and small teams actually have day to day: comparing two specific documents they already have in hand to see how closely they match.
            </PageP>
            <PageP>
              DocSim Checker was built to fill that narrower gap. It doesn&apos;t check your writing against the internet or an academic database — it takes exactly two documents you provide and tells you, in detail, how similar they are to each other. That&apos;s a smaller, more specific job than full plagiarism detection, but it&apos;s the job most people actually need done most of the time: comparing draft versions, checking for accidental repetition across published work, or reviewing how much a contract or policy document changed between revisions.
            </PageP>
          </div>

          <div>
            <PageH2>Independently Built, Actively Developed</PageH2>
            <PageP>
              DocSim Checker is an independently developed project, still actively evolving. It started as a focused MVP — paste two documents, get a similarity score — and has grown to include a broader set of free writing utilities (word counting, case conversion, duplicate line removal) built on the same principle of instant, private, no-sign-up tools that solve a specific, common problem well rather than trying to be everything at once.
            </PageP>
          </div>
        </section>
      </div>
    </InfoPageLayout>
  );
}
