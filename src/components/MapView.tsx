import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, ZoomControl } from 'react-leaflet';
import { store } from '../config/store';

// Logo disc on a short blue stem, anchored at the stem's tip.
const marker = L.divIcon({
  className: 'hm-marker',
  html: '<span class="hm-marker__disc"><img src="/logo-96.webp" alt="" width="44" height="44"></span><span class="hm-marker__stem"></span>',
  iconSize: [52, 66],
  iconAnchor: [26, 66],
});

// Touch screens: one finger scrolls the page, two fingers move/zoom the map.
const touch = matchMedia('(pointer: coarse)').matches;

export default function MapView() {
  return (
    <MapContainer center={store.coords} zoom={15} scrollWheelZoom={false} dragging={!touch} zoomControl={false}
      className="absolute inset-0 z-0 h-full w-full bg-blue-tint">
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <ZoomControl position="bottomright" />
      <Marker position={store.coords} icon={marker} title={store.name} alt={store.name} />
    </MapContainer>
  );
}
