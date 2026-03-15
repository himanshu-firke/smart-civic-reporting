import React, { useState, useRef } from "react";
import { StatusTimeline } from "./StatusTimeline";

export function IssueDetailsModal({ issue, onClose, defaultTab = "images" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef(null);

  const getWorkerName = () => {
    if (!issue.assignedWorkerId) return "Unassigned";
    // Check if populated through deptAdmin (nested userId) or raw
    return issue.assignedWorkerId?.userId?.name || issue.assignedWorkerId?.name || "Worker Assigned";
  };

  const getCitizenName = () => {
    return issue.citizenId?.name || "Anonymous";
  };

  const getTimeTaken = () => {
    if (!issue.createdAt || !issue.updatedAt || (issue.status !== "Resolved" && issue.status !== "Closed")) {
      return "Pending Resolution";
    }
    const start = new Date(issue.createdAt);
    const end = new Date(issue.updatedAt);
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    if (hours === 0) return `${mins} minutes`;
    if (hours < 24) return `${hours} hours, ${mins} minutes`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days} days, ${remainingHours} hours, ${mins} minutes`;
  };

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    
    // Create an invisible iframe to isolate the print styles from Tailwind's oklch variables
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const content = reportRef.current.innerHTML;
    
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Civic_Report_${issue._id.substring(0, 8)}</title>
          <style>
            @media print {
              @page { margin: 12mm; size: letter portrait; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: sans-serif; }
            }
          </style>
        </head>
        <body style="margin:0; padding:0;">
          ${content}
        </body>
      </html>
    `);
    doc.close();
    
    // Allow images time to load into the iframe's DOM before triggering the print
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
      setIsDownloading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      
      {/* ------------------------------------------------------------- 
          HIDDEN PDF REPORT LAYOUT (z-index negative, OPACITY 0)
      ------------------------------------------------------------- */}
      <div className="absolute overflow-hidden h-0 w-0">
        <div ref={reportRef} style={{ width: '800px', backgroundColor: '#ffffff', color: '#000000', padding: '40px', fontFamily: 'sans-serif' }}>
          <div style={{ borderBottom: '4px solid #4f46e5', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1 style={{ fontSize: '30px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>Civic Incident Report</h1>
              <p style={{ color: '#64748b', fontFamily: 'monospace', marginTop: '4px', margin: 0 }}>ID: {issue._id}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 'bold', color: '#334155', margin: 0 }}>Date Logged: {new Date(issue.createdAt).toLocaleDateString()}</p>
              <p style={{ fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '18px', margin: 0 }}>
                 STAT: {(issue.status === "Resolved" || issue.status === "Closed") ? "CLOSED / COMPLETED" : issue.status}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '32px', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '12px', margin: 0 }}>Reporter Intelligence</h3>
              <p style={{ marginBottom: '4px', margin: 0 }}><span style={{ fontWeight: '600', display: 'inline-block', width: '96px' }}>Citizen:</span> {getCitizenName()}</p>
              <p style={{ marginBottom: '4px', margin: 0 }}><span style={{ fontWeight: '600', display: 'inline-block', width: '96px' }}>Contact:</span> {issue.citizenId?.email || "N/A"}</p>
              <p style={{ marginBottom: '4px', margin: 0 }}><span style={{ fontWeight: '600', display: 'inline-block', width: '96px' }}>Location:</span> {issue.location?.lat?.toFixed(4)}, {issue.location?.lng?.toFixed(4)}</p>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '12px', margin: 0 }}>Resolution Metrics</h3>
              <p style={{ marginBottom: '4px', margin: 0 }}><span style={{ fontWeight: '600', display: 'inline-block', width: '96px' }}>Department:</span> {issue.departmentId?.name || "System Base"}</p>
              <p style={{ marginBottom: '4px', margin: 0 }}><span style={{ fontWeight: '600', display: 'inline-block', width: '96px' }}>Assigned To:</span> {getWorkerName()}</p>
              <p style={{ marginBottom: '4px', margin: 0 }}><span style={{ fontWeight: '600', display: 'inline-block', width: '96px' }}>Time Taken:</span> {getTimeTaken()}</p>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '12px', margin: 0 }}>Lifespan Update</h3>
            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#1e293b', fontSize: '14px' }}>
               <p style={{ fontWeight: '600', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', margin: 0 }}>
                 <span>• Submitted Complaint:</span> 
                 <span style={{ fontFamily: 'monospace' }}>{new Date(issue.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
               </p>
               {(issue.status === "Assigned" || issue.status === "InProgress" || issue.status === "Resolved" || issue.status === "Closed") && (
                 <p style={{ fontWeight: '600', marginBottom: '4px', color: '#1d4ed8', display: 'flex', justifyContent: 'space-between', margin: 0, marginTop: '8px' }}>
                   <span>• Assigned to Operative ({getWorkerName()}):</span> 
                   <span style={{ fontFamily: 'monospace' }}>In Progress</span>
                 </p>
               )}
               {(issue.status === "Resolved" || issue.status === "Closed") && (
                 <p style={{ fontWeight: '600', marginBottom: '4px', color: '#047857', marginTop: '8px', display: 'flex', justifyContent: 'space-between', margin: 0 }}>
                   <span>• Completed & Verified:</span> 
                   <span style={{ fontFamily: 'monospace' }}>{new Date(issue.updatedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                 </p>
               )}
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '12px', margin: 0 }}>Incident Description</h3>
            <p style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              {issue.description}
            </p>
          </div>

          <div style={{ breakInside: 'avoid' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '16px', margin: 0 }}>Photographic Evidence</h3>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 'bold', color: '#334155', marginBottom: '8px', textAlign: 'center', backgroundColor: '#f1f5f9', padding: '4px 0', borderRadius: '4px', margin: 0 }}>Before (Complaint)</p>
                <div style={{ height: '256px', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                   {issue.imageUrl ? (
                     <img src={issue.imageUrl} crossOrigin="anonymous" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                   ) : (
                     <span style={{ color: '#94a3b8', fontWeight: '500' }}>No initial image</span>
                   )}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 'bold', color: '#065f46', marginBottom: '8px', textAlign: 'center', backgroundColor: '#ecfdf5', padding: '4px 0', borderRadius: '4px', margin: 0 }}>After (Resolution)</p>
                <div style={{ height: '256px', backgroundColor: '#ecfdf5', border: '2px dashed #a7f3d0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                   {issue.completionImageUrl ? (
                     <img src={issue.completionImageUrl} crossOrigin="anonymous" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                   ) : (
                     <span style={{ color: '#059669', opacity: 0.5, fontWeight: '500' }}>Proof pending</span>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ------------------------------------------------------------- 
          INTERACTIVE UI MODAL
      ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <div>
             <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
               Issue Dossier
               <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">{issue.status}</span>
             </h2>
             <p className="text-slate-500 text-sm mt-1 font-mono">ID: {issue._id}</p>
           </div>
           
           <button 
             onClick={handleDownloadPDF} 
             disabled={isDownloading}
             className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2 disabled:opacity-50"
           >
             {isDownloading ? (
               <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Generating...</>
             ) : (
               <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Download PDF</>
             )}
           </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-slate-200 px-6 md:px-8 bg-white">
          <button 
            onClick={() => setActiveTab("images")}
            className={`px-6 py-4 font-bold text-sm tracking-wide transition-colors relative ${activeTab === "images" ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"}`}
          >
            Visual Evidence (View)
            {activeTab === "images" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab("details")}
            className={`px-6 py-4 font-bold text-sm tracking-wide transition-colors relative ${activeTab === "details" ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"}`}
          >
            Investigation Log (More)
            {activeTab === "details" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 md:p-8 overflow-y-auto bg-white flex-1">
          
          {activeTab === "images" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
               {/* Left: Original Issue */}
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <h4 className="font-bold text-red-800 text-xs uppercase tracking-wider bg-red-50 inline-block px-3 py-1.5 rounded-lg border border-red-100">Initial Complaint</h4>
                   <span className="text-xs font-bold text-slate-400">{new Date(issue.createdAt).toLocaleDateString()}</span>
                 </div>
                 <div className="aspect-video bg-slate-50 rounded-2xl overflow-hidden shadow-inner border border-slate-200 flex items-center justify-center group relative">
                    {issue.imageUrl ? (
                      <a href={issue.imageUrl} target="_blank" rel="noreferrer" className="w-full h-full block">
                        <img src={issue.imageUrl} alt="Original Complaint" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-full cursor-pointer backdrop-blur-md">View Full Resolution</span>
                        </div>
                      </a>
                    ) : (
                      <div className="text-slate-400 text-sm font-medium">No initial image</div>
                    )}
                 </div>
               </div>

               {/* Right: Worker Proof */}
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <h4 className="font-bold text-emerald-800 text-xs uppercase tracking-wider bg-emerald-50 inline-block px-3 py-1.5 rounded-lg border border-emerald-100">Resolution Proof</h4>
                   {issue.status === "Resolved" || issue.status === "Closed" ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Verified Upload</span>
                   ) : (
                      <span className="text-xs font-bold text-amber-500">Pending</span>
                   )}
                 </div>
                 <div className="aspect-video bg-emerald-50/30 rounded-2xl overflow-hidden shadow-inner border border-emerald-100 flex items-center justify-center group relative">
                    {issue.completionImageUrl ? (
                      <a href={issue.completionImageUrl} target="_blank" rel="noreferrer" className="w-full h-full block">
                        <img src={issue.completionImageUrl} alt="Fix Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-emerald-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-full cursor-pointer backdrop-blur-md">View Full Resolution</span>
                        </div>
                      </a>
                    ) : (
                      <div className="text-emerald-600/40 text-sm font-medium">Awaiting completion photo from field operative</div>
                    )}
                 </div>
               </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Metadata List */}
               <div className="space-y-6">
                 <div>
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Complaint Description</h4>
                   <p className="text-slate-800 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                     {issue.description}
                   </p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Time of Complaint</p>
                       <p className="text-sm font-bold text-slate-900">{new Date(issue.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Citizen Reporter</p>
                       <p className="text-sm font-bold text-slate-900">{getCitizenName()}</p>
                    </div>
                    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                       <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Operative Assigned</p>
                       <p className="text-sm font-bold text-indigo-900">{getWorkerName()}</p>
                    </div>
                    {issue.status === "Resolved" || issue.status === "Closed" ? (
                      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                         <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Time to Solve</p>
                         <p className="text-sm font-bold text-emerald-900">{getTimeTaken()}</p>
                      </div>
                    ) : (
                      <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                         <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">Resolution Status</p>
                         <p className="text-sm font-bold text-amber-900">In Progress...</p>
                      </div>
                    )}
                 </div>
               </div>

               {/* Timeline component injection */}
               <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Lifespan Timeline</h4>
                  <StatusTimeline currentStatus={issue.status} createdAt={issue.createdAt} updatedAt={issue.updatedAt} />
               </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
           <button onClick={onClose} className="px-8 py-3 bg-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-300 transition-all">
             Close Dossier
           </button>
        </div>

      </div>
    </div>
  );
}
