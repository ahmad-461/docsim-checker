"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useScrollPosition } from '@/hooks/useScrollPosition';

const tools = [
  {
    name: 'Word Counter',
    href: '/tools/word-counter',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    )
  },
  {
    name: 'Case Converter',
    href: '/tools/case-converter',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 5v12m0 0H7m2 0h2M13 12h7m-3.5 0v5m0 0h-1.5m1.5 0h1.5" />
      </svg>
    )
  },
  {
    name: 'Duplicate Line Remover',
    href: '/tools/duplicate-line-remover',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    )
  },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isScrolled } = useScrollPosition(50);
  const [theme, setTheme] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const activeTheme = savedTheme || systemTheme;
    setTheme(activeTheme);
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Close menus when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
        } else if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDropdownOpen, isMobileMenuOpen]);

  // Close menus on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-gray-200 dark:border-stone-800 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image
                src={theme === 'dark' ? "/logo-light.svg" : "/logo.svg"}
                alt="DocSim Checker"
                width={160}
                height={40}
                priority
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
            <Link
              href="/"
              className={`group relative text-sm font-semibold transition-colors py-2 ${
                pathname === '/'
                  ? 'text-orange-600 dark:text-orange-500'
                  : 'text-gray-600 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-500'
              }`}
            >
              Home
              <span className={`absolute bottom-0 left-0 h-0.5 bg-orange-600 transition-all duration-300 ${
                pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
            <Link
              href="/how-it-works"
              className={`group relative text-sm font-semibold transition-colors py-2 ${
                pathname === '/how-it-works'
                  ? 'text-orange-600 dark:text-orange-500'
                  : 'text-gray-600 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-500'
              }`}
            >
              How it works
              <span className={`absolute bottom-0 left-0 h-0.5 bg-orange-600 transition-all duration-300 ${
                pathname === '/how-it-works' ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
            <Link
              href="/pricing"
              className={`group relative text-sm font-semibold transition-colors py-2 ${
                pathname === '/pricing'
                  ? 'text-orange-600 dark:text-orange-500'
                  : 'text-gray-600 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-500'
              }`}
            >
              Pricing
              <span className={`absolute bottom-0 left-0 h-0.5 bg-orange-600 transition-all duration-300 ${
                pathname === '/pricing' ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>

            {/* More Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`group relative flex items-center text-sm font-semibold transition-colors focus:outline-none py-2 ${
                  tools.some(tool => pathname === tool.href)
                    ? 'text-orange-600 dark:text-orange-500'
                    : 'text-gray-600 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-500'
                }`}
              >
                More Tools
                <svg
                  className={`ml-1 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-orange-600 transition-all duration-300 ${
                  tools.some(tool => pathname === tool.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-lg bg-white dark:bg-stone-800 ring-1 ring-black ring-opacity-5 dark:ring-stone-700 py-2 z-50 overflow-hidden transition-all duration-200 origin-top-right animate-[fadeInScale_0.2s_ease-out]">
                  <style jsx global>{`
                    @keyframes fadeInScale {
                      from { opacity: 0; transform: scale(0.95) translateY(-8px); }
                      to { opacity: 1; transform: scale(1) translateY(0); }
                    }
                  `}</style>
                  <div className="px-4 py-2 text-xs font-bold text-gray-400 dark:text-stone-500 uppercase tracking-widest border-b border-gray-100 dark:border-stone-700/50 mb-1">
                    Tools
                  </div>
                  {tools.map((tool) => {
                    const isActive = pathname === tool.href;
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className={`group flex items-center px-4 py-2.5 text-sm transition-colors ${
                          isActive
                            ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-500'
                            : 'text-gray-700 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-600 dark:hover:text-orange-500'
                        }`}
                      >
                        <span className={`mr-3 transition-colors ${isActive ? 'text-orange-600 dark:text-orange-500' : 'text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-500'}`}>
                          {tool.icon}
                        </span>
                        <span className="flex-1 font-medium">{tool.name}</span>
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-600 dark:bg-orange-500 ml-2"></span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle (Desktop) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </nav>

          {/* Mobile menu button & Dark Mode Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden fixed inset-0 top-20 z-40 transition-opacity duration-300 bg-black/20 dark:bg-black/40 backdrop-blur-sm ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`absolute top-0 left-0 right-0 bg-white dark:bg-stone-900 border-b border-gray-200 dark:border-stone-800 shadow-xl transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pt-2 pb-6 space-y-1">
            <Link
              href="/"
              className={`block px-4 py-4 text-base font-medium transition-colors ${
                pathname === '/'
                  ? 'text-orange-600 dark:text-orange-500 bg-orange-50/50 dark:bg-orange-950/10 border-l-4 border-orange-600'
                  : 'text-gray-600 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-stone-800/50 border-l-4 border-transparent'
              }`}
            >
              Home
            </Link>
            <Link
              href="/how-it-works"
              className={`block px-4 py-4 text-base font-medium transition-colors ${
                pathname === '/how-it-works'
                  ? 'text-orange-600 dark:text-orange-500 bg-orange-50/50 dark:bg-orange-950/10 border-l-4 border-orange-600'
                  : 'text-gray-600 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-stone-800/50 border-l-4 border-transparent'
              }`}
            >
              How it works
            </Link>
            <Link
              href="/pricing"
              className={`block px-4 py-4 text-base font-medium transition-colors ${
                pathname === '/pricing'
                  ? 'text-orange-600 dark:text-orange-500 bg-orange-50/50 dark:bg-orange-950/10 border-l-4 border-orange-600'
                  : 'text-gray-600 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-stone-800/50 border-l-4 border-transparent'
              }`}
            >
              Pricing
            </Link>

            <div className="pt-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-stone-500 uppercase tracking-widest">
                More Tools
              </div>
              {tools.map((tool) => {
                const isActive = pathname === tool.href;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`flex items-center px-4 py-4 text-base font-medium transition-colors pl-8 ${
                      isActive
                        ? 'text-orange-600 dark:text-orange-500 bg-orange-50/50 dark:bg-orange-950/10 border-l-4 border-orange-600'
                        : 'text-gray-600 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-stone-800/50 border-l-4 border-transparent'
                    }`}
                  >
                    <span className={`mr-3 transition-colors ${isActive ? 'text-orange-600 dark:text-orange-500' : 'text-gray-400'}`}>
                      {tool.icon}
                    </span>
                    {tool.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
