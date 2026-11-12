import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const DEFAULT_LAT = 19.0760;   // Mumbai
const DEFAULT_LNG = 72.8777;

export default function PropertyMap({ lat, lng, title, address }) {
  const position = [lat || DEFAULT_LAT, lng || DEFAULT_LNG];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
        <span>📍</span>
        <span>{address || 'Location shown approximately'}</span>
      </div>
      <div className="rounded-2xl overflow-hidden border border-gray-200" style={{ height: 380 }}>
        <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={position}>
            <Popup>
              <div className="font-medium text-sm">{title}</div>
              <div className="text-xs text-gray-500 mt-1">{address}</div>
            </Popup>
          </Marker>
          <Circle center={position} radius={300} pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.1 }} />
        </MapContainer>
      </div>
      <p className="text-xs text-gray-400 text-center">Exact location shared after booking confirmation</p>
    </div>
  );
}
