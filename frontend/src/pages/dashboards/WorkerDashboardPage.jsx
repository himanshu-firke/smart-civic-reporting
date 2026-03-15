import React, { useEffect, useState, useRef } from "react";
import { apiFetch } from "../../api/client";
import { DashboardHeader } from "../../components/DashboardHeader";
import { StatusTimeline } from "../../components/StatusTimeline";
import { IssueMarkerMap } from "../../components/IssueMarkerMap";

export function WorkerDashboardPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for the expanded issue action modal
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // State for completion image upload
  const [completionImage, setCompletionImage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/worker/issues");
      setIssues(data.issues || []);
    } catch (err) {
      setError("Failed to load your assigned tasks. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompletionImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateStatus = async (issueId, newStatus) => {
    if (newStatus === "Resolved" && !completionImage) {
      alert("Please upload a photo showing the completed work before resolving this issue.");
      return;
    }

    try {
      setActionLoading(true);
      await apiFetch(`/api/worker/issues/${issueId}/status`, {
        method: "PUT",
        body: JSON.stringify({
          status: newStatus,
          completionImageUrl: completionImage || undefined
        })
      });
      
      // Reset Modal & Refresh Data
      setSelectedIssue(null);
      setCompletionImage("");
      fetchIssues();

    } catch (err) {
      alert(err.message || "Failed to update issue status");
    } finally {
      setActionLoading(false);
    }
  };

  const activeIssues = issues.filter(i => i.status !== "Resolved");
  const completedIssues = issues.filter(i => i.status === "Resolved");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <DashboardHeader title="Worker" />

      <div className="p-8 max-w-7xl mx-auto">
        {/* Premium Hero Header */}
        <header className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-800 to-emerald-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-indigo-700/50 mb-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[80px] -z-0 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/20 rounded-full blur-[80px] -z-0 -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-100 text-xs font-bold tracking-wider uppercase mb-5 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Field Operative
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-3">My Tasks</h1>
            <p className="text-lg text-indigo-100/90 max-w-xl font-medium">
              View your active field assignments, update progress, and upload photographic proof of completion.
            </p>
          </div>
        </header>

        {error && (
          <div className="mb-8 bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center">
             <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium">Loading your route...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Active Queue */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl shadow-indigo-100/50 border border-white p-8 relative overflow-hidden group">
              <div className="absolute -inset-2 bg-gradient-to-br from-indigo-50 to-white -z-10 group-hover:from-indigo-100/50 transition-colors duration-500"></div>
              
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-900 to-slate-800 bg-clip-text text-transparent">Active Queue</h2>
                <span className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                  {activeIssues.length} Pending
                </span>
              </div>

              {activeIssues.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
                   <p className="text-gray-500 font-medium">No active tasks assigned to you right now.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeIssues.map(issue => (
                    <div 
                      key={issue._id} 
                      onClick={() => setSelectedIssue(issue)}
                      className="group/card cursor-pointer border border-gray-100 bg-white hover:bg-gradient-to-br hover:from-white hover:to-indigo-50/50 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-6 relative overflow-hidden transform hover:-translate-y-1"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-blue-500 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider
                          ${issue.status === 'Assigned' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                          {issue.status}
                        </span>
                        <span className="text-xs text-gray-400 font-mono font-medium">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-900 font-bold text-lg line-clamp-2 mb-2 group-hover/card:text-indigo-700 transition-colors">{issue.description}</p>
                      
                      <div className="flex items-center text-xs text-gray-500 font-medium pt-3 mt-auto border-t border-gray-50">
                        <svg className="w-4 h-4 mr-1.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        {issue.departmentId?.name || "Civic Dept."}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Work */}
            <div className="bg-emerald-50/50 backdrop-blur-md rounded-3xl shadow-lg border border-emerald-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-emerald-950">Completed Work</h2>
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-md shadow-emerald-500/20">
                  {completedIssues.length} Fixed
                </span>
              </div>

              {completedIssues.length === 0 ? (
                <div className="text-center py-12 bg-white/60 rounded-2xl border border-dashed border-emerald-200">
                   <p className="text-emerald-700/60 font-medium">You haven't completed any tasks yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {completedIssues.map(issue => (
                    <div key={issue._id} className="bg-white border border-emerald-100/60 hover:border-emerald-300 rounded-2xl p-5 flex gap-4 transition-colors shadow-sm">
                       {issue.completionImageUrl && (
                         <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-emerald-100 shadow-sm relative group">
                           <img src={issue.completionImageUrl} alt="Fix" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         </div>
                       )}
                       <div className="flex flex-col justify-center">
                         <p className="text-emerald-950 font-bold line-clamp-2 leading-tight mb-2">{issue.description}</p>
                         <p className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded inline-flex items-center gap-1.5 w-max">
                           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                           Resolved {new Date(issue.updatedAt).toLocaleDateString()}
                         </p>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Action Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header Image */}
            <div className="h-48 w-full bg-gray-200 relative">
              {selectedIssue.imageUrl ? (
                <img src={selectedIssue.imageUrl} alt="Complaint" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Provided</div>
              )}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                Lat: {selectedIssue.location?.lat?.toFixed(4)}, Lng: {selectedIssue.location?.lng?.toFixed(4)}
              </div>
            </div>

            <div className="p-8">
              <div className="mb-10 px-4 sm:px-8">
                 <StatusTimeline currentStatus={selectedIssue.status} />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">Issue Details</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 font-medium">
                {selectedIssue.description}
              </p>

              {selectedIssue.location && selectedIssue.location.lat && (
                 <div className="mb-8">
                   <h4 className="font-bold text-gray-500 text-xs uppercase tracking-wider mb-3">Location</h4>
                   <IssueMarkerMap 
                     lat={selectedIssue.location.lat} 
                     lng={selectedIssue.location.lng} 
                     popupText={selectedIssue.category} 
                     height="200px" 
                   />
                 </div>
              )}

              {/* Status Actions */}
              <div className="space-y-6">
                {selectedIssue.status === "Assigned" && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedIssue._id, "In Progress")}
                    disabled={actionLoading}
                    className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50"
                  >
                    {actionLoading ? "Updating..." : "Start Work / Mark 'In Progress'"}
                  </button>
                )}

                {selectedIssue.status === "InProgress" && (
                  <div className="space-y-4 bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                    <h4 className="font-bold text-indigo-900 text-sm">Action Required: Proof of Work</h4>
                    
                    <input 
                      type="file" accept="image/*" capture="environment" className="hidden" 
                      ref={fileInputRef} onChange={handleImageChange} 
                    />
                    
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className={`h-32 rounded-xl flex items-center justify-center cursor-pointer border-2 border-dashed transition-all bg-white
                        ${completionImage ? 'border-green-500' : 'border-indigo-300 hover:border-indigo-400'}`}
                    >
                       {completionImage ? (
                         <img src={completionImage} alt="Completion Proof" className="h-full w-full object-cover rounded-lg" />
                       ) : (
                         <span className="text-sm font-semibold text-indigo-600">📸 Take Photo of Completed Work</span>
                       )}
                    </div>

                    <button 
                      onClick={() => handleUpdateStatus(selectedIssue._id, "Resolved")}
                      disabled={actionLoading || !completionImage}
                      className="w-full py-4 rounded-xl font-black tracking-wide text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all shadow-xl shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed mt-4 transform hover:-translate-y-1"
                    >
                      {actionLoading ? "Resolving..." : "Submit Proof & Resolve Issue"}
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => { setSelectedIssue(null); setCompletionImage(""); }}
                className="w-full mt-4 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
