import React from 'react';
import PageHero, { PageHeroCTA } from './PageHero';

interface InfoPageLayoutProps {
  title: string;
  subtitle?: string;
  cta?: PageHeroCTA;
  children: React.ReactNode;
  maxWidth?: string;
  noProse?: boolean;
}

export const PageH2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4] mt-20 mb-8 tracking-tight">{children}</h2>
);

export const PageP = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-6 text-stone-600 dark:text-stone-400 leading-relaxed text-lg">{children}</p>
);

export const PageLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-orange-600 font-semibold hover:text-orange-700 transition-colors underline decoration-orange-200 dark:decoration-orange-900 underline-offset-4 hover:decoration-orange-600">
    {children}
  </a>
);

export const PageUl = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-disc pl-6 space-y-3 mb-8 text-gray-600 dark:text-stone-400 text-lg">
    {children}
  </ul>
);

export const PageLi = ({ children }: { children: React.ReactNode }) => (
  <li>{children}</li>
);

export const PageStrong = ({ children }: { children: React.ReactNode }) => (
  <strong className="font-bold text-foreground">{children}</strong>
);

const InfoPageLayout = ({
  title,
  subtitle,
  cta,
  children,
  maxWidth = "max-w-3xl",
  noProse = false
}: InfoPageLayoutProps) => {
  return (
    <div className="bg-background min-h-screen pb-20 transition-colors duration-200">
      <PageHero
        title={title}
        subtitle={subtitle}
        cta={cta}
        maxWidth={maxWidth}
      />

      {/* Content Section */}
      <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-16`}>
        {noProse ? (
          children
        ) : (
          <div className="prose prose-stone dark:prose-invert prose-orange max-w-none">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPageLayout;
