import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Map as MapIcon } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import WellPopup from "./WellPopup.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import { getComparableWells, getWell } from "../../data/mockData.js";

function dotIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div style="width:13px;height:13px;border-radius:50%;background:${color};border:2px solid #0b0d0e;box-shadow:0 1px 6px rgba(0,0,0,0.6);"></div>`,
    iconSize: [13, 13],
    iconAnchor: [6.5, 6.5],
    popupAnchor: [0, -8],
  });
}

function currentWellIcon(id) {
  return L.divIcon({
    className: "",
    html: `<div style="width:36px;height:24px;border-radius:4px;border:1.5px solid #e06a5f;background:rgba(194,69,60,0.18);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,0.55);"><span style="font:600 10px 'IBM Plex Sans',sans-serif;color:#e8a49c;letter-spacing:0.04em;">${id}</span></div>`,
    iconSize: [36, 24],
    iconAnchor: [18, 12],
    popupAnchor: [0, -10],
  });
}

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 1) {
      map.fitBounds(L.latLngBounds(positions), { padding: [46, 46] });
    } else if (positions.length === 1) {
      map.setView(positions[0], 13);
    }
  }, [map, positions]);
  return null;
}

export default function NearbyWellsMap() {
  const { activeWellId } = useWellContext();

  const markers = useMemo(() => {
    const current = getWell(activeWellId);
    const comps = getComparableWells(activeWellId);
    if (!current) return [];

    const offsetMarkers = comps.map((c) => {
      const w = getWell(c.wellId);
      return {
        id: c.wellId,
        coords: w?.coordinates ?? current.coordinates,
        isCurrent: false,
        formation: c.formation,
        events: c.events,
        distanceKm: c.distanceKm,
        similarity: c.similarity,
      };
    });

    return [
      {
        id: current.id,
        coords: current.coordinates,
        isCurrent: true,
        formation: current.formation,
        events: null,
        distanceKm: null,
        similarity: null,
      },
      ...offsetMarkers,
    ];
  }, [activeWellId]);

  const positions = markers.map((m) => m.coords);

  return (
    <section className="wl-card flex flex-col overflow-hidden">
      <SectionHeader
        icon={MapIcon}
        title="Nearby Wells"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            Click a well for offset context
          </span>
        }
      />
      <div className="h-[380px] w-full">
        <MapContainer
          center={[26.78, 94.98]}
          zoom={12}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
            maxZoom={19}
          />
          {markers.map((m) => (
            <Marker
              key={m.id}
              position={m.coords}
              icon={m.isCurrent ? currentWellIcon(m.id) : dotIcon("#6d94b0")}
            >
              <Popup className="wl-well-popup">
                <WellPopup marker={m} />
              </Popup>
            </Marker>
          ))}
          <FitBounds positions={positions} />
        </MapContainer>
      </div>
    </section>
  );
}
