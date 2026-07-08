import React from 'react';

interface InfoPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const PageH2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">{children}</h2>
);

export const PageP = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-6 text-gray-600 leading-relaxed">{children}</p>
);

export const PageLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
    {children}
  </a>
);

export const PageUl = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-600">
    {children}
  </ul>
);

export const PageLi = ({ children }: { children: React.ReactNode }) => (
  <li>{children}</li>
);

export const PageStrong = ({ children }: { children: React.ReactNode }) => (
  <strong className="font-bold text-gray-900">{children}</strong>
);

const InfoPageLayout = ({ title, children }: InfoPageLayoutProps) => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Added pt-32 to account for the sticky header (h-20 + extra spacing) */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-12 tracking-tight">
          {title}
        </h1>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfoPageLayout;
