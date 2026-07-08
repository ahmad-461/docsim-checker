import React from 'react';
import InfoPageLayout, { PageH2, PageP, PageLink, PageUl, PageLi, PageStrong } from '../components/InfoPageLayout';
import { CONTACT_EMAIL, POLICY_DATE } from '../constants';

export default function PrivacyPage() {
  return (
    <InfoPageLayout title="Privacy Policy">
      <PageP>Last updated: {POLICY_DATE}</PageP>

      <PageH2>What we collect</PageH2>
      <PageP>
        <PageStrong>Document content:</PageStrong> We do not store the text or files you upload or paste. Documents are processed in memory to generate a similarity comparison and are discarded immediately after the response is returned. We never write your document content to a database or disk.
      </PageP>
      <PageP>
        <PageStrong>Usage data:</PageStrong> To enforce our free daily usage limit, we store a hashed version of your IP address along with a date and a usage count. We do not store your raw IP address — it is hashed before storage and cannot be reversed to identify you individually. This data is used solely for rate limiting and is not shared with third parties.
      </PageP>
      <PageP>
        <PageStrong>Third-party processing:</PageStrong> When semantic similarity is enabled, sentence text is sent to Google&apos;s Gemini API for embedding generation. This is subject to Google&apos;s own data handling policies. We do not control or store what Google does with this data beyond the single API request/response cycle we initiate.
      </PageP>

      <PageH2>What we don&apos;t do</PageH2>
      <PageUl>
        <PageLi>We don&apos;t sell or share your data with advertisers</PageLi>
        <PageLi>We don&apos;t use your documents to train any models</PageLi>
        <PageLi>We don&apos;t require an account, email, or personal information to use the free tier</PageLi>
      </PageUl>

      <PageH2>Cookies</PageH2>
      <PageP>
        We do not currently use tracking or advertising cookies.
      </PageP>

      <PageH2>Changes to this policy</PageH2>
      <PageP>
        We may update this policy as the product evolves. Continued use of the site after changes constitutes acceptance of the updated policy.
      </PageP>

      <PageH2>Contact</PageH2>
      <PageP>
        Questions about this policy? <PageLink href={`mailto:${CONTACT_EMAIL}`}>Contact us</PageLink>.
      </PageP>
    </InfoPageLayout>
  );
}
