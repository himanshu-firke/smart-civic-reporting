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
  
  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchMyIssues();
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await apiFetch("/api/citizen/notifications");
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await apiFetch(`/api/citizen/notifications/${id}/read`, { method: "PUT" });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Failed to mark notification active", err);
    }
  };

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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">
      <DashboardHeader title="Citizen">
        {/* Notification Bell */}
        <div className="relative mr-2">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-500 hover:text-indigo-600 bg-gray-100 hover:bg-indigo-50 rounded-full transition-colors relative"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
            )}
          </button>

          {/* Notification Flyout Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">{unreadCount} New</span>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    No notifications yet.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {notifications.map(notif => (
                      <div 
                        key={notif._id} 
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer flex gap-4 ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}
                        onClick={() => {
                          if (!notif.isRead) handleMarkAsRead(notif._id);
                          const linkedIssue = issues.find(i => i._id === notif.issueId);
                          if (linkedIssue) setSelectedIssue(linkedIssue);
                          setShowNotifications(false);
                        }}
                      >
                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!notif.isRead ? 'bg-indigo-500' : 'bg-transparent'}`}></div>
                        <div>
                          <p className={`text-sm ${!notif.isRead ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 font-mono">
                            {new Date(notif.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                <button onClick={() => setShowNotifications(false)} className="text-xs font-bold text-gray-500 hover:text-gray-700">Close</button>
              </div>
            </div>
          )}
        </div>
      </DashboardHeader>
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8 relative z-10">
        
        {/* Decorative Background Elements */}
        <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-indigo-900 via-violet-900 to-transparent overflow-hidden -z-20 pointer-events-none"></div>
        
        {/* Welcome & Report CTA */}
        <section className="mb-12 bg-white/10 backdrop-blur-2xl rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-indigo-900/20 border border-white/20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3 transition-transform duration-700 group-hover:scale-110"></div>
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-violet-500/30 rounded-full blur-[80px] -z-10 -translate-x-1/3 translate-y-1/3 transition-transform duration-700 group-hover:scale-110"></div>
           
           <div className="z-10 text-white">
             <div className="inline-flex items-center gap-2 px-3 py-1 pb-1.5 rounded-full bg-white/10 border border-white/20 text-indigo-100 text-xs font-bold tracking-widest uppercase mb-4">
               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
               Citizen Hub
             </div>
             <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 drop-shadow-md">Civic Command</h1>
             <p className="text-lg text-indigo-100 max-w-xl font-medium leading-relaxed drop-shadow-sm">
               Track the progress of your past reports, view verified resolution photos, or report a new problem in your neighborhood instantly to dispatch a local operative.
             </p>
           </div>
           
           <div className="shrink-0 z-10 w-full md:w-auto">
             <Link to="/citizen/report-issue" className="block w-full text-center bg-white text-indigo-900 hover:bg-slate-50 font-black py-4.5 px-8 rounded-2xl shadow-xl shadow-black/10 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/20">
               <span className="flex items-center justify-center gap-2">
                 <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                 Deploy Issue Report
               </span>
             </Link>
           </div>
        </section>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-2xl font-medium border border-red-100 mb-8 flex items-center gap-3 shadow-sm">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             {error}
          </div>
        )}

        {/* Issue Tracking Grid */}
        <section className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-white/50 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Active Reports</h2>
              <p className="text-slate-500 font-medium mt-1">Monitor the lifecycle of your civic submissions</p>
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full shadow-sm">{issues.length} Dispatches</span>
            </div>
          </div>

          {loading ? (
             <div className="py-32 flex flex-col items-center justify-center">
                <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <div className="text-slate-500 font-bold tracking-wide">Syncing Intelligence...</div>
             </div>
          ) : issues.length === 0 ? (
             <div className="bg-slate-50 rounded-[2rem] p-16 text-center border-2 border-dashed border-slate-200">
                <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6 border border-slate-100">
                  <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-wide">No Active Dispatches</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg leading-relaxed">You haven't reported any civic issues yet. Help keep the infrastructure operational by reporting problems you encounter.</p>
                <Link to="/citizen/report-issue" className="inline-flex items-center gap-2 text-white bg-slate-900 hover:bg-indigo-600 px-6 py-3 rounded-xl font-bold shadow-lg transition-colors">
                  Draft First Report
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               
               {issues.map(issue => (
                 <div 
                   key={issue._id} 
                   onClick={() => setSelectedIssue(issue)}
                   className={`bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden
                     ${issue.status === 'Closed' ? 'border border-slate-100 opacity-80 hover:border-emerald-300 hover:opacity-100 hover:shadow-[0_20px_40px_-15px_rgba(5,150,105,0.1)]' : 'border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.2)]'}
                   `}
                 >
                   {/* Top Accent Line */}
                   <div className={`absolute top-0 left-0 w-full h-1 ${issue.status === 'Closed' ? 'bg-emerald-400' : 'bg-indigo-500'}`}></div>

                   <div className="flex justify-between items-start mb-5 mt-1">
                     <span className={`px-3 pt-1.5 pb-2 rounded-lg text-xs font-black uppercase tracking-wider border ${getStatusBadgeColor(issue.status)}`}>
                       {getStatusDisplay(issue.status)}
                     </span>
                     <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                       {new Date(issue.createdAt).toLocaleDateString()}
                     </span>
                   </div>
                   
                   <h3 className="font-bold text-slate-900 text-[1.1rem] leading-snug line-clamp-2 mb-4 group-hover:text-indigo-600 transition-colors">
                     {issue.description}
                   </h3>
                   
                   <div className="flex items-center text-sm font-semibold text-slate-500 mt-auto bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                     <svg className="w-4 h-4 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                     <span className="truncate">{issue.category} • {issue.departmentId?.name || "Gov Dept"}</span>
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-50">
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-900/40 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] border border-white/20">
            
            <div className="p-6 sm:px-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur-xl">
               <div>
                 <div className="inline-flex items-center gap-2 px-3 py-1 pb-1.5 mb-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black tracking-widest uppercase">
                    ID: {selectedIssue._id.substring(0, 8)}
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Report Dossier</h3>
               </div>
               <button onClick={() => setSelectedIssue(null)} className="p-2 sm:p-3 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full shadow-sm border border-slate-200 transition-colors">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white">
               
               <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8 mb-10 shadow-inner">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Resolution Timeline</h4>
                  <div className="px-2 sm:px-8">
                    <StatusTimeline currentStatus={selectedIssue.status} />
                  </div>
               </div>

               <div className="relative mb-10 pl-6 border-l-4 border-indigo-500">
                  <p className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed">
                    "{selectedIssue.description}"
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-400 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Submitted on {new Date(selectedIssue.createdAt).toLocaleDateString()} at {new Date(selectedIssue.createdAt).toLocaleTimeString([], {timeStyle: 'short'})}
                  </p>
               </div>

               {/* Image Comparison Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                 
                 {/* Original Submitted Image */}
                 <div className="space-y-3">
                   <h4 className="font-bold text-slate-500 text-xs uppercase tracking-widest flex items-center gap-2">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                     Submitted Evidence
                   </h4>
                   <div className="aspect-[4/3] bg-slate-100 rounded-[2rem] overflow-hidden border-2 border-slate-200 shadow-sm relative group">
                      {selectedIssue.imageUrl ? (
                        <img src={selectedIssue.imageUrl} alt="Original" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                          <svg className="w-12 h-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          <span className="font-bold tracking-wide">No Photo Attached</span>
                        </div>
                      )}
                   </div>
                 </div>

                 {/* Resolution Proof Image */}
                 <div className="space-y-3">
                   <h4 className={`font-bold text-xs uppercase tracking-widest flex items-center gap-2 ${selectedIssue.completionImageUrl ? 'text-emerald-600' : 'text-slate-400'}`}>
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     Operational Proof
                   </h4>
                   <div className={`aspect-[4/3] rounded-[2rem] overflow-hidden shadow-sm relative group border-2
                     ${selectedIssue.completionImageUrl ? 'bg-emerald-50 border-emerald-200 shadow-[0_10px_30px_-15px_rgba(5,150,105,0.3)]' : 'bg-slate-50 border-slate-200 border-dashed'}
                   `}>
                      {selectedIssue.completionImageUrl ? (
                        <>
                          <img src={selectedIssue.completionImageUrl} alt="Fix Proof" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 ring-inset ring-4 ring-emerald-500/20 rounded-[2rem] pointer-events-none"></div>
                          <div className="absolute bottom-4 left-4 bg-emerald-900/80 backdrop-blur-md text-emerald-50 text-[10px] font-mono px-3 py-1.5 rounded-lg border border-emerald-700/50 shadow-lg">
                            Resolved: {new Date(selectedIssue.updatedAt).toLocaleDateString()}
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50">
                          <svg className="w-12 h-12 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span className="text-sm font-bold tracking-wide text-slate-500">Awaiting Operation</span>
                          <span className="text-xs mt-1 text-slate-400">Proof will appear upon resolution.</span>
                        </div>
                      )}
                   </div>
                 </div>

               </div>
               
               {/* Map View */}
               {selectedIssue.location && selectedIssue.location.lat && (
                 <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                   <h4 className="font-bold text-slate-500 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                     Incident Coordinates
                   </h4>
                   <div className="rounded-[1.5rem] overflow-hidden border-2 border-white shadow-md">
                     <IssueMarkerMap 
                       lat={selectedIssue.location.lat} 
                       lng={selectedIssue.location.lng} 
                       popupText={selectedIssue.description} 
                       height="250px" 
                     />
                   </div>
                 </div>
               )}
               
            </div>

            <div className="p-6 sm:px-10 border-t border-slate-100 bg-slate-50/80 backdrop-blur-xl flex justify-end shrink-0">
               <button onClick={() => setSelectedIssue(null)} className="px-10 py-3.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 hover:-translate-y-1 transition-all shadow-xl shadow-slate-900/20 hover:shadow-indigo-500/30">
                 Acknowledge & Close
               </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
