import { useEffect, useMemo } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Map as MapIcon } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import {
  getComparableEntry,
  getEventsForWell,
  getWell,
} from "../../data/mockData.js";

const SEVERITY_COLOR = {
  High: "#c84435",
  Medium: "#b97800",
  Low: "#3f7d55",
};

function dotIcon(color, size = 13) {
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid #ffffff;box-shadow:0 1px 4px rgba(23,32,29,0.35);"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 2],
  });
}

function labeledIcon(id, color, textColor = "#ffffff") {
  return L.divIcon({
    className: "",
    html: `<div style="width:38px;height:24px;border-radius:4px;border:1.5px solid ${color};background:${color};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(23,32,29,0.3);"><span style="font:600 10px 'IBM Plex Sans',sans-serif;color:${textColor};letter-spacing:0.04em;">${id}</span></div>`,
    iconSize: [38, 24],
    iconAnchor: [19, 12],
    popupAnchor: [0, -12],
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

export default function MapView({ activeWellId, visibleWells, selectedWellId, onSelect, filters }) {
  const current = getWell(activeWellId);

  const eventMarkers = useMemo(() => {
    if (!filters.layers.events) return [];
    const markers = [];
    for (const c of visibleWells) {
      const w = getWell(c.wellId);
      if (!w) continue;
      for (const e of getEventsForWell(c.wellId)) {
        if (filters.event !== "all" && e.eventType !== filters.event) continue;
        // Offset the event marker slightly from the well so both are visible.
        const jitter = (e.depth % 40) / 10000;
        markers.push({
          id: e.id,
          wellId: c.wellId,
          coords: [w.coordinates[0] + jitter, w.coordinates[1] - jitter],
          event: e,
        });
      }
    }
    return markers;
  }, [visibleWells, filters.layers.events, filters.event]);

  const positions = useMemo(() => {
    if (!current) return [];
    return [current.coordinates, ...visibleWells.map((c) => getWell(c.wellId)?.coordinates).filter(Boolean)];
  }, [current, visibleWells]);

  if (!current) return null;

  return (
    <section className="wl-card flex flex-col overflow-hidden">
      <SectionHeader
        icon={MapIcon}
        title="Operational Map"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            {visibleWells.length} wells within {filters.radius} km
            {filters.layers.density ? " · density layer on" : ""}
          </span>
        }
      />
      <div className="h-[460px] w-full">
        <MapContainer
          center={current.coordinates}
          zoom={12}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
            maxZoom={19}
          />

          {/* Radius ring */}
          <Circle
            center={current.coordinates}
            radius={filters.radius * 1000}
            pathOptions={{ color: "#E8751A", weight: 1, opacity: 0.35, fillOpacity: 0.03, dashArray: "4 6" }}
          />

          {/* Historical event density layer: restrained circles weighted by NPT */}
          {filters.layers.density &&
            visibleWells.map((c) => {
              const w = getWell(c.wellId);
              const events = getEventsForWell(c.wellId);
              const npt = events.reduce((s, e) => s + e.nptHours, 0);
              if (!npt) return null;
              return (
                <Circle
                  key={`density-${c.wellId}`}
                  center={w.coordinates}
                  radius={900 + npt * 140}
                  pathOptions={{
                    stroke: false,
                    fillColor: "#C84435",
                    fillOpacity: Math.min(0.06 + events.length * 0.045, 0.24),
                  }}
                />
              );
            })}

          {/* Comparable wells */}
          {filters.layers.wells &&
            visibleWells.map((c) => {
              const w = getWell(c.wellId);
              if (!w) return null;
              const isSelected = c.wellId === selectedWellId;
              const high = c.similarity >= 70;
              return (
                <Marker
                  key={c.wellId}
                  position={w.coordinates}
                  icon={
                    isSelected
                      ? labeledIcon(c.wellId, "#C95D0B")
                      : high
                        ? labeledIcon(c.wellId, "#56615D")
                        : dotIcon(isSelected ? "#C95D0B" : "#8b9591", 14)
                  }
                  eventHandlers={{ click: () => onSelect(c.wellId) }}
                >
                  <Popup className="wl-well-popup">
                    <WellPopupContent
                      marker={{
                        id: c.wellId,
                        distanceKm: c.distanceKm,
                        formation: c.formation,
                        similarity: c.similarity,
                        events: c.events,
                      }}
                      well={w}
                      onView={() => onSelect(c.wellId)}
                    />
                  </Popup>
                </Marker>
              );
            })}

          {/* Current well on top */}
          <Marker position={current.coordinates} icon={labeledIcon(current.id, "#E8751A")}>
            <Popup className="wl-well-popup">
              <WellPopupContent marker={{ id: current.id, isCurrent: true }} well={current} />
            </Popup>
          </Marker>

          {/* Historical events */}
          {eventMarkers.map((m) => (
            <Marker
              key={m.id}
              position={m.coords}
              icon={dotIcon(SEVERITY_COLOR[m.event.severity] ?? "#8b9591", 9)}
            >
              <Popup className="wl-well-popup">
                <EventPopupContent event={m.event} wellId={m.wellId} />
              </Popup>
            </Marker>
          ))}

          <FitBounds positions={positions} />
        </MapContainer>
      </div>
    </section>
  );
}

function WellPopupContent({ marker, well, onView }) {
  return (
    <div className="px-3.5 py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold tracking-wide">{marker.id}</span>
        {marker.isCurrent ? (
          <span
            className="wl-chip"
            style={{ color: "#C95D0B", borderColor: "rgba(201,93,11,0.4)", backgroundColor: "#FFF1E6" }}
          >
            Current
          </span>
        ) : (
          <span className="text-[10px] uppercase tracking-wider text-wl-text-muted">Offset</span>
        )}
      </div>
      <div className="mt-2 space-y-1 text-[11.5px]">
        <Row label="Depth" value={`${(well?.depth ?? 0).toLocaleString("en-IN")} m`} />
        <Row label="Formation" value={well?.formation ?? "-"} />
        <Row label="Status" value={well?.status ?? "-"} />
        {!marker.isCurrent && (
          <>
            <Row label="Distance" value={`${marker.distanceKm.toFixed(1)} km`} />
            <Row label="Similarity" value={`${marker.similarity}%`} />
            <Row label="Historical Events" value={String(marker.events)} />
          </>
        )}
      </div>
      {!marker.isCurrent && onView && (
        <button type="button" className="wl-btn mt-2.5 !py-1 !text-[10px]" onClick={onView}>
          Select Well
        </button>
      )}
    </div>
  );
}

function EventPopupContent({ event, wellId }) {
  return (
    <div className="px-3.5 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
        Historical Event
      </div>
      <div className="mt-0.5 text-[13px] font-semibold text-wl-text-primary">{event.eventType}</div>
      <div className="mt-2 space-y-1 text-[11.5px]">
        <Row label="Well" value={wellId} />
        <Row label="Depth" value={`${event.depth.toLocaleString("en-IN")} m`} />
        <Row label="Formation" value={event.formation} />
        <Row label="Severity" value={event.severity} />
        <Row label="NPT" value={`${event.nptHours.toFixed(1)} h`} />
        <Row label="Source" value={`${event.document} · p.${event.page}`} />
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-wl-text-muted">{label}</span>
      <span className="tabular font-mono text-wl-text-primary">{value}</span>
    </div>
  );
}
