import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/client";
import { DashboardHeader } from "../../components/DashboardHeader";

export function ReportIssuePage() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [description, setDescription] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [findingLocation, setFindingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch departments to populate the "Category" dropdown
    async function loadDepartments() {
      try {
        const data = await apiFetch("/api/departments");
        setDepartments(data.departments || []);
      } catch (err) {
        console.error("Failed to load departments", err);
      }
    }
    loadDepartments();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setFindingLocation(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setFindingLocation(false);
      },
      (err) => {
        setLocationError("Unable to retrieve your location. " + err.message);
        setFindingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!base64Image) {
      setError("Please attach an image of the issue.");
      return;
    }
    if (!location.lat || !location.lng) {
      setError("Please capture the issue location.");
      return;
    }

    // Find the chosen department's name to act as the "category"
    const chosenDept = departments.find(d => d._id === departmentId);
    if (!chosenDept) {
      setError("Please select a valid category.");
      return;
    }

    setLoading(true);

    try {
      await apiFetch("/api/issues", {
        method: "POST",
        body: JSON.stringify({
          description,
          imageUrl: base64Image, // MVP: sending raw base64 string
          location: { lat: Number(location.lat), lng: Number(location.lng) },
          departmentId,
          category: chosenDept.name // Set category cleanly to the raw department name
        }),
      });

      // Redirect to citizen dashboard on success
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to submit issue report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col relative overflow-hidden">
      <DashboardHeader title="Civic Reporting Engine" />

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900 via-violet-900 to-slate-50 overflow-hidden -z-10">
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[100px] animate-pulse"></div>
         <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-500/20 blur-[100px] animate-pulse" style={{ animationDelay: '2s'}}></div>
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 pb-24 relative z-10">
        
        <header className="text-center mb-16 relative z-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-xl shadow-indigo-900/5 mb-6 border border-slate-100">
            <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight drop-shadow-sm">Lodge a Report</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Help us improve your neighborhood. Upload a photo, pick the right category, and tag the location to automatically dispatch the nearest civic worker.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-xl border border-white rounded-[2rem] shadow-2xl shadow-indigo-900/10 p-8 sm:p-12 relative z-10">
          
          {/* Subtle form glow */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none -z-10"></div>

          {error && (
            <div className="mb-8 bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-medium border border-red-100 flex items-center shadow-sm">
              <svg className="w-5 h-5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-8 relative z-10">
            {/* Category */}
            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Issue Category</label>
              <select
                required
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium appearance-none hover:border-slate-300 shadow-sm"
                value={departmentId}
                onChange={e => setDepartmentId(e.target.value)}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="" disabled>Select the most relevant department...</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Incident Description</label>
              <textarea
                required
                rows="4"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-indigo-500 focus:bg-white transition-all text-slate-900 resize-none hover:border-slate-300 shadow-sm leading-relaxed"
                placeholder="Please describe the issue in detail (e.g. A large pothole on Main St causing traffic slowdowns...)"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Photographic Proof</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                />
                
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className={`border-2 border-dashed rounded-[2rem] p-6 flex flex-col items-center justify-center cursor-pointer transition-all h-56 relative overflow-hidden group
                    ${base64Image ? 'border-indigo-500 bg-indigo-50 shadow-inner' : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-slate-100 shadow-sm'}`}
                >
                  {base64Image ? (
                     <>
                       <img src={base64Image} alt="Preview" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white/20 backdrop-blur-md text-white font-bold py-2 px-4 rounded-xl border border-white/30">Replace Image</span>
                       </div>
                     </>
                  ) : (
                    <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                       <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:shadow-md transition-all text-slate-400 group-hover:text-indigo-500 border border-slate-100">
                         <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                       </div>
                      <span className="text-base font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Tap to attach photo</span>
                      <p className="text-xs text-slate-500 mt-2 font-medium">JPEG, PNG, GIF up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Capture */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Exact Coordinates</label>
                
                <div className="bg-slate-50 border-2 border-slate-200 rounded-[2rem] p-6 flex flex-col items-center justify-center h-56 shadow-sm overflow-hidden relative">
                  {location.lat && location.lng ? (
                    <div className="text-center w-full z-10 animate-in zoom-in-95 duration-300">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full border-4 border-white shadow-md flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-base font-black text-slate-800">Target Locked</p>
                      <div className="mt-3 inline-flex items-center text-sm font-mono text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                        {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                      </div>
                      <button 
                        type="button" 
                        onClick={handleGetLocation}
                        className="mt-4 block w-full text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                      >
                       Recalibrate Coordinates
                      </button>
                    </div>
                  ) : (
                    <div className="text-center w-full">
                      <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-400">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={findingLocation}
                        className={`w-full py-3.5 px-6 bg-white border-2 border-slate-200 shadow-sm text-sm font-bold text-slate-700 rounded-2xl transition-all focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50
                          ${findingLocation ? 'animate-pulse bg-indigo-50 border-indigo-200 text-indigo-700' : 'hover:border-indigo-400 hover:text-indigo-600 hover:-translate-y-1 hover:shadow-md'}
                        `}
                      >
                        {findingLocation ? "Pinpointing Satellites..." : "Acquire GPS Coordinates"}
                      </button>
                      {locationError && <p className="text-xs font-medium text-red-500 mt-3 absolute bottom-2 left-0 right-0 text-center px-4">{locationError}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-8 mt-4 border-t border-slate-100">
               <button
                type="submit" disabled={loading}
                className={`w-full py-4.5 px-6 rounded-2xl text-white font-black text-lg tracking-wide shadow-xl shadow-indigo-500/30 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-wait' : 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/40'}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Transmitting...
                  </>
                ) : (
                  <>
                    Deploy Issue Report
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </>
                )}
              </button>
              <button
                type="button" onClick={() => navigate("/app")}
                className="w-full mt-4 py-3 px-6 rounded-2xl text-slate-500 font-bold text-sm tracking-wide hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                Cancel and return to Dashboard
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
