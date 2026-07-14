'use client';

import React, { useState, useEffect, useRef } from 'react';
import InfoPageLayout from '../components/InfoPageLayout';
import Link from 'next/link';
import AccordionItem from '../components/AccordionItem';

const UsageCalculator = () => {
  const [comparisons, setComparisons] = useState(30);
  const freeLimitPerMonth = 3 * 30; // 3 per day * 30 days

  const scrollToPro = () => {
    const el = document.getElementById('pro-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-4', 'ring-orange-500/50');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-orange-500/50');
      }, 2000);
    }
  };

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#181615] rounded-3xl p-8 border border-[#E6DDC4] dark:border-[#2C2420] shadow-lg mb-20 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4] mb-6 text-center tracking-tight">
        How many comparisons do you need per month?
      </h2>

      <div className="space-y-8">
        <div className="px-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
              Est. Comparisons
            </span>
            <span className="text-2xl font-bold font-editorial text-orange-600 bg-orange-50/50 dark:bg-orange-950/20 px-4 py-1.5 border border-orange-200/50 dark:border-orange-900/30 rounded-xl">
              {comparisons}{comparisons >= 150 ? '+' : ''}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="150"
            step="5"
            value={comparisons}
            onChange={(e) => setComparisons(parseInt(e.target.value))}
            className="w-full h-2.5 bg-gray-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-orange-600 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <div className="flex justify-between mt-2 text-xs text-stone-500 dark:text-stone-500 font-medium">
            <span>0</span>
            <span>75</span>
            <span>150+</span>
          </div>
        </div>

        <div className="p-6 bg-white/40 dark:bg-stone-900/20 rounded-2xl border border-[#E6DDC4]/60 dark:border-[#2C2420]/60 text-center transition-all duration-300">
          {comparisons <= freeLimitPerMonth ? (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <p className="text-lg font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4] mb-1">
                The Free plan covers you.
              </p>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                You&apos;re well within the 90 free monthly comparisons.
              </p>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <p className="text-lg font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4] mb-2">
                You&apos;d benefit from Pro.
              </p>
              <button
                onClick={scrollToPro}
                className="text-orange-600 dark:text-orange-500 font-bold hover:text-orange-700 dark:hover:text-orange-400 transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                Join the waitlist to be notified
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
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

  const InkDot = () => (
    <div className="flex justify-center">
      <span className="w-2.5 h-2.5 rounded-full bg-orange-600 dark:bg-orange-500 shadow-[0_0_6px_rgba(234,88,12,0.3)]" />
    </div>
  );

  const DashIcon = () => (
    <span className="text-stone-300 dark:text-stone-700 text-xl font-bold">—</span>
  );

  return (
    <div className="mt-20 mb-20">
      <h2 className="text-3xl font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4] text-center mb-10 tracking-tight">
        Compare Features
      </h2>
      <div className="overflow-x-auto rounded-3xl border border-[#E6DDC4] dark:border-[#2C2420] shadow-md bg-[#FAF8F5] dark:bg-[#181615]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E6DDC4] dark:border-[#2C2420]">
              <th className="py-6 px-8 text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 font-editorial">
                Feature Ledger
              </th>
              <th className="py-6 px-8 text-base font-bold font-editorial text-stone-800 dark:text-stone-200 text-center">
                Free
              </th>
              <th className="py-6 px-8 text-base font-bold font-editorial text-stone-800 dark:text-stone-200 text-center">
                Pro
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6DDC4]/60 dark:divide-[#2C2420]/60">
            {features.map((feature, i) => (
              <tr key={i} className="hover:bg-stone-500/[0.02] dark:hover:bg-stone-500/[0.01] transition-colors">
                <td className="py-6 px-8 text-sm font-medium text-[#1A1A1A] dark:text-[#F5F5F4]">
                  {feature.name}
                </td>
                <td className="py-6 px-8 text-center">
                  {typeof feature.free === 'boolean' ? (
                    feature.free ? <InkDot /> : <DashIcon />
                  ) : (
                    <span className="text-stone-600 dark:text-stone-400 text-sm font-medium">
                      {feature.free}
                    </span>
                  )}
                </td>
                <td className="py-6 px-8 text-center">
                  {typeof feature.pro === 'boolean' ? (
                    feature.pro ? <InkDot /> : <DashIcon />
                  ) : (
                    <span className="text-stone-600 dark:text-stone-400 text-sm font-medium">
                      {feature.pro}
                    </span>
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
  const [audience, setAudience] = useState<'Students' | 'Teams'>('Students');
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const pricingCardsRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

    if (!endpoint) {
      console.error('Formspree endpoint is not defined');
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyCTA(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );

    if (pricingCardsRef.current) {
      observer.observe(pricingCardsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <InfoPageLayout
      title="Two Ways to Read Between the Lines"
      subtitle="A ledger of our tiers, built for writers, researchers, and professionals alike."
      cta={{
        label: "Try it free →",
        href: "/#tool"
      }}
    >
      {/* Audience Toggle (Index Tabs divider styling) */}
      <div className="flex flex-col items-center mb-12">
        <div className="flex border-b border-[#E6DDC4] dark:border-[#2C2420] w-full max-w-xs justify-center mb-6">
          <button
            onClick={() => setAudience('Students')}
            className={`px-5 py-2.5 font-editorial font-bold text-sm transition-all relative top-[1px] border-t border-x rounded-t-xl cursor-pointer ${
              audience === 'Students'
                ? 'bg-[#FAF8F5] dark:bg-[#181615] border-[#E6DDC4] dark:border-[#2C2420] text-orange-600 dark:text-orange-500 z-10 shadow-[0_-2px_6px_rgba(0,0,0,0.02)]'
                : 'bg-stone-100/50 dark:bg-[#121110]/30 border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            For Students
          </button>
          <button
            onClick={() => setAudience('Teams')}
            className={`px-5 py-2.5 font-editorial font-bold text-sm transition-all relative top-[1px] border-t border-x rounded-t-xl cursor-pointer ${
              audience === 'Teams'
                ? 'bg-[#FAF8F5] dark:bg-[#181615] border-[#E6DDC4] dark:border-[#2C2420] text-orange-600 dark:text-orange-500 z-10 shadow-[0_-2px_6px_rgba(0,0,0,0.02)]'
                : 'bg-stone-100/50 dark:bg-[#121110]/30 border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            For Teams
          </button>
        </div>
        <p className="text-center text-stone-600 dark:text-stone-400 font-medium text-sm max-w-md min-h-[40px] leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">
          {audience === 'Students'
            ? "Perfect for checking drafts, essays, and coursework before you submit."
            : "Built for comparing contract versions, policy drafts, and internal documents."
          }
        </p>
      </div>

      {/* Manuscript Tiers Layout - Two Facing Ledger Pages of a Book/Ledger */}
      {/* Wrapper to allow wax seal overflow without clipping while retaining grid layout */}
      <div className="relative pt-8 mt-4 mb-20">
        <div
          ref={pricingCardsRef}
          className="border border-[#E6DDC4] dark:border-[#2C2420] rounded-3xl bg-[#FAF8F5] dark:bg-[#181615] shadow-lg relative grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E6DDC4] dark:divide-[#2C2420]"
        >
          {/* Book Spine fold effect overlay on desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[40px] -translate-x-1/2 pointer-events-none bg-gradient-to-r from-transparent via-stone-500/[0.04] to-transparent dark:via-black/[0.1] z-10" />
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#E6DDC4] dark:bg-[#2C2420] -translate-x-1/2 pointer-events-none z-10" />

          {/* Free Plan Page (Page I) */}
          <div className="flex flex-col p-8 sm:p-10 relative rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none bg-[#FAF8F5] dark:bg-[#181615]">
            {/* Page corner indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700" />
              <span className="text-[10px] font-mono tracking-widest text-stone-400 dark:text-stone-500 uppercase font-bold">
                PAGE I
              </span>
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4] mb-2">
                Free Tier
              </h2>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-black font-editorial text-[#1A1A1A] dark:text-[#F5F5F4]">
                  $0
                </span>
                <span className="text-stone-500 dark:text-stone-400 font-medium font-editorial">/day</span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-8 font-medium">
                No credit card. No expiration. Free forever at 3 comparisons/day.
              </p>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {[
                "3 comparisons per day",
                "Up to 2MB per file",
                "Standard AI analysis",
                "No sign-up required",
                "TXT, PDF, and DOCX support"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-stone-600 dark:text-stone-400">
                  <span className="text-orange-600 dark:text-orange-500 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-sm sm:text-base">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              disabled={true}
              className="w-full py-3.5 rounded-xl font-editorial font-bold bg-stone-100 dark:bg-stone-800/60 text-stone-400 dark:text-stone-500 cursor-default border border-stone-200/40 dark:border-stone-800/20 text-center"
            >
              Current Plan
            </button>
          </div>

          {/* Pro Plan Page (Page II) */}
          <div id="pro-card" className="flex flex-col p-8 sm:p-10 relative rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none bg-[#FAF8F5] dark:bg-[#181615]">
            {/* Page corner indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 pointer-events-none">
              <span className="text-[10px] font-mono tracking-widest text-stone-400 dark:text-stone-500 uppercase font-bold">
                PAGE II
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700" />
            </div>

            {/* Elegant Tilted Wax Seal Badge positioned absolutely relative to wrapper so it overflows the grid without clipping */}
            <div className="absolute -top-7 right-8 sm:right-12 w-16 h-16 rounded-full bg-gradient-to-br from-[#EA580C] to-[#B43E2B] flex flex-col items-center justify-center shadow-[0_4px_12px_rgba(180,62,43,0.35),_inset_0_2px_4px_rgba(255,255,255,0.25)] border border-[#9A3412] rotate-6 select-none pointer-events-none z-20">
              <div className="absolute inset-1 rounded-full border border-[#9A3412]/30 flex flex-col items-center justify-center">
                <span className="font-editorial text-[9px] text-[#FAF8F5] uppercase tracking-wider font-extrabold leading-tight text-center">
                  Most<br />Popular
                </span>
              </div>
            </div>

          {/* Coming Soon Label - elegant manuscript accent */}
          <div className="absolute top-10 right-4 font-mono tracking-widest text-[9px] text-orange-600 dark:text-orange-500 uppercase font-extrabold bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30 px-2 py-0.5 rounded shadow-sm pointer-events-none">
            Coming Soon
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4] mb-2">
              Pro Tier
            </h2>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-black font-editorial text-[#1A1A1A] dark:text-[#F5F5F4]">
                $10
              </span>
              <span className="text-stone-500 dark:text-stone-400 font-medium font-editorial">/mo</span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-8 font-medium">
              No daily limit. Priority support. Unlock detailed analysis reports.
            </p>
          </div>

          <ul className="space-y-4 mb-8 flex-grow">
            {[
              "Unlimited comparisons",
              "Larger file sizes (up to 20MB)",
              "Priority AI processing",
              "Downloadable PDF reports",
              "No daily rate limits",
              "Ad-free experience"
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-stone-600 dark:text-stone-400">
                <span className="text-orange-600 dark:text-orange-500 mt-1 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-sm sm:text-base">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            {status === 'success' ? (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-xl text-green-700 dark:text-green-400 text-sm font-medium text-center animate-in fade-in slide-in-from-bottom-2 duration-300 font-editorial">
                You&apos;re on the list — we&apos;ll email you when Pro launches.
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-3">
                <div className="border border-[#E6DDC4] dark:border-[#2C2420] focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 rounded-xl p-1 bg-white/50 dark:bg-stone-900/40 shadow-sm transition-all duration-300">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-[#1A1A1A] dark:text-[#F5F5F4] text-sm placeholder:italic placeholder:font-editorial placeholder:text-stone-400/80 dark:placeholder:text-stone-500/80"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3.5 bg-orange-600 text-[#FAF8F5] font-editorial font-bold rounded-xl hover:bg-orange-700 shadow-sm active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {status === 'loading' ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-[#FAF8F5]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Joining...
                    </>
                  ) : (
                    "Join Waitlist"
                  )}
                </button>
                {status === 'error' && (
                  <p className="text-xs text-red-500 mt-1 text-center font-medium font-mono">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            )}

            {/* Bottom Reassurance (Pro Tier) */}
            <div className="mt-6 space-y-2">
              <p className="text-[11px] text-center text-[#1A1A1A] dark:text-stone-400 font-medium leading-relaxed italic">
                Pro doesn&apos;t change our privacy policy — your documents are never stored, on any plan.
              </p>
              <p className="text-[11px] text-center text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider">
                Cancel anytime, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>

      <UsageCalculator />

      <ComparisonTable />

      {/* Competitor Comparison */}
      <div className="mb-20">
        <div className="bg-[#FAF8F5] dark:bg-[#181615] border border-[#E6DDC4] dark:border-[#2C2420] rounded-3xl p-8 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4] mb-3 flex items-center gap-2.5">
            <span className="p-1.5 bg-orange-100/60 dark:bg-orange-950/20 rounded-lg text-orange-600 dark:text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </span>
            How we compare
          </h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed italic text-sm md:text-base">
            Unlike{' '}
            <Link
              href="/faq"
              className="text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400 transition-colors underline decoration-orange-200 dark:decoration-orange-900 underline-offset-4 hover:decoration-orange-600 font-semibold"
            >
              Turnitin, Copyleaks, or similar plagiarism-detection services
            </Link>
            , DocSim Checker doesn&apos;t require an account, doesn&apos;t check your documents against a web-wide index, and never stores anything you submit. It&apos;s built for direct, document-to-document comparison — not institutional-scale plagiarism detection.
          </p>
        </div>
      </div>

      <div className="mb-20">
        <div className="bg-[#FAF8F5] dark:bg-[#181615] rounded-3xl border border-[#E6DDC4] dark:border-[#2C2420] shadow-sm px-8 overflow-hidden mb-12">
          <AccordionItem question="When will Pro be available?">
            <p className="py-2 text-stone-600 dark:text-stone-400 leading-relaxed text-sm md:text-base">
              We&apos;re actively working on it — join the waitlist to be notified first as soon as we launch.
            </p>
          </AccordionItem>
          <AccordionItem question="Will my free comparisons carry over or reset?">
            <p className="py-2 text-stone-600 dark:text-stone-400 leading-relaxed text-sm md:text-base">
              Free comparisons are reset daily at midnight UTC and do not carry over to the next day.
            </p>
          </AccordionItem>
          <AccordionItem question="Can I cancel anytime once Pro launches?">
            <p className="py-2 text-stone-600 dark:text-stone-400 leading-relaxed text-sm md:text-base">
              Yes, we plan to offer monthly subscriptions with no long-term commitment. You&apos;ll be able to cancel at any time.
            </p>
          </AccordionItem>
        </div>

        <div className="bg-[#FAF8F5] dark:bg-[#181615] rounded-3xl p-8 border border-[#E6DDC4] dark:border-[#2C2420] text-center shadow-sm">
          <h2 className="text-xl font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4] mb-2">
            Still have questions?
          </h2>
          <p className="text-stone-500 dark:text-stone-400 mb-6">
            Check our full FAQ or get in touch with our team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/faq"
              className="inline-block px-8 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all shadow-sm active:scale-95"
            >
              Visit Full FAQ
            </Link>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-white dark:bg-stone-800 border border-[#E6DDC4] dark:border-[#2C2420] text-[#1A1A1A] dark:text-[#F5F5F4] rounded-xl font-semibold hover:border-orange-500 dark:hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-500 transition-all shadow-sm active:scale-95"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky Floating CTA */}
      <div
        className={`fixed z-40 transition-all duration-500 ease-in-out ${
          showStickyCTA
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        } bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0`}
      >
        <Link
          href="/#tool"
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white text-sm font-bold rounded-full shadow-lg hover:bg-orange-700 hover:scale-105 active:scale-95 transition-all"
        >
          Get Started Free
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </InfoPageLayout>
  );
}
