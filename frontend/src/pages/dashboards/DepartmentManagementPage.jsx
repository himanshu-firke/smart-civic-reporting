import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../api/client";
import { DashboardHeader } from "../../components/DashboardHeader";

export function DepartmentManagementPage() {
  const [activeTab, setActiveTab] = useState("departments"); // 'departments' or 'admins'
  
  // -- DEPARTMENTS STATE --
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  // -- ADMINS STATE --
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminDeptId, setAdminDeptId] = useState("");
  const [adminRegistering, setAdminRegistering] = useState(false);
  const [adminRegError, setAdminRegError] = useState(null);
  const [adminRegSuccess, setAdminRegSuccess] = useState(false);

  // -- EDIT STATE --
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [editingDeptName, setEditingDeptName] = useState("");
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [editingAdminName, setEditingAdminName] = useState("");
  const [editingAdminEmail, setEditingAdminEmail] = useState("");
  const [editingAdminDept, setEditingAdminDept] = useState("");

  useEffect(() => {
    fetchDepartments();
    if (activeTab === "admins") {
      fetchUsers();
    }
  }, [activeTab]);

  async function fetchDepartments() {
    try {
      const data = await apiFetch("/api/departments");
      setDepartments(data.departments || []);
    } catch (err) {
      setError(err.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsers() {
    setUsersLoading(true);
    try {
      const data = await apiFetch("/api/admin/users");
      setUsers(data.users || []);
    } catch (err) {
      setUsersError(err.message || "Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  }

  async function handleCreateDepartment(e) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);
    setFormLoading(true);

    try {
      await apiFetch("/api/departments", {
        method: "POST",
        body: JSON.stringify({ name })
      });
      
      setFormSuccess(true);
      setName("");
      
      // Refresh list
      fetchDepartments();
    } catch (err) {
      setFormError(err.message || "Failed to create department");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleCreateAdmin(e) {
    e.preventDefault();
    setAdminRegError(null);
    setAdminRegSuccess(false);
    setAdminRegistering(true);

    try {
      if (editingAdminId) {
        await apiFetch(`/api/admin/department-admins/${editingAdminId}`, {
          method: "PUT",
          body: JSON.stringify({
            name: adminName,
            email: adminEmail,
            departmentId: adminDeptId,
            ...(adminPassword && { password: adminPassword }) // optional password update handled on backend if desired, though our current backend ignores password on put
          })
        });
        setAdminRegSuccess("Admin credentials updated!");
      } else {
        await apiFetch("/api/admin/department-admins", {
          method: "POST",
          body: JSON.stringify({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            departmentId: adminDeptId
          })
        });
        setAdminRegSuccess("Admin credentials provisioned!");
      }

      setAdminName(""); setAdminEmail(""); setAdminPassword(""); setAdminDeptId("");
      setEditingAdminId(null);
      fetchUsers(); // refresh the table
    } catch (err) {
      setAdminRegError(err.message || "Failed to save Department Admin");
    } finally {
      setAdminRegistering(false);
    }
  }

  async function handleDeleteDepartment(id) {
    if (!window.confirm("Are you sure you want to delete this department? This cannot be undone.")) return;
    try {
      await apiFetch(`/api/departments/${id}`, { method: "DELETE" });
      fetchDepartments();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  async function handleSaveEditingDepartment(id) {
    try {
      await apiFetch(`/api/departments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name: editingDeptName })
      });
      setEditingDeptId(null);
      fetchDepartments();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  async function handleDeleteAdmin(id) {
    if (!window.confirm("Are you sure you want to securely revoke this administrator's access?")) return;
    try {
      await apiFetch(`/api/admin/department-admins/${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <DashboardHeader title="Department Management">
        <Link to="/super-admin" className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors hidden sm:block">
          &larr; Back to Users
        </Link>
      </DashboardHeader>

      <div className="p-8 max-w-5xl mx-auto space-y-8">
        <header className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-800 to-indigo-950 rounded-3xl p-8 md:p-12 shadow-2xl border border-indigo-700/50 mb-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[80px] -z-0 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-[80px] -z-0 -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-100 text-xs font-bold tracking-wider uppercase mb-5 backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span> Registration Hub
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-3">Manage Personnel</h1>
              <p className="text-lg text-indigo-100/90 max-w-xl font-medium">Create functional civic departments and securely provision lead administrators.</p>
            </div>
          </div>
        </header>
        
        {/* Floating Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4 bg-white/60 backdrop-blur-md p-2 rounded-2xl border border-gray-200/60 shadow-sm w-full overflow-x-auto mb-8">
            <button
              onClick={() => setActiveTab("departments")}
              className={`px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-300 whitespace-nowrap ${activeTab === "departments" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transform -translate-y-0.5" : "text-gray-500 hover:text-indigo-600 hover:bg-white/80"}`}
            >
              Infrastructure Depts
            </button>
            <button
              onClick={() => setActiveTab("admins")}
              className={`px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-300 whitespace-nowrap ${activeTab === "admins" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transform -translate-y-0.5" : "text-gray-500 hover:text-indigo-600 hover:bg-white/80"}`}
            >
              Department Admins
            </button>
        </div>

        {activeTab === "departments" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            {/* Create Department Form */}
            <div className="lg:col-span-1 border border-white bg-white/90 backdrop-blur-md rounded-3xl shadow-xl shadow-indigo-100/50 p-8 h-fit relative overflow-hidden group">
              <div className="absolute -inset-2 bg-gradient-to-br from-indigo-50 to-white -z-10 transition-colors duration-500"></div>
              
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 transform group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                   <h2 className="text-xl font-black text-gray-900 tracking-tight">New Dept</h2>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Initialization</p>
                </div>
              </div>
            
            <form onSubmit={handleCreateDepartment} className="space-y-6">
              {formError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-bold border border-red-100 shadow-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-bold border border-emerald-100 shadow-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Department created successfully!
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Department Name</label>
                <input
                  type="text" required
                  className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium text-gray-900 placeholder-gray-400"
                  placeholder="e.g. Roads & Transport"
                  value={name} onChange={e => setName(e.target.value)}
                />
              </div>

              <button
                type="submit" disabled={formLoading}
                className={`w-full py-4 px-4 rounded-xl text-white font-black tracking-wide text-sm shadow-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2 ${formLoading ? 'opacity-70' : 'hover:-translate-y-1 shadow-indigo-500/30'}`}
              >
                {formLoading ? "Provisioning..." : "Create Department"}
              </button>
            </form>
          </div>

          {/* Departments Table */}
          <div className="lg:col-span-2 border border-white bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-gray-200/40 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gradient-to-r from-gray-50/50 to-white">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Active Departments</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Infrastructure Registry</p>
              </div>
              <span className="bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                {departments.length} Units Online
              </span>
            </div>
            
            <div className="p-0 overflow-x-auto custom-scrollbar">
              {loading ? (
                <div className="p-12 text-center text-gray-500 font-medium">Loading departments...</div>
              ) : error ? (
                <div className="p-12 text-center text-red-500 font-medium">{error}</div>
              ) : departments.length === 0 ? (
                <div className="p-12 text-center text-gray-500 font-medium">No departments found.</div>
              ) : (
                <table className="min-w-full border-collapse">
                  <thead className="bg-gray-50/80 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-5 text-left text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">Department Name</th>
                      <th className="px-8 py-5 text-left text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">Internal Hash</th>
                      <th className="px-8 py-5 text-left text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">Created Date</th>
                      <th className="px-8 py-5 text-right text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">Controls</th>
                    </tr>
                  </thead>
                  <tbody className="bg-transparent divide-y divide-gray-50">
                    {departments.map((dept) => (
                      <tr key={dept._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-4 whitespace-nowrap text-sm font-bold text-gray-900 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                          {editingDeptId === dept._id ? (
                            <input 
                              type="text" autoFocus
                              className="border-b border-indigo-500 bg-indigo-50 px-2 py-1 outline-none font-bold text-indigo-700" 
                              value={editingDeptName} 
                              onChange={(e) => setEditingDeptName(e.target.value)} 
                              onBlur={() => handleSaveEditingDepartment(dept._id)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveEditingDepartment(dept._id)}
                            />
                          ) : (
                            dept.name
                          )}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">
                          {dept._id}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-400 font-mono text-[11px]">
                          {dept.createdAt ? new Date(dept.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-right space-x-4">
                           <button onClick={() => { setEditingDeptId(dept._id); setEditingDeptName(dept.name); }} className="text-indigo-600 hover:text-indigo-900 text-sm font-bold uppercase tracking-wide transition-colors">Edit</button>
                           <button onClick={() => handleDeleteDepartment(dept._id)} className="text-red-400 hover:text-red-600 text-sm font-bold uppercase tracking-wide transition-colors">Terminate</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        )}

        {/* --- Department Admins Tab --- */}
        {activeTab === "admins" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            {/* Create Admin Form */}
            <div className="lg:col-span-1 border border-white bg-white/90 backdrop-blur-md rounded-3xl shadow-xl shadow-indigo-100/50 p-8 h-fit relative overflow-hidden group">
              <div className="absolute -inset-2 bg-gradient-to-br from-indigo-50 to-white -z-10 transition-colors duration-500"></div>
              
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 transform group-hover:scale-105 transition-transform">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Deploy Admin</h2>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Credential Linking</p>
                </div>
              </div>
              
              <form onSubmit={handleCreateAdmin} className="space-y-5">
                {adminRegError && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs font-bold shadow-sm border border-red-100">{adminRegError}</div>}
                {adminRegSuccess && <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-xs font-bold shadow-sm border border-emerald-100">{adminRegSuccess}</div>}

                 <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
                  <input type="text" required value={adminName} onChange={e => setAdminName(e.target.value)} className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900 placeholder-gray-400" placeholder="John Doe" />
                 </div>
                 <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email</label>
                  <input type="email" required value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900 placeholder-gray-400" placeholder="admin@city.gov" />
                 </div>
                 <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Password {!editingAdminId ? '' : '(Leave blank to keep current)'}</label>
                  <input type="password" required={!editingAdminId} value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900 placeholder-gray-400" placeholder="••••••••" />
                 </div>
                 <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Assign Department</label>
                  <select required value={adminDeptId} onChange={e => setAdminDeptId(e.target.value)} className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900 cursor-pointer">
                    <option value="" disabled>Select Department...</option>
                    {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                 </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={adminRegistering} className={`flex-1 py-4 px-4 rounded-xl text-white font-black tracking-wide text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-xl shadow-blue-500/30 ${adminRegistering ? '' : 'hover:-translate-y-1'}`}>
                    {adminRegistering ? "Saving..." : editingAdminId ? "Update Admin" : "Assign Dept Admin"}
                  </button>
                  {editingAdminId && (
                     <button type="button" onClick={() => { setEditingAdminId(null); setAdminName(""); setAdminEmail(""); setAdminDeptId(""); setAdminRegSuccess(false); setAdminRegError(false); }} className="py-4 px-6 rounded-xl text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 font-bold text-sm shadow-sm transition-colors cursor-pointer">
                       Cancel
                     </button>
                  )}
                </div>
              </form>
            </div>

            {/* Users Roster Table */}
            <div className="lg:col-span-2 border border-white bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-gray-200/40 overflow-hidden">
               <div className="px-8 py-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gradient-to-r from-gray-50/50 to-white">
                 <div>
                   <h2 className="text-xl font-black text-gray-900 tracking-tight">System Roster</h2>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Directory Access</p>
                 </div>
               </div>
               
               <div className="p-0 overflow-x-auto custom-scrollbar">
                 {usersLoading ? <div className="p-8 text-center text-gray-500 text-sm font-medium">Loading personnel...</div> : (
                   <table className="min-w-full border-collapse">
                     <thead className="bg-gray-50/80 border-b border-gray-100">
                       <tr>
                         <th className="px-8 py-5 text-left text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">Personnel</th>
                         <th className="px-8 py-5 text-left text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">Class</th>
                         <th className="px-8 py-5 text-left text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">Department Unit</th>
                         <th className="px-8 py-5 text-right text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">Controls</th>
                       </tr>
                     </thead>
                     <tbody className="bg-transparent divide-y divide-gray-50">
                        {users.filter(u => u.role === "Department Admin" || u.role === "DepartmentAdmin").map(u => (
                          <tr key={u._id} className="hover:bg-gray-50">
                            <td className="px-8 py-5 text-sm">
                               <div className="font-bold text-gray-900">{u.name}</div>
                               <div className="text-gray-500 font-mono text-xs mt-0.5">{u.email}</div>
                            </td>
                            <td className="px-8 py-5 text-sm">
                               <span className={`inline-block px-3 py-1 rounded-md text-[10px] sm:text-xs font-black uppercase tracking-wider border shadow-sm ${u.role === 'SuperAdmin' ? 'bg-slate-900 text-white border-slate-900' : (u.role === 'Department Admin' || u.role === 'DepartmentAdmin') ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                 {u.role}
                               </span>
                            </td>
                            <td className="px-8 py-5 text-sm font-medium text-gray-600">
                               {u.departmentId ? (
                                 <span className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                    {u.departmentId.name}
                                 </span>
                               ) : <span className="text-gray-400 italic">Global / None</span>}
                            </td>
                            <td className="px-8 py-5 text-sm text-right space-x-4">
                               <button onClick={() => { 
                                 setEditingAdminId(u._id); 
                                 setAdminName(u.name); 
                                 setAdminEmail(u.email); 
                                 setAdminDeptId(u.departmentId ? u.departmentId._id : '');
                                 setAdminRegSuccess(false);
                                 setAdminRegError(false);
                               }} className="font-bold text-indigo-600 hover:text-indigo-900 uppercase tracking-wide transition-colors">Edit</button>
                               <button onClick={() => handleDeleteAdmin(u._id)} className="font-bold text-red-500 hover:text-red-700 uppercase tracking-wide transition-colors">Revoke</button>
                            </td>
                          </tr>
                        ))}
                     </tbody>
                   </table>
                 )}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
