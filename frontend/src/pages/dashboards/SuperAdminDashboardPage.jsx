import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { apiFetch } from "../../api/client";
import { DashboardHeader } from "../../components/DashboardHeader";
import { DepartmentHeatmap } from "../../components/DepartmentHeatmap";
import { IssueDetailsModal } from "../../components/IssueDetailsModal";

export function SuperAdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview"); // "overview", "reports" (map removed, integrated into overview)
  const [metrics, setMetrics] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [viewModalIssue, setViewModalIssue] = useState(null);
  const [viewModalTab, setViewModalTab] = useState("images");

  // Filters for Global Logs
  const [logStatusFilter, setLogStatusFilter] = useState("All");
  const [logDateSort, setLogDateSort] = useState("Newest");

  const COLORS = {
    Submitted: "#64748b", // slate-500
    Assigned: "#3b82f6",  // blue-500
    InProgress: "#6366f1",// indigo-500
    Resolved: "#eab308",  // yellow-500
    Closed: "#10b981",    // emerald-500
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, reportsRes] = await Promise.all([
        apiFetch("/api/admin/analytics"),
        apiFetch("/api/admin/reports/issues"),
      ]);
      setMetrics(analyticsRes.metrics);
      setIssues(reportsRes.issues || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load system metrics.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted": return "border-slate-500 text-slate-700 bg-slate-50";
      case "Assigned": return "border-blue-500 text-blue-700 bg-blue-50";
      case "InProgress": return "border-indigo-500 text-indigo-700 bg-indigo-50";
      case "Resolved": return "border-yellow-500 text-yellow-700 bg-yellow-50";
      case "Closed": return "border-emerald-500 text-emerald-700 bg-emerald-50";
      default: return "border-gray-200 text-gray-500 bg-white";
    }
  };

  const filteredLogs = useMemo(() => {
    let result = [...issues];
    if (logStatusFilter !== "All") {
      result = result.filter(iss => iss.status === logStatusFilter);
    }
    result.sort((a, b) => {
      const d1 = new Date(a.createdAt).getTime();
      const d2 = new Date(b.createdAt).getTime();
      return logDateSort === "Newest" ? d2 - d1 : d1 - d2;
    });
    return result;
  }, [issues, logStatusFilter, logDateSort]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <DashboardHeader title="Super Admin" />
      
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Premium Hero Header */}
        <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-700/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[80px] -z-0 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-[80px] -z-0 -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-100 text-xs font-bold tracking-wider uppercase mb-5 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span> Supreme Commander
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-3">Global Command</h1>
            <p className="text-lg text-slate-300 max-w-xl font-medium">
              City-wide system monitoring, administrative oversight, and geospatial analytics generation in real-time.
            </p>
          </div>
        </header>

        {/* Floating Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4 bg-white/60 backdrop-blur-md p-2 rounded-2xl border border-gray-200/60 shadow-sm w-full overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-300 whitespace-nowrap ${activeTab === "overview" ? "bg-slate-900 text-white shadow-lg shadow-slate-900/30 transform -translate-y-0.5" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80"}`}
            >
              System Health & Heatmap
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-300 whitespace-nowrap ${activeTab === "reports" ? "bg-slate-900 text-white shadow-lg shadow-slate-900/30 transform -translate-y-0.5" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80"}`}
            >
              Global Logs
            </button>
            
            <div className="hidden sm:block flex-1"></div>
            
            <button
              onClick={() => navigate("/super-admin/departments")}
              className={`px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-300 whitespace-nowrap bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-100 shadow-sm shadow-indigo-200/50 hover:shadow-indigo-500/30 group`}
            >
               Manage Departments <span className="inline-block transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium animate-pulse">
            Aggregating city-wide data streams...
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            
            {/* TAB 1: OVERVIEW METRICS */}
            {activeTab === "overview" && metrics && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-white shadow-xl shadow-slate-200/50 text-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform origin-left"></div>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Total System Load</p>
                      <h2 className="text-6xl font-black text-slate-900 group-hover:scale-105 transition-transform">{metrics.totalIssues}</h2>
                      <p className="text-slate-400 text-sm mt-3 font-medium">All tracked civic issues</p>
                   </div>
                   
                   <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 border border-slate-800 shadow-xl shadow-indigo-900/30 text-center text-white relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                      <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs mb-2 relative z-10">Active Field Ops</p>
                      <h2 className="text-6xl font-black text-white relative z-10 group-hover:scale-105 transition-transform">{metrics.byStatus?.InProgress || 0}</h2>
                      <p className="text-indigo-300/70 text-sm mt-3 font-medium relative z-10">Issues currently In Progress</p>
                   </div>

                   <div className="bg-emerald-50/80 backdrop-blur-md rounded-3xl p-8 border border-emerald-100 shadow-xl shadow-emerald-200/40 text-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 transform origin-left"></div>
                      <p className="text-emerald-700 font-bold uppercase tracking-widest text-xs mb-2">Resolution Count</p>
                      <h2 className="text-6xl font-black text-emerald-900 group-hover:scale-105 transition-transform">{(metrics.byStatus?.Resolved || 0) + (metrics.byStatus?.Closed || 0)}</h2>
                      <p className="text-emerald-600/70 text-sm mt-3 font-medium">Successfully fixed & closed</p>
                   </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white shadow-lg shadow-slate-200/40 mt-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 font-display tracking-tight">Status Distribution</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                     {["Submitted", "Assigned", "InProgress", "Resolved", "Closed"].map(stat => (
                       <div key={stat} className={`p-4 rounded-xl border-l-4 ${getStatusColor(stat)} shadow-sm hover:shadow-md transition-shadow`}>
                         <p className="text-[10px] sm:text-xs uppercase font-bold opacity-70 mb-1 tracking-wider">{stat}</p>
                         <p className="text-2xl font-black">{metrics.byStatus?.[stat] || 0}</p>
                       </div>
                     ))}
                  </div>
                </div>

                {/* --- DEPARTMENTAL CHARTS (ENHANCEMENT) --- */}
                {metrics.byDepartment && metrics.byDepartment.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white shadow-lg shadow-slate-200/40 mt-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3 font-display tracking-tight">
                       Departmental Load Tracking
                       <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full font-black shadow-sm">{metrics.byDepartment.length} Active</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {metrics.byDepartment.map(dept => {
                        const data = [
                          { name: 'Submitted', value: dept.statuses.Submitted },
                          { name: 'Assigned', value: dept.statuses.Assigned },
                          { name: 'InProgress', value: dept.statuses.InProgress },
                          { name: 'Resolved', value: dept.statuses.Resolved },
                          { name: 'Closed', value: dept.statuses.Closed }
                        ].filter(d => d.value > 0); // Only show statuses that have tickets
                        
                        const total = data.reduce((sum, d) => sum + d.value, 0);

                        return (
                           <div key={dept.name} className="border border-slate-100 rounded-2xl p-5 shadow-sm bg-gradient-to-br from-white to-slate-50/50 flex flex-col items-center hover:shadow-md transition-shadow">
                             <h4 className="font-bold text-slate-800 text-center w-full mb-1">{dept.name}</h4>
                             <p className="text-xs font-bold text-slate-400 mb-4 tracking-wider uppercase">{total} Total Tickets</p>
                             
                             {total > 0 ? (
                                <div className="w-full h-48 drop-shadow-md">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                      <Pie
                                        data={data}
                                        cx="50%" cy="50%"
                                        innerRadius={45} outerRadius={75}
                                        paddingAngle={3}
                                        dataKey="value"
                                        stroke="none"
                                      >
                                        {data.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                                        ))}
                                      </Pie>
                                      <Tooltip formatter={(value) => [value, 'Tickets']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                      <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </div>
                             ) : (
                                <div className="h-48 flex items-center justify-center text-slate-400 text-sm italic font-medium">No active tickets.</div>
                             )}
                           </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* --- SUPER HEATMAP (MOVED FROM TAB 2) --- */}
                <div className="bg-slate-900 rounded-3xl p-1 md:p-8 shadow-2xl shadow-slate-900/50 mt-8 relative overflow-hidden">
                   <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                   
                   <div className="mb-6 px-4 md:px-0 flex flex-col sm:flex-row justify-between sm:items-end gap-4 relative z-10">
                     <div>
                       <h3 className="text-2xl font-bold text-white mb-2 font-display tracking-tight">Global Geospatial Array</h3>
                       <p className="text-slate-400 text-sm">Every civic issue simultaneously plotted over the infrastructure grid.</p>
                     </div>
                     <div className="text-left sm:text-right">
                       <span className="inline-block bg-slate-800 text-slate-300 px-4 py-2 rounded-full text-xs font-bold border border-slate-700 shadow-inner">
                         {issues.length} Data Points Active
                       </span>
                     </div>
                   </div>
                   <div className="rounded-2xl overflow-hidden ring-4 ring-slate-800/80 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10">
                      <DepartmentHeatmap issues={issues} />
                   </div>
                </div>

              </div>
            )}

            {/* TAB 3: GLOBAL LOGS */}
            {activeTab === "reports" && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row justify-between lg:items-center gap-4 bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 text-lg">Master Ticket Registry</h3>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 pr-2 shadow-sm">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">Status</span>
                       <select value={logStatusFilter} onChange={(e) => setLogStatusFilter(e.target.value)} className="text-sm font-bold text-slate-700 bg-transparent outline-none cursor-pointer">
                         <option value="All">All States</option>
                         <option value="Submitted">Submitted</option>
                         <option value="Assigned">Assigned</option>
                         <option value="InProgress">In Progress</option>
                         <option value="Resolved">Resolved</option>
                         <option value="Closed">Closed</option>
                       </select>
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 pr-2 shadow-sm">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">Sort</span>
                       <select value={logDateSort} onChange={(e) => setLogDateSort(e.target.value)} className="text-sm font-bold text-slate-700 bg-transparent outline-none cursor-pointer">
                         <option value="Newest">Newest First</option>
                         <option value="Oldest">Oldest First</option>
                       </select>
                    </div>

                    <button onClick={() => window.print()} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2 border border-indigo-100/50">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                      Export Report
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                     <thead>
                       <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold tracking-wider uppercase text-xs">
                         <th className="p-4 pl-6">Date</th>
                         <th className="p-4">Department</th>
                         <th className="p-4">Citizen</th>
                         <th className="p-4 w-1/4">Description</th>
                         <th className="p-4 text-center">View (Images)</th>
                         <th className="p-4 text-center">More (Details)</th>
                         <th className="p-4 pr-6 text-right">State</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {filteredLogs.map(issue => (
                         <tr key={issue._id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 pl-6 font-mono text-xs text-slate-500">
                               <div className="text-slate-900 font-bold">
                                 {new Date(issue.createdAt).toLocaleDateString()}
                               </div>
                               <div className="text-[10px] mt-0.5">
                                 {new Date(issue.createdAt).toLocaleTimeString([], {timeStyle: 'short'})}
                               </div>
                            </td>
                            <td className="p-4 font-bold text-slate-700">
                               {issue.departmentId?.name || "System"}
                            </td>
                            <td className="p-4 text-slate-600">
                               {issue.citizenId?.name || "Anonymous"}
                            </td>
                            <td className="p-4 text-slate-500">
                               <span className="line-clamp-2">{issue.description}</span>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => { setViewModalIssue(issue); setViewModalTab("images"); }}
                                className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-100 transition-colors"
                              >
                                Images
                              </button>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => { setViewModalIssue(issue); setViewModalTab("details"); }}
                                className="text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-100 transition-colors"
                              >
                                Report PDF
                              </button>
                            </td>
                            <td className="p-4 pr-6 text-right">
                               <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold border ${getStatusColor(issue.status)}`}>
                                 {issue.status}
                               </span>
                            </td>
                         </tr>
                       ))}
                     </tbody>
                  </table>
                </div>
              </div>
            )}
            
          </div>
        )}
      </div>

      {viewModalIssue && (
        <IssueDetailsModal 
           issue={viewModalIssue} 
           onClose={() => setViewModalIssue(null)} 
           defaultTab={viewModalTab} 
        />
      )}

    </div>
  );
}
