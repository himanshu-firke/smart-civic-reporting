import React from 'react';

export function AdminManagementSection() {
  return (
    <section className="relative w-full bg-[#1b5fff] py-24 overflow-hidden flex flex-col items-center">
      
      {/* Header Area */}
      <div className="w-full max-w-7xl mx-auto px-6 mb-16 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <h2 className="text-4xl md:text-6xl font-medium font-geist text-white tracking-tight leading-tight">
          Efficient Civic <br className="hidden md:block"/> Management
        </h2>
        
        <div className="flex flex-col items-start md:items-end space-y-4 max-w-sm">
          <p className="text-blue-200 text-lg md:text-xl font-normal leading-relaxed">
            Streamline operational tasks, optimize civic workflows, and boost productivity through command oversight.
          </p>
          <a
            href="/admin"
            className="rounded-full bg-white text-blue-600 font-semibold py-3 px-8 transition-colors shadow-lg hover:bg-slate-50 mt-2"
          >
            Access Dashboard
          </a>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-20">
        
        {/* Left Span: Listing and Board Views */}
        <div className="lg:col-span-2 bg-[#2d6bff] rounded-[2rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl border border-blue-400/30">
          <h3 className="text-3xl font-medium text-white mb-10 tracking-tight">Listing and Board <br/> Views</h3>
          
          <div className="flex flex-col md:flex-row gap-6 relative z-10">
            {/* Mock List View */}
            <div className="flex-1 bg-blue-800/40 backdrop-blur-md rounded-2xl border border-blue-400/20 p-6 flex flex-col gap-4 overflow-hidden">
              <div className="flex items-center text-blue-200 space-x-2 mb-2">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <span className="font-semibold text-lg">Infrastructure Todo</span>
              </div>
              
              <div className="space-y-3">
                {[
                  { id: "ID 211", text: "Fix pothole on 5th Ave..." },
                  { id: "ID 212", text: "Repair traffic light at Main..." },
                  { id: "ID 213", text: "Clear fallen tree in Park..." },
                  { id: "ID 214", text: "Replace shattered bus stop..." },
                  { id: "ID 215", text: "Assess water main break..." }
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-4 text-sm text-blue-100/80 border-b border-blue-400/20 pb-2">
                    <span className="opacity-50 min-w-[50px]">{item.id}</span>
                    <span className="truncate">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Board Overlay */}
            <div className="absolute right-[-20%] md:right-4 top-32 md:top-24 w-[320px] bg-white rounded-2xl shadow-2xl border border-blue-200 p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500 z-20">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-blue-50 px-2 py-1 rounded">Roads</span>
                  <span className="text-[10px] text-slate-400 font-semibold">#12314</span>
                </div>
                <h4 className="font-semibold text-slate-800 text-lg leading-tight mb-4">Deep pothole on 5th Ave</h4>
                <div className="flex space-x-2">
                   <div className="bg-blue-600 text-white rounded-full py-2 px-4 shadow-sm flex items-center justify-center space-x-2 text-sm font-medium w-full">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                     <span>Admin View</span>
                   </div>
                   <div className="bg-slate-100 text-slate-600 rounded-xl py-2 px-3 shadow-inner flex items-center justify-center">
                      <svg className="w-5 h-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                   </div>
                </div>
            </div>
          </div>
          
          {/* Ambient Background Blur */}
          <div className="absolute -top-1/2 -right-1/4 w-[400px] h-[400px] bg-white/10 blur-[100px] rounded-full pointer-events-none"></div>
        </div>

        {/* Right Span: Customized Perspectives */}
        <div className="lg:col-span-1 bg-[#2d6bff] rounded-[2rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl border border-blue-400/30">
          <h3 className="text-3xl font-medium text-white mb-8 tracking-tight">Relevant Customized <br/> Perspectives</h3>
          
          <div className="flex flex-col gap-4 relative z-10">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-blue-800/60 backdrop-blur-sm border border-blue-400/20 text-blue-100 text-[10px] font-medium px-3 py-1.5 rounded-full flex items-center space-x-1">
                <span>Status is</span><span className="font-bold text-white">Not started</span>
                <svg className="w-3 h-3 ml-1 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </span>
              <span className="bg-blue-800/60 backdrop-blur-sm border border-blue-400/20 text-blue-100 text-[10px] font-medium px-3 py-1.5 rounded-full flex items-center space-x-1">
                <span>Creator is</span><span className="font-bold text-white">Super Admin</span>
                <svg className="w-3 h-3 ml-1 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </span>
            </div>

            {/* Mock Kanban Column */}
            <div className="bg-slate-50 rounded-2xl p-4 shadow-xl border border-white/20">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-slate-800">Not started</h4>
                    <span className="bg-slate-200 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">2</span>
                  </div>
                  <div className="bg-blue-600 text-white rounded-full p-0.5 shadow-sm">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </div>
               </div>
               
               <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3">
                 <div className="flex justify-between items-center mb-3">
                    <span className="text-[8px] uppercase font-bold tracking-wider text-orange-500 bg-orange-50 px-2.5 py-1 rounded">Urgent</span>
                    <span className="text-[9px] text-slate-400 font-semibold">#12314</span>
                 </div>
                 <h5 className="font-semibold text-slate-800 text-sm mb-1 leading-snug">Deep pothole on 5th Ave</h5>
                 <p className="text-[10px] text-slate-400 leading-relaxed truncate">Extremely deep. Hazard to sedans...</p>
               </div>
               
               <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                 <div className="flex justify-between items-center mb-3">
                    <span className="text-[8px] uppercase font-bold tracking-wider text-blue-400 bg-blue-50 px-2.5 py-1 rounded">Water</span>
                    <span className="text-[9px] text-slate-400 font-semibold">#12300</span>
                 </div>
                 <h5 className="font-semibold text-slate-800 text-sm mb-1 leading-snug">Main line pressure loss</h5>
                 <p className="text-[10px] text-slate-400 leading-relaxed truncate">Sectors A and B reporting drops...</p>
               </div>
            </div>
            
          </div>
        </div>
        
      </div>

    </section>
  );
}
