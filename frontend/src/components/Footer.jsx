import React from "react";

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
              C
            </div>
            <span className="font-black text-xl text-white tracking-widest uppercase">
              CivicConnect
            </span>
          </div>
          
          <div className="text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} CivicConnect Platform. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
