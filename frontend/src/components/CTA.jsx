import React from "react";
import { Link } from "react-router-dom";

const steps = [
  {
    num: "1",
    title: "Capture the Issue",
    desc: "Take a clear photo of the infrastructure problem using your mobile device or camera."
  },
  {
    num: "2",
    title: "Add Location Details",
    desc: "GPS automatically captures the exact location, or manually adjust for precision."
  },
  {
    num: "3",
    title: "Submit Your Report",
    desc: "Add a brief description and submit your report to the appropriate authorities."
  },
  {
    num: "4",
    title: "Track Progress",
    desc: "Monitor the status of your report and receive updates in real-time."
  }
];

export function CTA() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden border-none pt-32">
      {/* Slanted Transition from Features */}
      <div 
        className="absolute top-0 left-0 w-full h-32 bg-slate-900 -translate-y-16 z-0"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 100%)" }}
      ></div>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 mix-blend-screen"></div>
        <div className="absolute left-0 top-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 mix-blend-screen"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* How It Works Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-display tracking-tight">
            How It Works
          </h2>
          <p className="text-xl text-slate-400 font-medium leading-relaxed">
            Reporting civic issues is simple and straightforward. Follow these four easy steps to make a difference.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-500/20 via-blue-500/50 to-blue-500/20 z-0"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-slate-900 border-4 border-slate-800 text-3xl font-black text-white flex items-center justify-center mb-6 shadow-xl group-hover:border-blue-500 group-hover:text-blue-400 transition-colors duration-300">
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[250px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
