import React from "react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold shadow-md">
              C
            </div>
            <span className="font-semibold text-lg text-gray-900">
              CivicConnect
            </span>
          </div>
          
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CivicConnect Platform. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
