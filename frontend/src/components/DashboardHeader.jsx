import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getAuth } from "../auth/authStorage";

export function DashboardHeader({ title, children }) {
  const navigate = useNavigate();
  const auth = getAuth();

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2zm0 2.8l7 7h-2v6h-4v-6H11v6H7v-6H5l7-7z"/>
              </svg>
              <span className="font-black text-xl tracking-tight hidden sm:block">Civic System</span>
            </Link>
            
            {title && (
              <>
                <span className="text-gray-300">|</span>
                <h1 className="text-lg font-bold text-gray-800">{title}</h1>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {children}
            
            <div className="hidden sm:flex flex-col items-end mr-4 border-r border-gray-200 pr-4">
              <span className="text-sm font-bold text-gray-900 leading-tight">
                {auth?.role || "User"}
              </span>
              <span className="text-xs text-green-600 font-medium tracking-wide">
                ● Online
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              <svg className="mr-2 -ml-1 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
