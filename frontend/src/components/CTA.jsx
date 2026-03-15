import React from "react";
import { Link } from "react-router-dom";

export function CTA() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 z-0">
        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 mix-blend-screen"></div>
        <div className="absolute left-0 top-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 mix-blend-screen"></div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 sm:p-16 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden transform hover:-translate-y-2 transition-transform duration-700 group">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-emerald-400/20 transition-colors duration-700"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 group-hover:bg-indigo-500/30 transition-colors duration-700"></div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 relative z-10 font-display tracking-tight">
            Deploy infrastructure <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">today</span>
          </h2>
          <p className="text-slate-400 text-lg sm:text-xl mb-10 max-w-2xl mx-auto relative z-10 font-medium leading-relaxed">
            Join the decentralized network of citizens and government officials working together to build cleaner, safer, and smarter urban environments.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 relative z-10">
            <Link
              to="/register"
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-900 font-black hover:from-emerald-500 hover:to-teal-600 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(52,211,153,0.3)] tracking-wide"
            >
              Initialize Node
            </Link>
            <Link
               to="/login"
               className="w-full sm:w-auto px-10 py-5 rounded-2xl border border-white/20 bg-white/5 text-white font-bold hover:bg-white/10 transition-all transform hover:-translate-y-1 backdrop-blur-md"
            >
              Authenticate
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
