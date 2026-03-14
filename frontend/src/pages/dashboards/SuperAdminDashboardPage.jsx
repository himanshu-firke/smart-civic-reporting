import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/client";
import { DashboardHeader } from "../../components/DashboardHeader";
import { DepartmentHeatmap } from "../../components/DepartmentHeatmap";

export function SuperAdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview"); // "overview", "map", "reports"
  const [metrics, setMetrics] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      case "Submitted": return "border-gray-500 text-gray-700 bg-gray-50";
      case "Assigned": return "border-blue-500 text-blue-700 bg-blue-50";
      case "InProgress": return "border-indigo-500 text-indigo-700 bg-indigo-50";
      case "Resolved": return "border-yellow-500 text-yellow-700 bg-yellow-50";
      case "Closed": return "border-emerald-500 text-emerald-700 bg-emerald-50";
      default: return "border-gray-200 text-gray-500 bg-white";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <DashboardHeader title="Super Admin Override" />
      
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
              System Health
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`px-8 py-5 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === "map" ? "border-b-4 border-slate-900 text-slate-900 bg-slate-100/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
            >
              Super Heatmap
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
              </div>
            )}

            {/* TAB 2: SUPER HEATMAP */}
            {activeTab === "map" && (
              <div className="bg-slate-900 rounded-3xl p-1 md:p-8 shadow-2xl shadow-slate-900/50">
                 <div className="mb-6 px-4 md:px-0 flex justify-between items-end">
                   <div>
                     <h3 className="text-2xl font-bold text-white mb-2">Global Geospatial Array</h3>
                     <p className="text-slate-400 text-sm">Every civic issue simultaneously plotted over the infrastructure grid.</p>
                   </div>
                   <div className="text-right">
                     <span className="inline-block bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-bold border border-slate-700">
                       {issues.length} Data Points Active
                     </span>
                   </div>
                 </div>
                 {/* Reusing our beautiful Map component from Module 15 */}
                 <div className="rounded-2xl overflow-hidden ring-4 ring-slate-800">
                    <DepartmentHeatmap issues={issues} />
                 </div>
              </div>
            )}

            {/* TAB 3: GLOBAL LOGS */}
            {activeTab === "reports" && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-900">Master Ticket Registry</h3>
                  <button onClick={() => window.print()} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Export Report
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                     <thead>
                       <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold tracking-wider uppercase text-xs">
                         <th className="p-4 pl-6">ID / Date</th>
                         <th className="p-4">Department</th>
                         <th className="p-4">Citizen</th>
                         <th className="p-4 w-1/3">Description</th>
                         <th className="p-4 pr-6 text-right">State</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {issues.map(issue => (
                         <tr key={issue._id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 pl-6 font-mono text-xs text-slate-500">
                               <div className="text-slate-900 font-bold mb-1">...{issue._id.slice(-6)}</div>
                               <div>{new Date(issue.createdAt).toLocaleDateString()}</div>
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
