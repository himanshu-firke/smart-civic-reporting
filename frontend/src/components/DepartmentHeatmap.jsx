import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapBoundsFitter({ issues }) {
  const map = useMap();

  useEffect(() => {
    if (!issues || issues.length === 0) return;
    
    // Extract lats and lngs
    const validIssues = issues.filter(i => i.location && i.location.lat && i.location.lng);
    if (validIssues.length === 0) return;

    const bounds = L.latLngBounds(validIssues.map(i => [i.location.lat, i.location.lng]));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [issues, map]);

  return null;
}

export function DepartmentHeatmap({ issues }) {
  // Use a default center if no issues exist (e.g. New York or India center, but let's just do [20, 78])
  const defaultCenter = [20.0, 78.0];

  const validIssues = useMemo(() => {
    return issues.filter(i => i.location && i.location.lat && i.location.lng);
  }, [issues]);

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm z-0 relative">
      <MapContainer center={defaultCenter} zoom={4} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validIssues.length > 0 && <MapBoundsFitter issues={validIssues} />}
        
        {validIssues.map(issue => (
          <Marker key={issue._id} position={[issue.location.lat, issue.location.lng]}>
             <Popup>
               <div className="font-sans">
                 <strong className="block mb-1 text-indigo-700">{issue.category}</strong>
                 <p className="text-sm text-gray-600 mb-2">{issue.description.substring(0, 50)}...</p>
                 <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                   Status: {issue.status}
                 </span>
               </div>
             </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
