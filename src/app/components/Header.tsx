import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="DocSim Checker"
                width={160}
                height={40}
                priority
                className="h-10 w-auto"
              />
            </Link>
          </div>
          <nav className="flex space-x-6 sm:space-x-8">
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
            >
              How it works
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
            >
              Pricing
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
