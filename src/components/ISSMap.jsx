import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useISS } from '../context/ISSContext';
import { useTheme } from '../context/ThemeContext';
import 'leaflet/dist/leaflet.css';

// Custom ISS icon
const issIcon = L.divIcon({
  className: 'iss-marker',
  html: `<div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" stroke-width="1"/>
      <circle cx="20" cy="20" r="10" fill="rgba(99,102,241,0.3)" stroke="rgba(129,140,248,0.6)" stroke-width="1.5"/>
      <circle cx="20" cy="20" r="4" fill="#818cf8"/>
      <circle cx="20" cy="20" r="2" fill="white"/>
    </svg>
  </div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -22],
});

// Component to animate map to new position
function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], map.getZoom(), {
        animate: true,
        duration: 1.5,
      });
    }
  }, [position, map]);

  return null;
}

export default function ISSMap() {
  const { position, positions, locationName } = useISS();
  const { isDark } = useTheme();
  const mapRef = useRef(null);

  const trajectoryPoints = useMemo(() => {
    if (positions.length < 2) return [];

    // Split trajectory if there's a large longitude gap (crossing date line)
    const segments = [];
    let currentSegment = [[positions[0].lat, positions[0].lng]];

    for (let i = 1; i < positions.length; i++) {
      const lngDiff = Math.abs(positions[i].lng - positions[i - 1].lng);
      if (lngDiff > 180) {
        segments.push(currentSegment);
        currentSegment = [];
      }
      currentSegment.push([positions[i].lat, positions[i].lng]);
    }
    segments.push(currentSegment);

    return segments;
  }, [positions]);

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const center = position ? [position.lat, position.lng] : [0, 0];

  return (
    <div className={`rounded-2xl overflow-hidden border ${
      isDark ? 'border-white/[0.06]' : 'border-gray-200'
    }`}>
      <MapContainer
        center={center}
        zoom={3}
        minZoom={2}
        maxZoom={10}
        scrollWheelZoom={true}
        className="h-[500px] w-full"
        ref={mapRef}
        worldCopyJump={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url={tileUrl}
        />

        {position && (
          <>
            <MapUpdater position={position} />
            <Marker position={[position.lat, position.lng]} icon={issIcon}>
              <Popup>
                <div className="text-center p-1">
                  <p className="font-bold text-sm mb-1">🛰️ ISS</p>
                  <p className="text-xs">Lat: {position.lat.toFixed(4)}</p>
                  <p className="text-xs">Lng: {position.lng.toFixed(4)}</p>
                  <p className="text-xs mt-1 font-medium">{locationName}</p>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {trajectoryPoints.map((segment, index) => (
          <Polyline
            key={index}
            positions={segment}
            pathOptions={{
              color: '#6366f1',
              weight: 2.5,
              opacity: 0.7,
              dashArray: '8 4',
              lineCap: 'round',
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
