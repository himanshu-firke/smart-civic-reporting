import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to center the map when lat/lng change
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function IssueMarkerMap({ lat, lng, popupText = "Issue Location", height = "300px" }) {
  if (!lat || !lng) return <div className="bg-gray-100 flex items-center justify-center text-gray-400 font-medium" style={{ height }}>No location data available</div>;

  const position = [lat, lng];

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm z-0 relative" style={{ height }}>
      <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
        <ChangeView center={position} zoom={15} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>{popupText}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
