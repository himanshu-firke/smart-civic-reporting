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
      await apiFetch("/api/admin/department-admins", {
        method: "POST",
        body: JSON.stringify({
          name: adminName,
          email: adminEmail,
          password: adminPassword,
          departmentId: adminDeptId
        })
      });
      setAdminRegSuccess(true);
      setAdminName(""); setAdminEmail(""); setAdminPassword(""); setAdminDeptId("");
      fetchUsers(); // refresh the table
    } catch (err) {
      setAdminRegError(err.message || "Failed to register Department Admin");
    } finally {
      setAdminRegistering(false);
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
        
        <header className="mb-6 border-b border-gray-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Manage Departments & Personnel</h1>
            <p className="mt-2 text-lg text-gray-600">Create functional civic departments and assign lead administrators.</p>
          </div>
          
          <div className="flex bg-white rounded-t-2xl border-b border-gray-200 overflow-x-auto shadow-sm">
            <button
              onClick={() => setActiveTab("departments")}
              className={`px-8 py-5 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === "departments" ? "border-b-4 border-indigo-600 text-indigo-700 bg-indigo-50/50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              Infrastructure Depts
            </button>
            <button
              onClick={() => setActiveTab("admins")}
              className={`px-8 py-5 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === "admins" ? "border-b-4 border-indigo-600 text-indigo-700 bg-indigo-50/50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              Department Admins
            </button>
          </div>
        </header>

        {activeTab === "departments" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            {/* Create Department Form */}
            <div className="lg:col-span-1 border border-gray-100 bg-white rounded-3xl shadow-xl shadow-gray-200/40 p-8 h-fit">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">New Dept</h2>
            </div>
            
            <form onSubmit={handleCreateDepartment} className="space-y-5">
              {formError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm font-medium border border-red-100">
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm font-medium border border-green-100">
                  Department created successfully!
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department Name</label>
                <input
                  type="text" required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                  placeholder="e.g. Roads & Transport"
                  value={name} onChange={e => setName(e.target.value)}
                />
              </div>

              <button
                type="submit" disabled={formLoading}
                className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm shadow-md bg-indigo-600 hover:bg-indigo-700 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${formLoading ? 'opacity-70' : 'hover:-translate-y-0.5'}`}
              >
                {formLoading ? "Creating..." : "Create Department"}
              </button>
            </form>
          </div>

          {/* Departments Table */}
          <div className="lg:col-span-2 border border-gray-100 bg-white rounded-3xl shadow-xl shadow-gray-200/40 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Active Departments</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {departments.length} Total
              </span>
            </div>
            
            <div className="p-0 overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-gray-500 font-medium">Loading departments...</div>
              ) : error ? (
                <div className="p-12 text-center text-red-500 font-medium">{error}</div>
              ) : departments.length === 0 ? (
                <div className="p-12 text-center text-gray-500 font-medium">No departments found.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Department Name</th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Internal ID</th>
                      <th className="px-8 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {departments.map((dept) => (
                      <tr key={dept._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-4 whitespace-nowrap text-sm font-bold text-gray-900 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                          {dept.name}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">
                          {dept._id}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-400 text-right">
                          {dept.createdAt ? new Date(dept.createdAt).toLocaleDateString() : 'N/A'}
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
            <div className="lg:col-span-1 border border-gray-100 bg-white rounded-3xl shadow-xl shadow-gray-200/40 p-8 h-fit">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-md">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Deploy Admin</h2>
              </div>
              
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                {adminRegError && <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-bold">{adminRegError}</div>}
                {adminRegSuccess && <div className="bg-green-50 text-green-700 p-3 rounded-xl text-xs font-bold">Admin credentials provisioned!</div>}

                 <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
                  <input type="text" required value={adminName} onChange={e => setAdminName(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
                 </div>
                 <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email</label>
                  <input type="email" required value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="admin@city.gov" />
                 </div>
                 <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Password</label>
                  <input type="password" required value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />
                 </div>
                 <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Assign Department</label>
                  <select required value={adminDeptId} onChange={e => setAdminDeptId(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                    <option value="" disabled>Select Department...</option>
                    {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                 </div>

                <button type="submit" disabled={adminRegistering} className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm bg-indigo-600 hover:bg-indigo-700 transition-all disabled:opacity-50 mt-2">
                  {adminRegistering ? "Provisioning..." : "Assign Dept Admin"}
                </button>
              </form>
            </div>

            {/* Users Roster Table */}
            <div className="lg:col-span-2 border border-gray-100 bg-white rounded-3xl shadow-xl shadow-gray-200/40 overflow-hidden">
               <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                 <h2 className="text-xl font-bold text-gray-900">System Roster</h2>
               </div>
               
               <div className="p-0 overflow-x-auto">
                 {usersLoading ? <div className="p-8 text-center text-gray-500 text-sm font-medium">Loading personnel...</div> : (
                   <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                       <tr>
                         <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                         <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                         <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Department Unit</th>
                       </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-100">
                        {users.map(u => (
                          <tr key={u._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm">
                               <div className="font-bold text-gray-900">{u.name}</div>
                               <div className="text-gray-500">{u.email}</div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                               <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold border ${u.role === 'SuperAdmin' ? 'bg-slate-900 text-white border-slate-900' : u.role === 'Department Admin' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                 {u.role}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-600">
                               {u.departmentId ? u.departmentId.name : <span className="text-gray-400 italic">Global / None</span>}
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
