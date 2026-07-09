import React from 'react';
import InfoPageLayout, { PageP, PageStrong, PageUl, PageLi } from '../components/InfoPageLayout';
import { POLICY_DATE, CONTACT_EMAIL } from '../constants';

export default function TermsPage() {
  return (
    <InfoPageLayout
      title="Terms of Use"
      subtitle="The ground rules for using DocSim Checker."
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
                <a href="#acceptance" className="text-orange-600 hover:underline font-medium">Acceptance</a>
                <a href="#use" className="text-orange-600 hover:underline font-medium">Use</a>
                <a href="#accuracy" className="text-orange-600 hover:underline font-medium">Accuracy</a>
                <a href="#liability" className="text-orange-600 hover:underline font-medium">Liability</a>
                <a href="#termination" className="text-orange-600 hover:underline font-medium">Termination</a>
              </nav>
            </div>
          </div>
          <PageP>
            By using DocSim Checker, you agree to the following terms. Please read them carefully.
          </PageP>
        </div>

        <section id="acceptance" className="p-8 bg-card border border-card-border rounded-2xl shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-orange-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">1. Acceptance of Terms</h2>
          </div>
          <PageP>
            DocSim Checker provides a web-based document comparison tool. By accessing or using our website, you agree to be bound by these Terms of Use and our Privacy Policy.
          </PageP>
        </section>

        <section id="use" className="p-8 bg-card border border-card-border rounded-2xl shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-orange-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">2. Use of Service</h2>
          </div>
          <PageP>
            You may use DocSim Checker for lawful purposes only. You agree not to:
          </PageP>
          <PageUl>
            <PageLi>Attempt to bypass rate limits or other security measures.</PageLi>
            <PageLi>Use the service for automated bulk document processing without explicit permission.</PageLi>
            <PageLi>Upload content that is illegal, harmful, or violates the intellectual property rights of others.</PageLi>
          </PageUl>
        </section>

        <section id="accuracy" className="p-8 bg-card border border-card-border rounded-2xl shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-orange-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">3. Disclaimer of Accuracy</h2>
          </div>
          <PageP>
            DocSim Checker provides similarity scores based on algorithmic and AI analysis. These scores are for informational purposes only. We do not guarantee that the tool will identify 100% of similarities, nor that every identified similarity indicates plagiarism or improper copying. Human judgment is always required to interpret the results.
          </PageP>
        </section>

        <section id="liability" className="p-8 bg-card border border-card-border rounded-2xl shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-orange-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m3.382-7.031A7 7 0 111.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">4. Limitation of Liability</h2>
          </div>
          <PageP>
            The service is provided &quot;as is&quot; without warranties of any kind. DocSim Checker shall not be liable for any damages arising from your use of the tool, including but not limited to academic or professional consequences based on the tool&apos;s results.
          </PageP>
        </section>

        <section id="termination" className="p-8 bg-card border border-card-border rounded-2xl shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-orange-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">5. Termination</h2>
          </div>
          <PageP>
            We reserve the right to block access to the service for any user who violates these terms or engages in abusive behavior that threatens the stability of the platform.
          </PageP>
        </section>

        <section className="p-8 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-2xl text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">Have questions?</h3>
          <p className="text-gray-600 dark:text-stone-400 mb-6">If you have any questions about these Terms of Use, please contact us.</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center px-8 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-all shadow-sm"
          >
            Contact Support
          </a>
        </section>
      </div>
    </InfoPageLayout>
  );
}
