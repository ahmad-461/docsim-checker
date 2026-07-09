import React from 'react';
import InfoPageLayout from '../components/InfoPageLayout';
import Link from 'next/link';

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
}) => (
  <div className={`flex flex-col p-8 rounded-3xl border-2 transition-all duration-300 relative ${
    isPopular
      ? 'border-orange-500 shadow-xl bg-card scale-105 z-10'
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
      <Link
        href="/contact?subject=Pro%20Waitlist"
        className="w-full py-4 rounded-2xl font-bold text-center transition-all bg-orange-600 text-white hover:bg-orange-700 shadow-sm active:scale-95"
      >
        {buttonText}
      </Link>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 mb-16 px-4 md:px-0">
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
            "Export comparison reports",
            "No daily rate limits",
            "Ad-free experience"
          ]}
          buttonText="Join Waitlist"
          isPopular={true}
          isComingSoon={true}
        />
      </div>

      <div className="bg-card rounded-3xl p-8 border border-card-border text-center shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-2">Frequently Asked Questions</h3>
        <p className="text-gray-600 dark:text-stone-400 mb-6">Have more questions about our plans or features?</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/faq"
            className="inline-block px-8 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all shadow-sm"
          >
            Visit FAQ
          </Link>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-white dark:bg-stone-800 border border-card-border text-gray-700 dark:text-stone-300 rounded-xl font-semibold hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </InfoPageLayout>
  );
}
