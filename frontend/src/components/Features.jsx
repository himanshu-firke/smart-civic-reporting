import React from "react";

const features = [
  {
    title: "Report Issues Easily",
    description: "Snap a photo, add a location, and submit your local issues in seconds from any device.",
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    title: "Track Progress",
    description: "Stay informed with real-time updates as authorities assign and resolve your complaints.",
    icon: (
      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "Efficient Resolution",
    description: "Smart routing directly to the appropriate department and local workers for quick fixes.",
    icon: (
      <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: "Transparent Management",
    description: "A centralized dashboard for government officials to oversee city-wide operations and metrics.",
    icon: (
      <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }
];

export function Features() {
  return (
    <section className="py-32 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
      {/* Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-md">
            Capabilities
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-display tracking-tight">
            Powerful tools for better communities
          </h2>
          <p className="text-xl text-slate-400 font-medium">
            Everything citizens and authorities need to streamline civic maintenance, rendered in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="bg-slate-800/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-indigo-500/50 shadow-2xl shadow-black/20 hover:shadow-indigo-500/20 transition-all duration-500 group transform hover:-translate-y-2 hover:bg-slate-800/60 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="w-16 h-16 bg-slate-900/80 rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:bg-indigo-600/20 group-hover:border-indigo-400/30 transition-all duration-500 shadow-inner">
                <div className="group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-500">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors">{feature.title}</h3>
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
