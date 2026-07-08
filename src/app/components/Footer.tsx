import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-500 text-sm mb-2">
          &copy; {new Date().getFullYear()} DocSim Checker. All rights reserved.
        </p>
        <p className="text-gray-400 text-sm mb-4">
          We don't store your documents.{' '}
          <Link href="/#how-it-works" className="text-orange-600 hover:underline">
            How it works
          </Link>
        </p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-400">
          <Link href="/about" className="hover:text-orange-600 transition-colors">About</Link>
          <span className="hidden sm:inline text-gray-300">·</span>
          <Link href="/privacy" className="hover:text-orange-600 transition-colors">Privacy Policy</Link>
          <span className="hidden sm:inline text-gray-300">·</span>
          <Link href="/terms" className="hover:text-orange-600 transition-colors">Terms of Use</Link>
          <span className="hidden sm:inline text-gray-300">·</span>
          <Link href="/faq" className="hover:text-orange-600 transition-colors">FAQ</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
