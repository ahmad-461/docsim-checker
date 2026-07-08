import React from 'react';
import InfoPageLayout, { PageP, PageStrong, PageH2, PageUl, PageLi } from '../components/InfoPageLayout';
import { POLICY_DATE } from '../constants';

export default function PrivacyPage() {
  return (
    <InfoPageLayout
      title="Privacy Policy"
      subtitle="How we handle (and don't store) your data"
    >
      <PageP>Last Updated: <PageStrong>{POLICY_DATE}</PageStrong></PageP>

      <PageP>
        At DocSim Checker, we take your privacy seriously. This policy explains how we handle your data when you use our document comparison tool.
      </PageP>

      <PageH2>1. Document Data</PageH2>
      <PageP>
        <PageStrong>We do not store your documents.</PageStrong> When you upload a file or paste text for comparison:
      </PageP>
      <PageUl>
        <PageLi>The text is processed in-memory to calculate similarity scores.</PageLi>
        <PageLi>For AI-powered analysis, text segments are sent to Google&apos;s Gemini API via a secure, private connection. Google&apos;s enterprise privacy terms generally ensure that data sent via their API is not used to train their models.</PageLi>
        <PageLi>Immediately after the comparison is complete and results are shown to you, the document content is discarded from our servers.</PageLi>
      </PageUl>

      <PageH2>2. Usage Logging</PageH2>
      <PageP>
        To prevent abuse and enforce our free tier limits (3 comparisons per day), we store a <PageStrong>one-way hash</PageStrong> of your IP address. We do not store your raw IP address, and we cannot reverse this hash to identify you. This log is used solely for rate limiting.
      </PageP>

      <PageH2>3. Cookies and Analytics</PageH2>
      <PageP>
        DocSim Checker does not use tracking cookies or third-party marketing trackers. We may use basic, privacy-respecting analytics to understand general site traffic patterns without identifying individual users.
      </PageP>

      <PageH2>4. Changes to This Policy</PageH2>
      <PageP>
        We may update this policy occasionally. Any changes will be posted on this page with an updated &quot;Last Updated&quot; date.
      </PageP>
    </InfoPageLayout>
  );
}
