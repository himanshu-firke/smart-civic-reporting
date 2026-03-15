import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import { DashboardHeader } from '../../components/DashboardHeader';
import { StatusTimeline } from '../../components/StatusTimeline';
import { IssueMarkerMap } from '../../components/IssueMarkerMap';

export function CitizenDashboardPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const fetchMyIssues = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/citizen/issues");
      setIssues(data.issues || []);
      setError(null);
    } catch (err) {
      setError("Failed to load your reports. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Submitted": return "bg-gray-100 text-gray-800 border-gray-200";
      case "Assigned": return "bg-blue-100 text-blue-800 border-blue-200";
      case "InProgress": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Resolved": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Closed": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusDisplay = (status) => {
    if (status === "InProgress") return "In Progress";
    return status;
  };

  // Group issues
  const activeIssues = issues.filter(i => i.status !== "Closed");
  const closedIssues = issues.filter(i => i.status === "Closed");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <DashboardHeader title="Citizen" />
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8">
        
        {/* Welcome & Report CTA */}
        <section className="mb-12 bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-indigo-100/50 border border-indigo-50 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
           
           <div className="z-10">
             <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Welcome Home</h1>
             <p className="text-lg text-gray-600 max-w-xl">
               Track the progress of your past reports, view completion photos, or report a new problem in your neighborhood instantly.
             </p>
           </div>
           
           <div className="shrink-0 z-10 w-full md:w-auto">
             <Link to="/citizen/report-issue" className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1">
               <span className="flex items-center justify-center gap-2">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                 Report New Issue
               </span>
             </Link>
           </div>
        </section>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl font-medium border border-red-100 mb-8 flex items-center gap-3">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             {error}
          </div>
        )}

        {/* Issue Tracking Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Your Reports</h2>
            <div className="flex gap-2">
              <span className="text-sm font-bold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">{issues.length} Total</span>
            </div>
          </div>

          {loading ? (
             <div className="py-20 text-center text-gray-500 font-medium">Fetching your report history...</div>
          ) : issues.length === 0 ? (
             <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Reports Yet</h3>
                <p className="text-gray-500 mb-6">You haven't reported any civic issues. Help keep the city clean by reporting problems you see.</p>
                <Link to="/citizen/report-issue" className="text-indigo-600 font-bold hover:underline">Make your first report &rarr;</Link>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               
               {/* Active Issues Section (Mapped inline for simplicity, but grouped visually) */}
               {issues.map(issue => (
                 <div 
                   key={issue._id} 
                   onClick={() => setSelectedIssue(issue)}
                   className={`bg-white rounded-2xl border p-5 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg group
                     ${issue.status === 'Closed' ? 'border-gray-100 opacity-80 hover:border-emerald-200 hover:opacity-100' : 'border-gray-200 shadow-sm hover:border-indigo-300'}
                   `}
                 >
                   <div className="flex justify-between items-start mb-4">
                     <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusBadgeColor(issue.status)}`}>
                       {getStatusDisplay(issue.status)}
                     </span>
                     <span className="text-xs text-gray-400 font-mono">
                       {new Date(issue.createdAt).toLocaleDateString()}
                     </span>
                   </div>
                   
                   <h3 className="font-bold text-gray-900 text-lg line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                     {issue.description}
                   </h3>
                   
                   <div className="flex items-center text-sm text-gray-500 mt-auto">
                     <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                     {issue.category} • {issue.departmentId?.name || "Gov Dept"}
                   </div>
                 </div>
               ))}
               
            </div>
          )}
        </section>
      </main>

      {/* ------------------------------------------------------------- 
          MODAL: ISSUE DETAILS & PROOF OF FIX
      ------------------------------------------------------------- */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <div>
                 <h3 className="text-xl font-bold text-gray-900">Report Lifecycle</h3>
               </div>
               <button onClick={() => setSelectedIssue(null)} className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-full shadow-sm">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
               <div className="mb-12 px-4 sm:px-8">
                  <StatusTimeline currentStatus={selectedIssue.status} />
               </div>

               <p className="text-lg font-medium text-gray-900 mb-8 border-l-4 border-indigo-500 pl-4">
                 "{selectedIssue.description}"
               </p>

               {/* Image Comparison Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                 {/* Original Submitted Image */}
                 <div className="space-y-3">
                   <h4 className="font-bold text-gray-500 text-xs uppercase tracking-wider flex items-center gap-2">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                     Your Original Photo
                   </h4>
                   <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative group">
                      {selectedIssue.imageUrl ? (
                        <img src={selectedIssue.imageUrl} alt="Original" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">No photo provided</div>
                      )}
                      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-1 rounded-md">
                        {new Date(selectedIssue.createdAt).toLocaleDateString()}
                      </div>
                   </div>
                 </div>

                 {/* Resolution Proof Image */}
                 <div className="space-y-3">
                   <h4 className={`font-bold text-xs uppercase tracking-wider flex items-center gap-2 ${selectedIssue.completionImageUrl ? 'text-emerald-600' : 'text-gray-400'}`}>
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                     Worker Proof of Fix
                   </h4>
                   <div className={`aspect-[4/3] rounded-2xl overflow-hidden shadow-sm relative group border
                     ${selectedIssue.completionImageUrl ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200 border-dashed'}
                   `}>
                      {selectedIssue.completionImageUrl ? (
                        <img src={selectedIssue.completionImageUrl} alt="Fix Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                          <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span className="text-sm font-medium">Work in progress...<br/>Proof will appear here when resolved.</span>
                        </div>
                      )}
                      {selectedIssue.completionImageUrl && (
                        <div className="absolute bottom-3 left-3 bg-emerald-900/50 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-1 rounded-md">
                          Fixed: {new Date(selectedIssue.updatedAt).toLocaleDateString()}
                        </div>
                      )}
                   </div>
                 </div>

               </div>
               
               {/* Map View */}
               {selectedIssue.location && selectedIssue.location.lat && (
                 <div className="mt-8">
                   <h4 className="font-bold text-gray-500 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                     Report Location
                   </h4>
                   <IssueMarkerMap 
                     lat={selectedIssue.location.lat} 
                     lng={selectedIssue.location.lng} 
                     popupText={selectedIssue.description} 
                     height="250px" 
                   />
                 </div>
               )}
               
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
               <button onClick={() => setSelectedIssue(null)} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30">
                 Close View
               </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
