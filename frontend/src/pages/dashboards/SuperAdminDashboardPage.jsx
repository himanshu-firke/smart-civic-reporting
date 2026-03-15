import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { apiFetch } from "../../api/client";
import { DashboardHeader } from "../../components/DashboardHeader";
import { DepartmentHeatmap } from "../../components/DepartmentHeatmap";

export function SuperAdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview"); // "overview", "reports" (map removed, integrated into overview)
  const [metrics, setMetrics] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Global Command</h1>
            <p className="mt-2 text-lg text-slate-600">City-wide system monitoring and analytics generation.</p>
          </div>
          
          <div className="flex bg-white rounded-t-2xl border-b border-slate-200 overflow-x-auto shadow-sm">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-8 py-5 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === "overview" ? "border-b-4 border-slate-900 text-slate-900 bg-slate-100/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
            >
              System Health & Heatmap
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-8 py-5 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === "reports" ? "border-b-4 border-slate-900 text-slate-900 bg-slate-100/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
            >
              Global Logs
            </button>
            <div className="flex-1 min-w-[20px] border-b-4 border-transparent"></div>
            <button
              onClick={() => navigate("/super-admin/departments")}
              className={`px-8 py-5 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 border-l border-slate-200`}
            >
              Manage Departments &rarr;
            </button>
          </div>
        </header>

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
                   <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/40 text-center relative overflow-hidden group">
                      <div className="absolute inset-x-0 -bottom-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Total System Load</p>
                      <h2 className="text-6xl font-black text-slate-900">{metrics.totalIssues}</h2>
                      <p className="text-slate-400 text-sm mt-3">All civic issues ever tracked</p>
                   </div>
                   
                   <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl shadow-slate-900/40 text-center text-white relative overflow-hidden">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Active Field Ops</p>
                      <h2 className="text-6xl font-black text-white">{metrics.byStatus?.InProgress || 0}</h2>
                      <p className="text-slate-500 text-sm mt-3">Issues currently In Progress</p>
                   </div>

                   <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 shadow-xl shadow-emerald-200/40 text-center relative overflow-hidden group">
                      <div className="absolute inset-x-0 -bottom-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                      <p className="text-emerald-700 font-bold uppercase tracking-widest text-xs mb-2">Resolution Count</p>
                      <h2 className="text-6xl font-black text-emerald-900">{(metrics.byStatus?.Resolved || 0) + (metrics.byStatus?.Closed || 0)}</h2>
                      <p className="text-emerald-600/70 text-sm mt-3">Successfully fixed & closed</p>
                   </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mt-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Status Distribution</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                     {["Submitted", "Assigned", "InProgress", "Resolved", "Closed"].map(stat => (
                       <div key={stat} className={`p-4 rounded-xl border-l-4 ${getStatusColor(stat)} shadow-sm`}>
                         <p className="text-xs uppercase font-bold opacity-70 mb-1">{stat}</p>
                         <p className="text-2xl font-black">{metrics.byStatus?.[stat] || 0}</p>
                       </div>
                     ))}
                  </div>
                </div>

                {/* --- DEPARTMENTAL CHARTS (ENHANCEMENT) --- */}
                {metrics.byDepartment && metrics.byDepartment.length > 0 && (
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mt-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                       Departmental Load Tracking
                       <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full">{metrics.byDepartment.length} Active</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                           <div key={dept.name} className="border border-slate-100 rounded-2xl p-4 shadow-sm bg-slate-50/50 flex flex-col items-center">
                             <h4 className="font-bold text-slate-800 text-center w-full mb-1">{dept.name}</h4>
                             <p className="text-xs font-bold text-slate-400 mb-4">{total} Total Tickets</p>
                             
                             {total > 0 ? (
                               <div className="w-full h-48">
                                 <ResponsiveContainer width="100%" height="100%">
                                   <PieChart>
                                     <Pie
                                       data={data}
                                       cx="50%" cy="50%"
                                       innerRadius={40} outerRadius={70}
                                       paddingAngle={2}
                                       dataKey="value"
                                     >
                                       {data.map((entry, index) => (
                                         <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                                       ))}
                                     </Pie>
                                     <Tooltip formatter={(value) => [value, 'Tickets']} />
                                     <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
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
                <div className="bg-slate-900 rounded-3xl p-1 md:p-8 shadow-2xl shadow-slate-900/50 mt-8">
                   <div className="mb-6 px-4 md:px-0 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                     <div>
                       <h3 className="text-2xl font-bold text-white mb-2">Global Geospatial Array</h3>
                       <p className="text-slate-400 text-sm">Every civic issue simultaneously plotted over the infrastructure grid.</p>
                     </div>
                     <div className="text-left sm:text-right">
                       <span className="inline-block bg-slate-800 text-slate-300 px-4 py-2 rounded-full text-xs font-bold border border-slate-700 shadow-inner">
                         {issues.length} Data Points Active
                       </span>
                     </div>
                   </div>
                   <div className="rounded-2xl overflow-hidden ring-4 ring-slate-800/80 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
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
                         <th className="p-4 w-1/3">Description</th>
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
    </div>
  );
}
