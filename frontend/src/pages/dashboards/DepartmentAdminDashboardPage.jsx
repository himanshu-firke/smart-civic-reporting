import React, { useEffect, useState } from "react";
import { apiFetch } from "../../api/client";
import { DashboardHeader } from "../../components/DashboardHeader";
import { DepartmentHeatmap } from "../../components/DepartmentHeatmap";

export function DepartmentAdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("workers"); // 'workers', 'issues', 'map'

  // Worker Tab State
  const [workers, setWorkers] = useState([]);
  const [workerLoading, setWorkerLoading] = useState(false);
  const [workerError, setWorkerError] = useState(null);
  
  // Worker Registration Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [radius, setRadius] = useState("");
  const [registering, setRegistering] = useState(false);

  // Issues Tab State
  const [issues, setIssues] = useState([]);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [issuesError, setIssuesError] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isVerifyLoading, setIsVerifyLoading] = useState(false);

  // Reassignment Modal State
  const [reassigningIssue, setReassigningIssue] = useState(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState("");
  const [reassignLoading, setReassignLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "workers") {
      fetchWorkers();
    } else if (activeTab === "issues" || activeTab === "map") {
      fetchIssues();
      // Pre-fetch workers so they are immediately available for reassignment dropdowns
      if (workers.length === 0) fetchWorkers();
    }
  }, [activeTab]);

  // --- WORKER METHODS ---
  const fetchWorkers = async () => {
    try {
      setWorkerLoading(true);
      const data = await apiFetch("/api/dept-admin/workers");
      setWorkers(data.workers || []);
      setWorkerError(null);
    } catch (err) {
      setWorkerError("Failed to load workers. " + err.message);
    } finally {
      setWorkerLoading(false);
    }
  };

  const handleRegisterWorker = async (e) => {
    e.preventDefault();
    setWorkerError(null);
    setRegistering(true);
    try {
      await apiFetch("/api/dept-admin/workers", {
        method: "POST",
        body: JSON.stringify({
          name, email, password,
          location: { lat: Number(lat), lng: Number(lng) },
          serviceRadiusKm: Number(radius)
        }),
      });
      setName(""); setEmail(""); setPassword(""); setLat(""); setLng(""); setRadius("");
      fetchWorkers();
    } catch (err) {
      setWorkerError(err.message || "Failed to register worker.");
    } finally {
      setRegistering(false);
    }
  };

  // --- ISSUES METHODS ---
  const fetchIssues = async () => {
    try {
      setIssuesLoading(true);
      const data = await apiFetch("/api/dept-admin/issues");
      setIssues(data.issues || []);
      setIssuesError(null);
    } catch (err) {
      setIssuesError("Failed to load department issues. " + err.message);
    } finally {
      setIssuesLoading(false);
    }
  };

  const handleUpdatePriority = async (issueId, newPriority) => {
    try {
      await apiFetch(`/api/dept-admin/issues/${issueId}/priority`, {
        method: "PUT",
        body: JSON.stringify({ priority: newPriority })
      });
      // Refresh cleanly after updating
      fetchIssues();
    } catch (err) {
      alert(err.message || "Failed to update priority");
    }
  };

  const handleVerifyAndClose = async (issueId) => {
    try {
      setIsVerifyLoading(true);
      await apiFetch(`/api/dept-admin/issues/${issueId}/verify`, { method: "PUT" });
      setSelectedIssue(null);
      fetchIssues();
    } catch (err) {
      alert(err.message || "Failed to close issue");
    } finally {
      setIsVerifyLoading(false);
    }
  };

  const handleReassignWorker = async (e) => {
    e.preventDefault();
    if (!selectedWorkerId) return alert("Please select a worker first.");
    
    try {
      setReassignLoading(true);
      await apiFetch(`/api/issues/${reassigningIssue._id}/reassign`, {
        method: "PUT",
        body: JSON.stringify({ assignedWorkerId: selectedWorkerId })
      });
      setReassigningIssue(null);
      setSelectedWorkerId("");
      fetchIssues();
    } catch (err) {
      alert(err.message || "Failed to reassign issue.");
    } finally {
      setReassignLoading(false);
    }
  };

  // --- RENDER HELPERS ---
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Submitted": return "bg-gray-100 text-gray-800";
      case "Assigned": return "bg-blue-100 text-blue-800";
      case "InProgress": return "bg-indigo-100 text-indigo-800";
      case "Resolved": return "bg-yellow-100 text-yellow-800";
      case "Closed": return "bg-emerald-100 text-emerald-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <DashboardHeader title="Department HQ" />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Command Center</h1>
            <p className="mt-2 text-lg text-gray-600">Oversee active complaints and manage your civic workforce.</p>
          </div>
          
          <div className="flex bg-white rounded-t-2xl border-b border-gray-200 overflow-x-auto shadow-sm">
            <button
              onClick={() => setActiveTab("workers")}
              className={`px-8 py-5 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === "workers" ? "border-b-4 border-indigo-600 text-indigo-700 bg-indigo-50/50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              Worker Roster
            </button>
            <button
              onClick={() => setActiveTab("issues")}
              className={`px-8 py-5 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === "issues" ? "border-b-4 border-indigo-600 text-indigo-700 bg-indigo-50/50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              Issue Tracking
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`px-8 py-5 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === "map" ? "border-b-4 border-indigo-600 text-indigo-700 bg-indigo-50/50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              Geospatial Analytics
            </button>
          </div>
        </header>

        {/* ------------------------------------------------------------- 
            TAB 1: ISSUE TRACKING (MODULE 11)
        ------------------------------------------------------------- */}
        {activeTab === "issues" && (
          <div className="space-y-6 animate-in fade-in duration-300">
             {issuesError && <p className="text-red-500 bg-red-50 p-4 rounded-xl font-medium text-sm">{issuesError}</p>}
             
             {issuesLoading ? (
                <div className="text-center py-20 text-gray-500">Scanning territory...</div>
             ) : (
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                        <th className="p-4 pl-6">Complaint</th>
                        <th className="p-4">Citizen</th>
                        <th className="p-4">Assigned Worker</th>
                        <th className="p-4 w-40">Priority</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {issues.map(issue => (
                        <tr key={issue._id} className="hover:bg-indigo-50/30 transition-colors group">
                          <td className="p-4 pl-6">
                            <div className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-[200px]" title={issue.description}>
                              {issue.description}
                            </div>
                            <div className="text-xs text-gray-400 font-mono mt-1">
                               {new Date(issue.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {issue.citizenId?.name || "Unknown"}
                          </td>
                          <td className="p-4 text-sm">
                            {issue.assignedWorkerId ? (
                              <span className="font-medium text-indigo-700 flex items-center">
                                {issue.assignedWorkerId.name || "Worker Assigned"}
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">Unassigned</span>
                            )}
                          </td>
                          <td className="p-4">
                            <select
                              value={issue.priority || "Medium"}
                              onChange={(e) => handleUpdatePriority(issue._id, e.target.value)}
                              className={`text-xs font-bold px-2 py-1 rounded border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getPriorityBadgeColor(issue.priority)}`}
                            >
                               <option value="Low">Low Priority</option>
                               <option value="Medium">Medium Priority</option>
                               <option value="High">High Priority</option>
                            </select>
                          </td>
                          <td className="p-4">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ${getStatusBadgeColor(issue.status)}`}>
                               {issue.status}
                             </span>
                          </td>
                          <td className="p-4 pr-6 text-right space-x-2">
                             {/* Reassign Button */}
                             {issue.status !== "Closed" && (
                               <button 
                                 onClick={() => setReassigningIssue(issue)}
                                 className="text-xs font-bold text-gray-500 hover:text-indigo-600 px-3 py-1.5 rounded bg-gray-100 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100"
                               >
                                 Reassign
                               </button>
                             )}
                             {/* Verify Button pops the modal */}
                             {issue.status === "Resolved" && (
                                <button 
                                  onClick={() => setSelectedIssue(issue)}
                                  className="text-xs font-bold text-white px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 shadow-sm shadow-green-500/30 transition-all"
                                >
                                  Verify Fix
                                </button>
                             )}
                          </td>
                        </tr>
                      ))}
                      {issues.length === 0 && (
                        <tr><td colSpan="6" className="p-8 text-center text-gray-500 text-sm">No issues reported in your district yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
             )}
          </div>
        )}

        {/* ------------------------------------------------------------- 
            TAB 2: WORKER ROSTER (MODULE 7)
        ------------------------------------------------------------- */}
        {activeTab === "workers" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            {/* Worker List */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                Active Field Operatives
                <span className="text-sm font-bold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">{workers.length} Total</span>
              </h2>
              {workerError && <p className="text-red-500 mb-4 text-sm font-medium">{workerError}</p>}
              
              {workerLoading ? <p className="text-gray-500 text-sm py-4">Loading operational roster...</p> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {workers.map(worker => (
                    <div key={worker._id} className="border border-gray-100 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-md transition-all bg-gray-50 group">
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">{worker.user?.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{worker.user?.email}</p>
                      
                      <div className="bg-white p-3 rounded-lg border border-gray-100 text-xs">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 font-semibold uppercase tracking-wider">Sector Lat/Lng</span>
                          <span className="font-mono text-gray-900">{worker.location.lat.toFixed(4)}, {worker.location.lng.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 font-semibold uppercase tracking-wider">Operational Radius</span>
                          <span className="font-bold text-indigo-600">{worker.serviceRadiusKm} km</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {workers.length === 0 && <p className="text-gray-500 text-sm">No workers registered in this department.</p>}
                </div>
              )}
            </div>

            {/* Register Form */}
            <div className="bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-600/20 p-8 text-white">
              <h2 className="text-2xl font-bold mb-2">Deploy Operative</h2>
              <p className="text-indigo-200 text-sm mb-6">Register a new worker and assign their operational jurisdiction coordinates.</p>
              
              <form onSubmit={handleRegisterWorker} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1">Full Name</label>
                  <input required type="text" className="w-full bg-indigo-700/50 border border-indigo-500 rounded-xl px-4 py-3 text-white placeholder-indigo-300 focus:ring-2 focus:ring-white focus:outline-none transition-all" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1">Email</label>
                  <input required type="email" className="w-full bg-indigo-700/50 border border-indigo-500 rounded-xl px-4 py-3 text-white placeholder-indigo-300 focus:ring-2 focus:ring-white focus:outline-none transition-all" value={email} onChange={e => setEmail(e.target.value)} placeholder="worker@city.gov" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1">Password</label>
                  <input required type="password" className="w-full bg-indigo-700/50 border border-indigo-500 rounded-xl px-4 py-3 text-white placeholder-indigo-300 focus:ring-2 focus:ring-white focus:outline-none transition-all" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1">Base Latitude</label>
                    <input required type="number" step="any" className="w-full bg-indigo-700/50 border border-indigo-500 rounded-xl px-4 py-3 text-white placeholder-indigo-300 focus:ring-2 focus:ring-white focus:outline-none transition-all" value={lat} onChange={e => setLat(e.target.value)} placeholder="34.0522" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1">Base Longitude</label>
                    <input required type="number" step="any" className="w-full bg-indigo-700/50 border border-indigo-500 rounded-xl px-4 py-3 text-white placeholder-indigo-300 focus:ring-2 focus:ring-white focus:outline-none transition-all" value={lng} onChange={e => setLng(e.target.value)} placeholder="-118.243" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1">Radius (km)</label>
                  <input required type="number" className="w-full bg-indigo-700/50 border border-indigo-500 rounded-xl px-4 py-3 text-white placeholder-indigo-300 focus:ring-2 focus:ring-white focus:outline-none transition-all" value={radius} onChange={e => setRadius(e.target.value)} placeholder="5" />
                </div>
                <button 
                  type="submit" disabled={registering}
                  className="w-full py-4 mt-2 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70"
                >
                  {registering ? "Deploying..." : "Provision Setup"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- 
            TAB 3: GEOSPATIAL ANALYTICS (MODULE 15)
        ------------------------------------------------------------- */}
        {activeTab === "map" && (
           <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-8 animate-in fade-in duration-300">
             <div className="mb-6">
               <h3 className="text-2xl font-bold text-gray-900 mb-2">City-Wide Hotspots</h3>
               <p className="text-gray-500">Visualizing {issues.length} civic complaints assigned to your department across the grid.</p>
             </div>
             <DepartmentHeatmap issues={issues} />
           </div>
        )}
      </div>

      {/* ------------------------------------------------------------- 
          MODAL: REASSIGN WORKER
      ------------------------------------------------------------- */}
      {reassigningIssue && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-200">
             <h3 className="text-2xl font-bold text-gray-900 mb-2">Reassign Worker</h3>
             <p className="text-gray-500 text-sm mb-6">Route this issue mechanically to another operative within your pool.</p>
             
             <form onSubmit={handleReassignWorker}>
               <label className="block text-sm font-bold text-gray-700 mb-2">Select Target Operative</label>
               <select 
                 required value={selectedWorkerId} onChange={e => setSelectedWorkerId(e.target.value)}
                 className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-900 mb-6"
               >
                 <option value="" disabled>Select an active worker...</option>
                 {workers.map(w => (
                   <option key={w._id} value={w._id}>{w.user?.name} (Radius: {w.serviceRadiusKm}km)</option>
                 ))}
               </select>

               <div className="space-y-3">
                 <button type="submit" disabled={reassignLoading} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50">
                   {reassignLoading ? "Transmitting..." : "Confirm Reassignment"}
                 </button>
                 <button type="button" onClick={() => setReassigningIssue(null)} className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all">
                   Cancel
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- 
          MODAL: VERIFY AND CLOSE ISSUE
      ------------------------------------------------------------- */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="p-8 border-b border-gray-100">
               <h3 className="text-2xl font-bold text-gray-900">Verify Resolution</h3>
               <p className="text-gray-500 text-sm mt-1">Review the field work before permanently closing this ticket.</p>
            </div>

            <div className="p-8 overflow-y-auto bg-gray-50 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Left: Original Issue */}
               <div className="space-y-4">
                 <h4 className="font-bold text-red-800 text-xs uppercase tracking-wider bg-red-100 inline-block px-3 py-1 rounded-full">Initial Report</h4>
                 <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                    {selectedIssue.imageUrl ? (
                      <img src={selectedIssue.imageUrl} alt="Original Complaint" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No original image</div>
                    )}
                 </div>
                 <p className="text-sm font-medium text-gray-900 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                   "{selectedIssue.description}"
                 </p>
               </div>

               {/* Right: Worker Proof */}
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <h4 className="font-bold text-emerald-800 text-xs uppercase tracking-wider bg-emerald-100 inline-block px-3 py-1 rounded-full">Completion Proof</h4>
                   <span className="text-xs text-gray-500 font-mono">By {selectedIssue.assignedWorkerId?.name || "Worker"}</span>
                 </div>
                 <div className="aspect-video bg-emerald-50 rounded-2xl overflow-hidden shadow-sm border border-emerald-200">
                    {selectedIssue.completionImageUrl ? (
                      <img src={selectedIssue.completionImageUrl} alt="Fix Proof" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-600/50 text-sm font-semibold">Missing evidentiary upload</div>
                    )}
                 </div>
                 <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 shadow-sm text-sm">
                   This issue was marked as Resolved. Please verify the visual proof aligns with department standards before closure.
                 </div>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0">
               <button onClick={() => setSelectedIssue(null)} className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all">
                 Cancel Review
               </button>
               <button 
                 onClick={() => handleVerifyAndClose(selectedIssue._id)} disabled={isVerifyLoading} 
                 className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2 disabled:opacity-50"
               >
                 {isVerifyLoading ? "Closing..." : (
                   <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Verify & Close Ticket</>
                 )}
               </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
