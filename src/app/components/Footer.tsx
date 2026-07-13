"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-[#1C1917] text-stone-300 border-t border-white/5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1 — Brand */}
          <div className="flex flex-col space-y-6 items-center text-center sm:items-start sm:text-left">
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <Image
                src="/logo-light.svg"
                alt="DocSim Checker"
                width={160}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed max-w-xs text-stone-400">
                Compare documents. Catch similarities. Protect your work.
              </p>
              <p className="text-xs text-orange-500/90 font-semibold tracking-wide uppercase">
                We never store your documents.
              </p>
            </div>
          </div>

          {/* Column 2 — Product */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h3 className="text-stone-400 font-bold mb-6 text-xs uppercase tracking-widest flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Product
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="hover:text-brand-orange transition-colors duration-200 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-brand-orange transition-colors duration-200 text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/tools/word-counter" className="hover:text-brand-orange transition-colors duration-200 text-sm">
                  Word Counter
                </Link>
              </li>
              <li>
                <Link href="/tools/case-converter" className="hover:text-brand-orange transition-colors duration-200 text-sm">
                  Case Converter
                </Link>
              </li>
              <li>
                <Link href="/tools/duplicate-line-remover" className="hover:text-brand-orange transition-colors duration-200 text-sm">
                  Duplicate Line Remover
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — Company */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h3 className="text-stone-400 font-bold mb-6 text-xs uppercase tracking-widest">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/how-it-works" className="hover:text-brand-orange transition-colors duration-200 text-sm">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-orange transition-colors duration-200 text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-orange transition-colors duration-200 text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-brand-orange transition-colors duration-200 text-sm">
                  What&apos;s New
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 — Legal */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h3 className="text-stone-400 font-bold mb-6 text-xs uppercase tracking-widest flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Legal
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy" className="hover:text-brand-orange transition-colors duration-200 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-orange transition-colors duration-200 text-sm">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-orange transition-colors duration-200 text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <p className="text-xs text-stone-400">
              &copy; {currentYear} DocSim Checker. All rights reserved.
            </p>
            <p className="text-xs text-stone-500/30 hidden sm:block">|</p>
            <p className="text-xs text-stone-400">
              Built with care for writers, students, and teams.
            </p>
          </div>
          <button
            onClick={scrollToTop}
            className="text-xs text-stone-400 hover:text-brand-orange font-medium flex items-center gap-1 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 rounded px-1"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
