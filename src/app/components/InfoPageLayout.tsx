import React from 'react';

interface InfoPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const PageH2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold text-foreground mt-16 mb-6 tracking-tight">{children}</h2>
);

export const PageP = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-6 text-gray-600 dark:text-stone-400 leading-relaxed text-lg">{children}</p>
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

const InfoPageLayout = ({ title, subtitle, children }: InfoPageLayoutProps) => {
  return (
    <div className="bg-background min-h-screen pb-20 transition-colors duration-200">
      {/* Hero Section */}
      <div className="bg-orange-50/50 dark:bg-orange-950/10 border-b border-orange-100 dark:border-orange-900/30 pt-32 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-3xl mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-gray-600 dark:text-stone-400 font-medium max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-stone dark:prose-invert prose-orange max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfoPageLayout;
