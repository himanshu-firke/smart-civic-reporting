import React, { useState, useEffect } from 'react';
import { Plus, Settings, User, AlertCircle, Calendar, Tag, Clock, MapPin, Camera } from 'lucide-react';

const columns = [
  {
    title: "Submitted",
    count: 24,
    items: [
      { id: "#12314", category: "Roads", title: "Deep pothole on 5th Ave", desc: "Reported near the intersection, causing traffic slowdowns." },
      { id: "#12315", category: "Lighting", title: "Streetlight outage", desc: "Entire block is dark on Elm St.", hasImage: true }
    ]
  },
  {
    title: "Assigned",
    count: 12,
    items: [
      { id: "#12290", category: "Water", title: "Pipe leak in Metro Park", desc: "Assigned to Water Management Team Alpha." }
    ]
  },
  {
    title: "In Progress",
    count: 8,
    items: [
      { id: "#12250", category: "Sanitation", title: "Missed trash collection", desc: "Truck dispatched to 12th District." },
      { id: "#12248", category: "Parks", title: "Fallen branch blocking path", desc: "Crew currently on site clearing debris." }
    ]
  },
  {
    title: "Resolved",
    count: 156,
    items: [
      { id: "#12100", category: "Roads", title: "Traffic light repaired", desc: "Signal timing restored at Broad & High." },
      { id: "#12095", category: "Vandalism", title: "Graffiti removed", desc: "Wall repainted at the community center." },
      { id: "#12080", category: "Water", title: "Fire hydrant fixed", desc: "Pressure normalized, leak stopped." }
    ]
  }
];

export function IssueTrackingSection() {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 4000); // Flips every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      className="relative w-full pt-28 pb-40 overflow-hidden flex flex-col items-center border-none"
      style={{ background: "linear-gradient(to bottom, #f8fafc 0%, #1b5fff 15%, #1b5fff 85%, #0f172a 100%)" }}
    >
      
      <div className="text-center px-4 mb-20 relative z-10 max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-bold font-geist tracking-tighter leading-tight
          bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white 
          animate-pulse drop-shadow-lg p-2 filter blur-0">
          Embrace a transparent <br className="hidden md:block"/> issue tracking experience!
        </h2>
      </div>

      {/* 3D Perspective Container */}
      <div className="w-full max-w-7xl mx-auto px-4 relative z-20 [perspective:2000px] h-[600px] md:h-[650px]">
        {/* Transform Container */}
        <div 
          className={`w-full h-full relative transition-transform duration-1000 ease-in-out [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        >
          {/* Front Face: Kanban Board */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
            <div className="flex space-x-6 w-full justify-start md:justify-center overflow-x-auto pb-4 scrollbar-hide">
              {columns.map((col, idx) => (
                <div key={idx} className="min-w-[280px] w-[280px] md:min-w-[300px] md:w-[300px] bg-slate-50 rounded-[1.5rem] p-4 shadow-2xl shadow-blue-900/40 flex flex-col h-[580px] border border-white/20">
                  <div className="flex items-center justify-between mb-6 px-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-slate-800 text-lg">{col.title}</h3>
                      <span className="bg-slate-200 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">{col.count}</span>
                    </div>
                    <button className="bg-blue-600 text-white rounded-full p-1 shadow-sm hover:bg-blue-700 transition-colors">
                      <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide">
                    {col.items.map((item, i) => (
                      <div key={i} className="bg-white p-5 rounded-[1.25rem] shadow-sm border border-slate-100 relative group cursor-default">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center space-x-3">
                            <span className={`text-[9px] uppercase font-bold tracking-wider text-blue-400 bg-blue-50 px-2.5 py-1 rounded`}>
                              {item.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">{item.id}</span>
                          </div>
                          <div className="flex -space-x-1.5 opacity-80">
                            <img className="w-5 h-5 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=32&q=80" alt="Avatar" />
                            <img className="w-5 h-5 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=32&q=80" alt="Avatar" />
                          </div>
                        </div>
                        
                        <h4 className="font-semibold text-slate-800 mb-2 leading-snug">{item.title}</h4>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back Face: Detailed Issue View */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex justify-center items-center">
            <div className="bg-slate-50 w-full max-w-5xl rounded-[2rem] shadow-2xl shadow-blue-900/40 border border-white/20 p-8 md:p-14 h-[580px] flex flex-col relative overflow-hidden">
              <div className="mb-8">
                <span className="text-blue-500 font-medium text-xl mb-2 block">#123456</span>
                <h3 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight">Hazardous Pothole Photo Submission</h3>
              </div>

              <div className="flex flex-col md:flex-row gap-12 flex-1">
                {/* Left Side: Attributes */}
                <div className="flex flex-col space-y-6 flex-1 max-w-md">
                  <div className="grid grid-cols-2 gap-y-6 items-center">
                    <div className="flex items-center space-x-3 text-slate-400 text-sm">
                      <Settings className="w-4 h-4" />
                      <span>Status</span>
                    </div>
                    <div><span className="bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full">Resolved</span></div>

                    <div className="flex items-center space-x-3 text-slate-400 text-sm">
                      <User className="w-4 h-4" />
                      <span>Assign</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center space-x-1.5 bg-slate-200/60 text-slate-700 text-xs font-medium px-2 py-1 rounded-full"><img className="w-4 h-4 rounded-full" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=32&q=80"/><span>Lauren</span></span>
                      <span className="flex items-center space-x-1.5 bg-slate-200/60 text-slate-700 text-xs font-medium px-2 py-1 rounded-full"><img className="w-4 h-4 rounded-full" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=32&q=80"/><span>Jack</span></span>
                    </div>

                    <div className="flex items-center space-x-3 text-slate-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Severity</span>
                    </div>
                    <div><span className="bg-red-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">High</span></div>

                    <div className="flex items-center space-x-3 text-slate-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>Due date</span>
                    </div>
                    <div><span className="bg-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full">12/04/23</span></div>

                    <div className="flex items-center space-x-3 text-slate-400 text-sm">
                      <Tag className="w-4 h-4" />
                      <span>Type of issue</span>
                    </div>
                    <div><span className="bg-red-100 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-full">Roads</span></div>

                    <div className="flex items-center space-x-3 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Starting date</span>
                    </div>
                    <div><span className="bg-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full">12/04/23</span></div>
                  </div>
                </div>

                {/* Right Side: Media & Maps (Citizen Capabilities) */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex-1 bg-slate-900 rounded-2xl relative overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80" alt="Pothole" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                       <Camera className="w-5 h-5 text-white" />
                       <span className="text-white font-medium text-sm">Live Photo Upload</span>
                    </div>
                  </div>
                  <div className="h-32 bg-blue-100 rounded-2xl relative overflow-hidden border border-blue-200">
                    {/* Mock Map Background */}
                    <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)", backgroundSize: "10px 10px" }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <MapPin className="w-8 h-8 text-blue-600 drop-shadow-md animate-bounce" />
                    </div>
                    <div className="absolute bottom-2 right-3 text-xs font-bold text-blue-700">Live GPS Verified</div>
                  </div>
                </div>

              </div>
              
              <div className="mt-auto pt-6 border-t border-slate-200 flex items-center space-x-3">
                <img className="w-6 h-6 rounded-full" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=32&q=80" alt="Commenter" />
                <span className="text-slate-400 text-sm font-medium">Write a comment...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual background split removed as gradient handles transition naturally */}
    </section>
  );
}
