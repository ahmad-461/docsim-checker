import React from 'react';
import InfoPageLayout from '../components/InfoPageLayout';

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
  <div className={`flex flex-col p-8 rounded-3xl border-2 transition-all duration-300 ${isPopular ? 'border-orange-500 shadow-xl bg-white scale-105 relative' : 'border-gray-100 shadow-sm bg-gray-50/50'}`}>
    {isComingSoon && (
      <div className="absolute -top-4 right-6 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
        Coming Soon
      </div>
    )}
    <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
    <div className="flex items-baseline gap-1 mb-6">
      <span className="text-4xl font-black text-gray-900">{price}</span>
      <span className="text-gray-500 font-medium">{period}</span>
    </div>
    <ul className="space-y-4 mb-8 flex-grow">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-3 text-gray-600">
          <span className="text-orange-500 mt-1 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </span>
          {feature}
        </li>
      ))}
    </ul>
    <button
      disabled
      className={`w-full py-4 rounded-2xl font-bold transition-all ${
        isCurrent
          ? 'bg-gray-200 text-gray-600 cursor-default'
          : isPopular
            ? 'bg-orange-600 text-white opacity-80'
            : 'bg-white border-2 border-gray-200 text-gray-400'
      }`}
    >
      {buttonText}
    </button>
  </div>
);

export default function PricingPage() {
  return (
    <InfoPageLayout
      title="Simple Pricing"
      subtitle="Simple, transparent plans"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 mb-16">
        <PriceCard
          name="Free"
          price="$0"
          period="/day"
          features={[
            "3 comparisons per day",
            "Up to 2MB per file",
            "Standard AI analysis",
            "No sign-up required"
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
            "Larger file sizes",
            "Priority AI processing",
            "Export comparison reports",
            "Version history"
          ]}
          buttonText="Join Waitlist"
          isPopular={true}
          isComingSoon={true}
        />
      </div>

      <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Need an Enterprise solution?</h3>
        <p className="text-gray-600 mb-6">Looking for API access or custom limits for your team?</p>
        <a
          href="mailto:support@docsimchecker.com"
          className="inline-block px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-orange-500 hover:text-orange-600 transition-all"
        >
          Contact Sales
        </a>
      </div>
    </InfoPageLayout>
  );
}
