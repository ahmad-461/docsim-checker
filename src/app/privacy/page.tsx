import React from "react";
import { Metadata } from "next";
import InfoPageLayout, { PageP, PageStrong, PageUl, PageLi } from "../components/InfoPageLayout";
import { POLICY_DATE } from "../constants";

export const metadata: Metadata = {
  title: "Privacy Policy — DocSim Checker",
  description: "Read the DocSim Checker Privacy Policy. Learn about our commitment to your privacy, text handling practices, and our strict zero-document-storage model.",
};

export default function PrivacyPage() {
  return (
    <InfoPageLayout
      title="Privacy Policy"
      subtitle="Your documents are never stored. Here's exactly how we handle your data."
    >
      <div className="space-y-8">
        <div className="p-8 bg-card border border-card-border rounded-2xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-stone-800">
            <div>
              <PageP>Last Updated: <PageStrong>{POLICY_DATE}</PageStrong></PageP>
            </div>
            <div className="text-sm">
              <span className="text-gray-500 dark:text-stone-500 mr-2 font-medium">Jump to:</span>
              <nav className="inline-flex flex-wrap gap-x-4 gap-y-2">
                <a href="#documents" className="text-orange-600 hover:underline font-medium">Documents</a>
                <a href="#logging" className="text-orange-600 hover:underline font-medium">Logging</a>
                <a href="#cookies" className="text-orange-600 hover:underline font-medium">Cookies</a>
                <a href="#changes" className="text-orange-600 hover:underline font-medium">Changes</a>
              </nav>
            </div>
          </div>
          <PageP>
            At DocSim Checker, we take your privacy seriously. This policy explains how we handle your data when you use our document comparison tool.
          </PageP>
        </div>

        <section id="documents" className="p-8 bg-card border border-card-border rounded-2xl shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-orange-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">1. Document Data</h2>
          </div>
          <PageP>
            <PageStrong>We do not store your documents.</PageStrong>{" "}When you upload a file or paste text for comparison:
          </PageP>
          <PageUl>
            <PageLi>The text is processed in-memory to calculate similarity scores.</PageLi>
            <PageLi>For AI-powered analysis, text segments are sent to Google&apos;s Gemini API via a secure, private connection. Google&apos;s enterprise privacy terms generally ensure that data sent via their API is not used to train their models.</PageLi>
            <PageLi>Immediately after the comparison is complete and results are shown to you, the document content is discarded from our servers.</PageLi>
          </PageUl>
        </section>

        <section id="logging" className="p-8 bg-card border border-card-border rounded-2xl shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-orange-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20c4.478 0 8.268-2.943 9.542-7H21m-9-4v10m0-10a3 3 0 013 3v2a3 3 0 01-3 3m0-8a3 3 0 00-3 3v2a3 3 0 003 3m0-10V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">2. Usage Logging</h2>
          </div>
          <PageP>
            To prevent abuse and enforce our free tier limits (3 comparisons per day), we store a{" "}<PageStrong>one-way hash</PageStrong>{" "}of your IP address. We do not store your raw IP address, and we cannot reverse this hash to identify you. This log is used solely for rate limiting.
          </PageP>
        </section>

        <section id="cookies" className="p-8 bg-card border border-card-border rounded-2xl shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-orange-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">3. Cookies and Analytics</h2>
          </div>
          <PageP>
            DocSim Checker does not use tracking cookies or third-party marketing trackers. We may use basic, privacy-respecting analytics to understand general site traffic patterns without identifying individual users.
          </PageP>
        </section>

        <section id="changes" className="p-8 bg-card border border-card-border rounded-2xl shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-orange-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">4. Changes to This Policy</h2>
          </div>
          <PageP>
            We may update this policy occasionally. Any changes will be posted on this page with an updated &quot;Last Updated&quot; date.
          </PageP>
        </section>
      </div>
    </InfoPageLayout>
  );
}
