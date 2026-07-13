import React from 'react';
import Link from 'next/link';

export interface PageHeroCTA {
  label: string;
  href: string;
  style?: 'primary' | 'subtle';
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  cta?: PageHeroCTA;
  maxWidth?: string;
  textAlign?: 'center' | 'left' | 'balanced';
}

const PageHero = ({
  title,
  subtitle,
  cta,
  maxWidth = "max-w-3xl",
  textAlign = "balanced"
}: PageHeroProps) => {
  const isCentered = textAlign === 'center';
  const isLeft = textAlign === 'left';
  const isBalanced = textAlign === 'balanced';

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#181615] border-b border-[#E6DDC4]/60 dark:border-[#2C2420]/60 pt-32 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className={`${maxWidth} mx-auto ${isBalanced ? 'text-center md:text-left' : isCentered ? 'text-center' : 'text-left'}`}>
        <h1 className="text-4xl md:text-5xl font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4] mb-4 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className={`text-xl text-stone-600 dark:text-stone-400 font-medium ${isBalanced ? 'mx-auto md:mx-0' : isCentered ? 'mx-auto' : ''} max-w-2xl`}>
            {subtitle}
          </p>
        )}

        {cta && (
          <div className={`mt-8 ${isBalanced ? 'flex justify-center md:justify-start' : isCentered ? 'flex justify-center' : 'flex justify-start'}`}>
            {cta.style === 'subtle' ? (
              <a
                href={cta.href}
                className="inline-flex items-center text-orange-600 font-bold hover:text-orange-700 transition-colors group text-lg"
              >
                {cta.label}
                <svg className="ml-2 w-5 h-5 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            ) : (
              <Link
                href={cta.href}
                className="inline-flex items-center px-8 py-3.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-sm hover:shadow-md active:scale-95 transform hover:scale-[1.02]"
              >
                {cta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHero;
