import React from "react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-900 pt-32 pb-40 lg:pt-48 lg:pb-56 min-h-[90vh] flex items-center">
      {/* Abstract 3D Mesh Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-indigo-600/30 blur-[120px] mix-blend-screen animate-pulse-slow object-cover" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-emerald-500/20 blur-[120px] mix-blend-screen animate-pulse-slow animation-delay-2000" />
        <div className="absolute -bottom-[30%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-blue-600/20 blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Hero Text Flow */}
          <div className="text-left animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-200 text-xs font-black uppercase tracking-widest mb-8 backdrop-blur-md shadow-2xl shadow-indigo-500/10">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Next-Gen Civic Infrastructure</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] mb-8 font-display">
              Elevate <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                Your City.
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-xl text-slate-300 mb-12 leading-relaxed font-medium">
              Experience the pinnacle of urban management. Report public anomalies, execute automated geospatial routing, and monitor resolution telemetry in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Link
                to="/register"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl shadow-[0_0_40px_rgba(52,211,153,0.4)] bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-900 font-black text-lg transition-all transform hover:-translate-y-1 hover:scale-105 tracking-wide"
              >
                Access System
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white font-bold text-lg transition-all transform hover:-translate-y-1"
              >
                Command Login
              </Link>
            </div>
          </div>

          {/* Right 3D Platform (Placeholder for User 3D Assets) */}
          <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
             {/* Glowing Pedestal */}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-indigo-500/50 blur-2xl rounded-[100%]"></div>
             
             {/* 3D Glass Mockup Frame */}
             <div className="relative w-full aspect-[4/3] transform perspective-1000 rotate-y-[-15deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out z-20">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl border border-white/30 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),auto_auto_auto_auto_rgba(255,255,255,0.1)_inset] p-6 overflow-hidden flex flex-col group">
                   
                   {/* Mockup Header */}
                   <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                      <div className="ml-4 h-4 w-1/3 bg-white/10 rounded-full"></div>
                   </div>

                   {/* Mockup Content - 3D Floating Layers */}
                   <div className="flex-1 relative flex items-center justify-center">
                      <div className="w-3/4 h-3/4 bg-slate-900/50 rounded-2xl border border-indigo-500/30 shadow-2xl absolute transform group-hover:translate-z-12 transition-transform duration-500"></div>
                      <div className="w-2/3 h-2/3 bg-indigo-600/40 rounded-2xl border border-emerald-400/50 shadow-2xl absolute transform translate-x-4 translate-y-4 group-hover:translate-x-8 group-hover:translate-y-8 transition-transform duration-500 backdrop-blur-md"></div>
                      <div className="w-1/2 h-1/2 bg-emerald-400/30 rounded-2xl border border-white/50 shadow-[0_0_30px_rgba(52,211,153,0.5)] absolute transform -translate-x-4 -translate-y-4 group-hover:-translate-x-8 group-hover:-translate-y-8 transition-transform duration-500 backdrop-blur-lg flex items-center justify-center">
                         <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
