import React from "react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-32 lg:pt-36 lg:pb-40">
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl opacity-70" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-50/50 blur-3xl opacity-60" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl opacity-70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
          <span>Civic Issue Reporting System</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
          A better way to <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            improve your city
          </span>
        </h1>
        
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 mb-10 leading-relaxed">
          Report public problems and help authorities resolve issues faster. 
          Together, we can build cleaner, safer, and smarter communities.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl shadow-lg shadow-blue-500/30 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-all transform hover:-translate-y-1"
          >
            Start Reporting
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-lg transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
