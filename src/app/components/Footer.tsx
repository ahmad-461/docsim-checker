import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CONTACT_EMAIL } from '@/app/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1C1917] text-stone-300 border-t border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1 — Brand */}
          <div className="flex flex-col space-y-5 items-center text-center sm:items-start sm:text-left">
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
            <div className="space-y-3">
              <p className="text-sm leading-relaxed max-w-xs text-stone-400">
                Compare documents. Catch similarities. Protect your work.
              </p>
              <p className="text-xs text-stone-500 font-medium">
                We never store your documents.
              </p>
            </div>
          </div>

          {/* Column 2 — Product */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="hover:text-[#EA580C] transition-colors duration-200 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#EA580C] transition-colors duration-200 text-sm">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#EA580C] transition-colors duration-200 text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/tools/word-counter" className="hover:text-[#EA580C] transition-colors duration-200 text-sm">
                  Word Counter
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — Company */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="hover:text-[#EA580C] transition-colors duration-200 text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#EA580C] transition-colors duration-200 text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#EA580C] transition-colors duration-200 text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 — Legal */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy" className="hover:text-[#EA580C] transition-colors duration-200 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#EA580C] transition-colors duration-200 text-sm">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-xs text-stone-500">
            &copy; {currentYear} DocSim Checker. All rights reserved.
          </p>
          <p className="text-xs text-stone-500">
            Built with care for writers, students, and teams.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
