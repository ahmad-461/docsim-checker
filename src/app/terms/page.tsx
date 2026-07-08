import React from 'react';
import InfoPageLayout, { PageP, PageStrong, PageH2, PageUl, PageLi } from '../components/InfoPageLayout';
import { POLICY_DATE } from '../constants';

export default function TermsPage() {
  return (
    <InfoPageLayout
      title="Terms of Use"
      subtitle="The fine print, made readable"
    >
      <PageP>Last Updated: <PageStrong>{POLICY_DATE}</PageStrong></PageP>

      <PageP>
        By using DocSim Checker, you agree to the following terms. Please read them carefully.
      </PageP>

      <PageH2>1. Acceptance of Terms</PageH2>
      <PageP>
        DocSim Checker provides a web-based document comparison tool. By accessing or using our website, you agree to be bound by these Terms of Use and our Privacy Policy.
      </PageP>

      <PageH2>2. Use of Service</PageH2>
      <PageP>
        You may use DocSim Checker for lawful purposes only. You agree not to:
      </PageP>
      <PageUl>
        <PageLi>Attempt to bypass rate limits or other security measures.</PageLi>
        <PageLi>Use the service for automated bulk document processing without explicit permission.</PageLi>
        <PageLi>Upload content that is illegal, harmful, or violates the intellectual property rights of others.</PageLi>
      </PageUl>

      <PageH2>3. Disclaimer of Accuracy</PageH2>
      <PageP>
        DocSim Checker provides similarity scores based on algorithmic and AI analysis. These scores are for informational purposes only. We do not guarantee that the tool will identify 100% of similarities, nor that every identified similarity indicates plagiarism or improper copying. Human judgment is always required to interpret the results.
      </PageP>

      <PageH2>4. Limitation of Liability</PageH2>
      <PageP>
        The service is provided &quot;as is&quot; without warranties of any kind. DocSim Checker shall not be liable for any damages arising from your use of the tool, including but not limited to academic or professional consequences based on the tool&apos;s results.
      </PageP>

      <PageH2>5. Termination</PageH2>
      <PageP>
        We reserve the right to block access to the service for any user who violates these terms or engages in abusive behavior that threatens the stability of the platform.
      </PageP>
    </InfoPageLayout>
  );
}
