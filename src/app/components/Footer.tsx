import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-500 text-sm mb-2">
          &copy; {new Date().getFullYear()} DocSim Checker. All rights reserved.
        </p>
        <p className="text-gray-400 text-sm">
          We don't store your documents.{' '}
          <Link href="#how-it-works" className="text-orange-600 hover:underline">
            How it works
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
