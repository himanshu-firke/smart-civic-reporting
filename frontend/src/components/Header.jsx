import React from "react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
              C
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              CivicConnect
            </span>
          </div>
          <nav className="flex items-center space-x-6">
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Log in
            </Link>
            <Link 
              to="/register" 
              className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              Register
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
