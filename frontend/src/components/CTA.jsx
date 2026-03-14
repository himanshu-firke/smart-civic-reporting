import React from "react";
import { Link } from "react-router-dom";

export function CTA() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-3xl p-10 sm:p-16 text-center shadow-2xl relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3"></div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 relative z-10">
            Start improving your city today
          </h2>
          <p className="text-indigo-100 text-lg sm:text-xl mb-10 max-w-2xl mx-auto relative z-10">
            Join thousands of citizens and government officials working together to build cleaner and safer neighborhoods.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-100 transition-colors"
            >
              Create Account
            </Link>
            <Link
               to="/login"
               className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/10 transition-colors"
            >
              Log In to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
