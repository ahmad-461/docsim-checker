'use client';

import React, { useState } from 'react';
import InfoPageLayout from '../components/InfoPageLayout';
import Link from 'next/link';
import AccordionItem from '../components/AccordionItem';

const PriceCard = ({
  name,
  price,
  period,
  features,
  buttonText,
  isPopular,
  isCurrent,
  isComingSoon
}: {
  name: string,
  price: string,
  period: string,
  features: string[],
  buttonText: string,
  isPopular?: boolean,
  isCurrent?: boolean,
  isComingSoon?: boolean
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

    if (!endpoint) {
      console.error('Formspree endpoint is not defined');
      // For demo purposes if endpoint is missing
      setTimeout(() => {
        setStatus('error');
      }, 1000);
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email,
          source: 'pricing_waitlist',
          subject: 'New Pro Waitlist Signup'
        })
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Waitlist submission error:', error);
      setStatus('error');
    }
  };

  return (
    <div className={`flex flex-col p-8 rounded-3xl border-2 transition-all duration-300 relative ${
      isPopular
        ? 'border-orange-500 shadow-xl bg-card md:scale-105 z-10'
        : 'border-card-border shadow-sm bg-card'
    }`}>
      {isComingSoon && (
        <div className="absolute -top-4 right-6 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-20">
          Coming Soon
        </div>
      )}
      <h3 className="text-xl font-bold text-foreground mb-2">{name}</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-black text-foreground">{price}</span>
        <span className="text-gray-500 dark:text-stone-500 font-medium">{period}</span>
      </div>
      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-stone-400">
            <span className="text-orange-600 mt-1 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {isComingSoon ? (
        <div className="mt-auto">
          {status === 'success' ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-2xl text-green-700 dark:text-green-400 text-sm font-medium text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
              You&apos;re on the list — we&apos;ll email you when Pro launches.
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-stone-900/50 border border-gray-200 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-foreground text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 shadow-sm active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Joining...
                  </>
                ) : (
                  buttonText
                )}
              </button>
              {status === 'error' && (
                <p className="text-xs text-red-500 mt-1 text-center font-medium">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
        </div>
      ) : (
        <button
          disabled={isCurrent}
          className={`w-full py-4 rounded-2xl font-bold transition-all ${
            isCurrent
              ? 'bg-gray-100 dark:bg-stone-800 text-gray-500 dark:text-stone-500 cursor-default'
              : 'bg-orange-600 text-white hover:bg-orange-700 shadow-sm active:scale-95'
          }`}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

const ComparisonTable = () => {
  const features = [
    { name: 'Daily comparisons', free: '3/day', pro: 'Unlimited' },
    { name: 'TF-IDF similarity', free: true, pro: true },
    { name: 'Semantic (AI) similarity', free: true, pro: true },
    { name: 'Max file size', free: '2MB', pro: '20MB' },
    { name: 'Downloadable PDF report', free: true, pro: true },
    { name: 'Priority processing', free: false, pro: true },
    { name: 'Supported file types', free: '.txt, .pdf, .docx', pro: '.txt, .pdf, .docx' },
  ];

  const CheckIcon = () => (
    <svg className="h-5 w-5 text-orange-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );

  const DashIcon = () => (
    <span className="text-gray-300 dark:text-stone-700 text-xl font-bold">—</span>
  );

  return (
    <div className="mt-20 mb-20">
      <h2 className="text-3xl font-bold text-center mb-10">Compare Features</h2>
      <div className="overflow-x-auto rounded-3xl border border-card-border shadow-sm bg-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-card-border">
              <th className="py-6 px-8 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-stone-500">Feature</th>
              <th className="py-6 px-8 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-stone-500 text-center">Free</th>
              <th className="py-6 px-8 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-stone-500 text-center">Pro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {features.map((feature, i) => (
              <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-stone-900/20 transition-colors">
                <td className="py-6 px-8 font-medium text-foreground">{feature.name}</td>
                <td className="py-6 px-8 text-center">
                  {typeof feature.free === 'boolean' ? (
                    feature.free ? <CheckIcon /> : <DashIcon />
                  ) : (
                    <span className="text-gray-600 dark:text-stone-400 text-sm font-medium">{feature.free}</span>
                  )}
                </td>
                <td className="py-6 px-8 text-center">
                  {typeof feature.pro === 'boolean' ? (
                    feature.pro ? <CheckIcon /> : <DashIcon />
                  ) : (
                    <span className="text-gray-600 dark:text-stone-400 text-sm font-medium">{feature.pro}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function PricingPage() {
  return (
    <InfoPageLayout
      title="Simple, Transparent Pricing"
      subtitle="Start free. Upgrade when you need more."
      cta={{
        label: "Try it free →",
        href: "/#tool"
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 mb-12 px-4 md:px-0">
        <PriceCard
          name="Free"
          price="$0"
          period="/day"
          features={[
            "3 comparisons per day",
            "Up to 2MB per file",
            "Standard AI analysis",
            "No sign-up required",
            "TXT, PDF, and DOCX support"
          ]}
          buttonText="Current Plan"
          isCurrent={true}
        />
        <PriceCard
          name="Pro"
          price="$10"
          period="/mo"
          features={[
            "Unlimited comparisons",
            "Larger file sizes (up to 20MB)",
            "Priority AI processing",
            "Downloadable PDF reports",
            "No daily rate limits",
            "Ad-free experience"
          ]}
          buttonText="Join Waitlist"
          isPopular={true}
          isComingSoon={true}
        />
      </div>

      <ComparisonTable />

      <div className="mb-20">
        <div className="bg-card rounded-3xl border border-card-border shadow-sm px-8 overflow-hidden mb-12">
          <AccordionItem question="When will Pro be available?">
            <p>We&apos;re actively working on it — join the waitlist to be notified first as soon as we launch.</p>
          </AccordionItem>
          <AccordionItem question="Will my free comparisons carry over or reset?">
            <p>Free comparisons are reset daily at midnight UTC and do not carry over to the next day.</p>
          </AccordionItem>
          <AccordionItem question="Can I cancel anytime once Pro launches?">
            <p>Yes, we plan to offer monthly subscriptions with no long-term commitment. You&apos;ll be able to cancel at any time.</p>
          </AccordionItem>
        </div>

        <div className="bg-card rounded-3xl p-8 border border-card-border text-center shadow-sm">
          <h3 className="text-xl font-bold text-foreground mb-2">Still have questions?</h3>
          <p className="text-gray-600 dark:text-stone-400 mb-6">Check our full FAQ or get in touch with our team.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/faq"
              className="inline-block px-8 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all shadow-sm"
            >
              Visit Full FAQ
            </Link>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-white dark:bg-stone-800 border border-card-border text-gray-700 dark:text-stone-300 rounded-xl font-semibold hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
}
