export default function WellPopup({ marker }) {
  return (
    <div className="px-3.5 py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold tracking-wide">{marker.id}</span>
        {marker.isCurrent ? (
          <span
            className="wl-chip"
            style={{
              color: "#C95D0B",
              borderColor: "rgba(201,93,11,0.4)",
              backgroundColor: "#FFF1E6",
            }}
          >
            Current
          </span>
        ) : (
          <span className="text-[10px] uppercase tracking-wider text-wl-text-muted">
            Offset
          </span>
        )}
      </div>
      <div className="mt-2 space-y-1 text-[11.5px]">
        <PopupRow
          label="Distance"
          value={marker.isCurrent ? "-" : `${marker.distanceKm.toFixed(1)} km`}
        />
        <PopupRow label="Formation" value={marker.formation} />
        <PopupRow
          label="Historical Events"
          value={marker.isCurrent ? "-" : String(marker.events)}
        />
        <PopupRow
          label="Similarity"
          value={marker.similarity == null ? "-" : `${marker.similarity}%`}
        />
      </div>
    </div>
  );
}

function PopupRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-wl-text-muted">{label}</span>
      <span className="tabular font-mono text-wl-text-primary">{value}</span>
    </div>
  );
}
