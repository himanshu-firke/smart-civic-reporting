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
    <div className="min-h-screen bg-gray-50 font-sans">
      <DashboardHeader title="Report a Civic Issue" />

      <div className="p-8 max-w-4xl mx-auto space-y-8">
        
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Report an Issue</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Help us improve your neighborhood. Upload a photo, pick the right category, and tag the location to automatically assign the nearest civic worker.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/40 p-8 sm:p-12 overflow-hidden">
          {error && (
            <div className="mb-8 bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-8">
            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Issue Category</label>
              <select
                required
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-900 font-medium"
                value={departmentId}
                onChange={e => setDepartmentId(e.target.value)}
              >
                <option value="" disabled>Select the most relevant department category...</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                required
                rows="4"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-900 resize-none"
                placeholder="Please describe the issue in detail (e.g. A large pothole on Main St causing traffic slowdowns...)"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Attach Photo</label>
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
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all h-48
                    ${base64Image ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'}`}
                >
                  {base64Image ? (
                     <img src={base64Image} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                  ) : (
                    <div className="text-center">
                       <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-semibold text-indigo-600">Click to upload image</span>
                      <p className="text-xs text-gray-500 mt-1">JPEG, PNG, GIF up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Capture */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Exact Location</label>
                
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center h-48">
                  {location.lat && location.lng ? (
                    <div className="text-center w-full">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-gray-900">Location Acquired</p>
                      <div className="mt-2 inline-flex items-center text-xs font-mono text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                        {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                      </div>
                      <button 
                        type="button" 
                        onClick={handleGetLocation}
                        className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                       Retake Coordinates 
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={findingLocation}
                        className="px-6 py-2.5 bg-white border border-gray-200 shadow-sm text-sm font-bold text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {findingLocation ? "Detecting GPS..." : "Find My Location"}
                      </button>
                      {locationError && <p className="text-xs text-red-500 mt-3 max-w-xs">{locationError}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
               <button
                type="submit" disabled={loading}
                className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-xl shadow-indigo-500/30 bg-indigo-600 hover:bg-indigo-700 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-wait' : 'hover:-translate-y-1'}`}
              >
                {loading ? "Submitting Report..." : "Submit Issue Report"}
              </button>
              <button
                type="button" onClick={() => navigate("/app")}
                className="w-full mt-4 py-3 px-6 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
