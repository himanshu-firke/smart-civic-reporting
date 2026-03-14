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
      <DashboardHeader title="Field Worker Portal" />

      <div className="p-8 max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Tasks</h1>
          <p className="mt-2 text-lg text-gray-600">
            View your active assignments and upload proof of completion.
          </p>
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
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Active Queue</h2>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                  {activeIssues.length} Pending
                </span>
              </div>

              {activeIssues.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                   <p className="text-gray-500">No active tasks assigned to you right now.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeIssues.map(issue => (
                    <div 
                      key={issue._id} 
                      onClick={() => setSelectedIssue(issue)}
                      className="group cursor-pointer border border-gray-100 bg-gray-50 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all rounded-2xl p-5"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide
                          ${issue.status === 'Assigned' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                          {issue.status}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-900 font-semibold text-lg line-clamp-1">{issue.description}</p>
                      <p className="text-sm text-gray-500 mt-1">{issue.departmentId?.name || "Civic Dept."}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Work */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-8 opacity-80">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Completed Work</h2>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                  {completedIssues.length} Fixed
                </span>
              </div>

              {completedIssues.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                   <p className="text-gray-500">You haven't completed any tasks yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {completedIssues.map(issue => (
                    <div key={issue._id} className="border border-green-100 bg-green-50/30 rounded-2xl p-5 flex gap-4">
                       {issue.completionImageUrl && (
                         <img src={issue.completionImageUrl} alt="Fix" className="w-16 h-16 rounded-xl object-cover shrink-0 border border-green-200" />
                       )}
                       <div>
                         <p className="text-gray-900 font-semibold line-clamp-1">{issue.description}</p>
                         <p className="text-xs text-gray-500 mt-1">Resolved on {new Date(issue.updatedAt).toLocaleDateString()}</p>
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
                      className="w-full py-4 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
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
