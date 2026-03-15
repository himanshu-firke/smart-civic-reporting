import React from "react";

const capabilities = [
  {
    title: "Road Infrastructure",
    count: "1,247 reports",
    description: "Report potholes, damaged roads, broken sidewalks, and street maintenance issues.",
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: "Waste Management",
    count: "892 reports",
    description: "Report illegal dumping, overflowing bins, litter, and garbage collection issues.",
    icon: (
      <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    )
  },
  {
    title: "Environmental Issues",
    count: "534 reports",
    description: "Report damaged trees, fallen branches, landscaping problems, and green space issues.",
    icon: (
      <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "Utilities & Infrastructure",
    count: "678 reports",
    description: "Report water leaks, gas issues, electrical problems, and utility infrastructure concerns.",
    icon: (
      <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
];

export function Features() {
  return (
    <section className="relative pt-32 pb-32 bg-slate-900 border-none overflow-hidden">
      {/* Slanted Transition from AdminManagementSection */}
      <div 
        className="absolute top-0 left-0 w-full h-32 bg-[#1b5fff] -translate-y-16 origin-top-left z-0"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 10%, 0 100%)", transformOrigin: "left center" }}
      ></div>

      {/* Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-md">
            Categories
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-display tracking-tight">
            What Can You Report?
          </h2>
          <p className="text-xl text-slate-400 font-medium">
            Our platform covers a wide range of civic issues to help keep your community safe and well-maintained.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {capabilities.map((feature, idx) => (
            <div 
              key={idx}
              className="bg-slate-800/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-blue-500/50 shadow-2xl shadow-black/20 hover:shadow-blue-500/20 transition-all duration-500 group transform hover:-translate-y-2 hover:bg-slate-800/60 relative overflow-hidden flex flex-col items-start text-left"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex w-full items-center justify-between mb-8">
                <div className="w-14 h-14 bg-slate-900/80 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-blue-600/20 group-hover:border-blue-400/30 transition-all duration-500 shadow-inner">
                  <div className="group-hover:scale-110 transition-all duration-500">
                    {feature.icon}
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/50">
                  {feature.count}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
