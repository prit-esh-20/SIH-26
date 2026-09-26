export function WelloraLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <WelloraGlyph />
      {!compact && (
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-[0.08em] text-wl-text-primary">
            WELLORA
          </div>
          <div className="text-[9px] font-medium uppercase tracking-[0.14em] text-wl-text-muted">
            Nearby Wells Intelligence
          </div>
        </div>
      )}
    </div>
  );
}

export function WelloraGlyph({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-label="Wellora mark"
      role="img"
    >
      <rect width="28" height="28" rx="5" fill="#16191B" />
      <rect x="0.5" y="0.5" width="27" height="27" rx="4.5" stroke="#31383C" />
      <path
        d="M6.5 4.5v3.6c0 1 .6 1.9 1.5 2.3l1.6.7c1 .4 1.6 1.4 1.5 2.5L9.9 23.5"
        stroke="#C2453C"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M17 4.5v5.6c0 1 .6 1.9 1.5 2.3l1.6.7c1 .4 1.6 1.4 1.5 2.5l-1.2 7.9"
        stroke="#C2453C"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M3 8h22M3 12.5h22M3 17h22M3 21.5h22"
        stroke="#4A5257"
        strokeWidth="0.7"
        opacity="0.55"
      />
    </svg>
  );
}
