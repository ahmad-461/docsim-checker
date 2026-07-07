import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-orange-600">DocSim Checker</span>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <span className="text-gray-500 text-sm">Phase 1: Core MVP</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
