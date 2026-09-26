// Wellora representative dataset. SINGLE SOURCE OF TRUTH for the dashboard.
// All values are internally consistent and representative only.
// They do not represent actual Oil India Limited operational data.
//
// Data flow: every dashboard component reads wells / historicalEvents /
// comparableWells / riskAlerts / drillingParameters / drillingTrends from
// this module, either directly or through the look-up helpers at the bottom.
// Do not hard-code event or well values inside JSX components.

// ---------------------------------------------------------------------------
// Wells
// ---------------------------------------------------------------------------

export const wells = [
  {
    id: "W-205",
    status: "Drilling",
    depth: 2860,
    plannedTd: 3200,
    formation: "F3",
    holeSection: '8-1/2"',
    location: "Representative block, Field A",
    coordinates: [26.7812, 94.9824],
    lastUpdate: "14:32:18",
    rig: "Rig 7",
    spudDate: "2026-08-02",
  },
  {
    id: "W-201",
    status: "Suspended",
    depth: 2980,
    plannedTd: 3100,
    formation: "F3",
    holeSection: '8-1/2"',
    location: "Representative block, Field A",
    coordinates: [26.7962, 94.9942],
    lastUpdate: "11:05:40",
    rig: "Rig 4",
    spudDate: "2026-05-19",
  },
  {
    id: "W-198",
    status: "Completed",
    depth: 3040,
    plannedTd: 3040,
    formation: "F3",
    holeSection: '7"',
    location: "Representative block, Field A",
    coordinates: [26.7689, 95.0087],
    lastUpdate: "09:47:03",
    rig: "Rig 2",
    spudDate: "2026-03-08",
  },
  {
    id: "W-187",
    status: "Plug and Abandon",
    depth: 3120,
    plannedTd: 3120,
    formation: "F4",
    holeSection: '7"',
    location: "Representative block, Field A",
    coordinates: [26.7547, 94.9683],
    lastUpdate: "17:22:55",
    rig: "Rig 5",
    spudDate: "2025-11-14",
  },
  {
    id: "W-176",
    status: "Completed",
    depth: 2905,
    plannedTd: 2905,
    formation: "F3",
    holeSection: '8-1/2"',
    location: "Representative block, Field A",
    coordinates: [26.8034, 94.9715],
    lastUpdate: "16:12:09",
    rig: "Rig 3",
    spudDate: "2025-09-30",
  },
  {
    id: "W-163",
    status: "Completed",
    depth: 3185,
    plannedTd: 3185,
    formation: "F4",
    holeSection: '7"',
    location: "Representative block, Field A",
    coordinates: [26.7602, 95.0261],
    lastUpdate: "13:58:31",
    rig: "Rig 1",
    spudDate: "2025-07-22",
  },
];

// ---------------------------------------------------------------------------
// Formations: depth intervals representative for this block
// ---------------------------------------------------------------------------

export const formations = {
  F1: { interval: [1600, 1950], lithology: "Sandstone with shale breaks" },
  F2: { interval: [1950, 2400], lithology: "Interbedded sand and shale" },
  F3: { interval: [2740, 3120], lithology: "Friable sand, depleted zone" },
  F4: { interval: [3120, 3420], lithology: "Shale with sand streaks" },
  F5: { interval: [3420, 3720], lithology: "Compact sand" },
};

// ---------------------------------------------------------------------------
// Drilling parameters: current snapshot per well
// ---------------------------------------------------------------------------

export const drillingParameters = {
  "W-205": [
    { key: "depth", label: "Depth", value: 2860, unit: "m" },
    { key: "rop", label: "ROP", value: 15.2, unit: "m/hr" },
    { key: "wob", label: "WOB", value: 8.4, unit: "klb" },
    { key: "rpm", label: "RPM", value: 120, unit: "rpm" },
    { key: "torque", label: "Torque", value: 13.4, unit: "kNm" },
    { key: "mudWeight", label: "Mud Weight", value: 1.21, unit: "SG" },
    { key: "flowRate", label: "Flow Rate", value: 480, unit: "L/min" },
    { key: "standpipe", label: "Pressure", value: 2850, unit: "psi" },
    { key: "temperature", label: "Temperature", value: 78, unit: "deg C" },
  ],
  "W-201": [
    { key: "depth", label: "Depth", value: 2980, unit: "m" },
    { key: "rop", label: "ROP", value: 11.6, unit: "m/hr" },
    { key: "wob", label: "WOB", value: 9.1, unit: "klb" },
    { key: "rpm", label: "RPM", value: 110, unit: "rpm" },
    { key: "torque", label: "Torque", value: 15.8, unit: "kNm" },
    { key: "mudWeight", label: "Mud Weight", value: 1.19, unit: "SG" },
    { key: "flowRate", label: "Flow Rate", value: 450, unit: "L/min" },
    { key: "standpipe", label: "Pressure", value: 2980, unit: "psi" },
    { key: "temperature", label: "Temperature", value: 82, unit: "deg C" },
  ],
  "W-198": [
    { key: "depth", label: "Depth", value: 3040, unit: "m" },
    { key: "rop", label: "ROP", value: 9.8, unit: "m/hr" },
    { key: "wob", label: "WOB", value: 9.6, unit: "klb" },
    { key: "rpm", label: "RPM", value: 105, unit: "rpm" },
    { key: "torque", label: "Torque", value: 16.5, unit: "kNm" },
    { key: "mudWeight", label: "Mud Weight", value: 1.24, unit: "SG" },
    { key: "flowRate", label: "Flow Rate", value: 430, unit: "L/min" },
    { key: "standpipe", label: "Pressure", value: 3100, unit: "psi" },
    { key: "temperature", label: "Temperature", value: 85, unit: "deg C" },
  ],
};

export const drillingParametersFallback = drillingParameters["W-205"];

// ---------------------------------------------------------------------------
// Drilling trend data: depth-indexed series for the charts.
// Representative, depth-correlated profiles for W-205's 8-1/2" section.
// ---------------------------------------------------------------------------

export const drillingTrends = {
  "W-205": [
    { depth: 2740, torque: 11.8, rop: 17.8, pressure: 2740 },
    { depth: 2755, torque: 11.9, rop: 17.4, pressure: 2756 },
    { depth: 2770, torque: 12.1, rop: 17.1, pressure: 2771 },
    { depth: 2785, torque: 12.2, rop: 16.6, pressure: 2786 },
    { depth: 2800, torque: 12.4, rop: 16.2, pressure: 2801 },
    { depth: 2815, torque: 12.6, rop: 16.1, pressure: 2817 },
    { depth: 2830, torque: 12.9, rop: 15.7, pressure: 2831 },
    { depth: 2845, torque: 13.1, rop: 15.3, pressure: 2845 },
    { depth: 2860, torque: 13.4, rop: 15.2, pressure: 2850 },
  ],
};

export const drillingTrendsFallback = drillingTrends["W-205"];

// ---------------------------------------------------------------------------
// Comparable wells: offsets relevant to the current well W-205.
// similarity is a representative combined index (geographic, geological,
// depth, operational and event similarity). Not a live algorithm output.
// events is derived from historicalEvents below (see comparableEventsFor).
// ---------------------------------------------------------------------------

// Base offsets for W-205. Event counts are recomputed from the dataset at the
// bottom of this file, so they always match historicalEvents.
const comparableWellsBase = [
  { wellId: "W-201", distanceKm: 1.8, formation: "F3", similarity: 87 },
  { wellId: "W-198", distanceKm: 3.2, formation: "F3", similarity: 81 },
  { wellId: "W-187", distanceKm: 4.7, formation: "F3", similarity: 72 },
  { wellId: "W-176", distanceKm: 2.6, formation: "F3", similarity: 64 },
  { wellId: "W-163", distanceKm: 5.9, formation: "F4", similarity: 31 },
];

// ---------------------------------------------------------------------------
// Historical events. Every event references an existing well and a document.
// These records are the single source used by the risk card, depth view,
// historical events table, evidence panel and formation context.
// ---------------------------------------------------------------------------

export const historicalEvents = [
  {
    id: "EV-001",
    wellId: "W-201",
    depth: 2875,
    eventType: "Mud Loss",
    formation: "F3",
    severity: "High",
    nptHours: 8.5,
    mitigation: "LCM treatment",
    outcome: "Operation resumed after mitigation",
    document: "DDR-W201",
    page: 37,
    date: "2026-06-02",
  },
  {
    id: "EV-002",
    wellId: "W-198",
    depth: 2892,
    eventType: "Mud Loss",
    formation: "F3",
    severity: "Medium",
    nptHours: 4.2,
    mitigation: "Reduced circulation rate + LCM",
    outcome: "Losses controlled within one circulation",
    document: "WCR-W198",
    page: 112,
    date: "2026-03-21",
  },
  {
    id: "EV-003",
    wellId: "W-187",
    depth: 2910,
    eventType: "Stuck Pipe",
    formation: "F3",
    severity: "High",
    nptHours: 12.0,
    mitigation: "Pipe-freeing pill + back-off precaution",
    outcome: "String freed after 2 attempts",
    document: "DDR-W187",
    page: 58,
    date: "2025-12-09",
  },
  {
    id: "EV-005",
    wellId: "W-187",
    depth: 2884,
    eventType: "Tight Hole",
    formation: "F3",
    severity: "Low",
    nptHours: 1.5,
    mitigation: "Reaming and increased mud weight",
    outcome: "Hole condition normalised",
    document: "DDR-W187",
    page: 52,
    date: "2025-12-07",
  },
  {
    id: "EV-006",
    wellId: "W-198",
    depth: 2955,
    eventType: "Kick",
    formation: "F3",
    severity: "High",
    nptHours: 9.8,
    mitigation: "Well kill, flow check, barrier reinstated",
    outcome: "Well secured, drilling resumed",
    document: "DDR-W198",
    page: 87,
    date: "2026-03-28",
  },
  {
    id: "EV-007",
    wellId: "W-176",
    depth: 2836,
    eventType: "Mud Loss",
    formation: "F3",
    severity: "Low",
    nptHours: 2.1,
    mitigation: "LCM treatment",
    outcome: "Seepage loss stopped",
    document: "DDR-W176",
    page: 24,
    date: "2025-10-11",
  },
  {
    id: "EV-008",
    wellId: "W-187",
    depth: 3020,
    eventType: "Stuck Pipe",
    formation: "F3",
    severity: "Medium",
    nptHours: 6.4,
    mitigation: "Jarring and spotting free-off pill",
    outcome: "String freed",
    document: "WCR-W187",
    page: 133,
    date: "2025-12-19",
  },
  {
    id: "EV-009",
    wellId: "W-201",
    depth: 2965,
    eventType: "Kick",
    formation: "F3",
    severity: "Medium",
    nptHours: 5.2,
    mitigation: "Shut-in, kill mud circulated",
    outcome: "Well secured, drilling resumed",
    document: "DDR-W201",
    page: 66,
    date: "2026-06-11",
  },
  {
    id: "EV-012",
    wellId: "W-198",
    depth: 2810,
    eventType: "Tight Hole",
    formation: "F3",
    severity: "Low",
    nptHours: 1.2,
    mitigation: "Reaming while circulating",
    outcome: "Hole condition normalised",
    document: "DDR-W198",
    page: 64,
    date: "2026-03-18",
  },
  {
    id: "EV-013",
    wellId: "W-187",
    depth: 2868,
    eventType: "Mud Loss",
    formation: "F3",
    severity: "Medium",
    nptHours: 5.1,
    mitigation: "Reduced circulation rate + LCM",
    outcome: "Losses controlled after treatment",
    document: "DDR-W187",
    page: 55,
    date: "2025-12-08",
  },
  {
    id: "EV-010",
    wellId: "W-163",
    depth: 3495,
    eventType: "Bit Balling",
    formation: "F5",
    severity: "Low",
    nptHours: 1.8,
    mitigation: "Rope-dart cleanup, ROP reduction",
    outcome: "Drilling continued",
    document: "DDR-W163",
    page: 45,
    date: "2025-08-04",
  },
  {
    id: "EV-011",
    wellId: "W-163",
    depth: 3560,
    eventType: "Mud Loss",
    formation: "F5",
    severity: "Medium",
    nptHours: 4.9,
    mitigation: "LCM treatment + reduced circulation rate",
    outcome: "Losses controlled",
    document: "DDR-W163",
    page: 49,
    date: "2025-08-09",
  },
];

// ---------------------------------------------------------------------------
// Risk alerts. Interval, distance, comparable wells, evidence and the
// explanation basis are all expressed in terms of the records above so the
// risk card, depth view, evidence panel and events table can never disagree.
// ---------------------------------------------------------------------------

const W205 = wells.find((w) => w.id === "W-205");
const W205_MUD_WEIGHT = drillingParameters["W-205"].find((p) => p.key === "mudWeight").value;

// Active alert: high mud-loss risk ahead of the current F3 bit depth.
const RA1_INTERVAL = [2870, 2900];
const RA1_DISTANCE = RA1_INTERVAL[0] - W205.depth; // 10 m

const f3MudLossEvents = historicalEvents.filter(
  (e) => e.formation === "F3" && e.eventType === "Mud Loss"
);
const f3StuckPipeEvents = historicalEvents.filter(
  (e) => e.formation === "F3" && e.eventType === "Stuck Pipe"
);

// Secondary alert: stuck-pipe risk deeper in the same F3 interval.
const RA2_INTERVAL = [2905, 2915];
const RA2_DISTANCE = RA2_INTERVAL[0] - W205.depth; // 45 m

export const riskAlerts = {
  "W-205": [
    {
      id: "RA-205-1",
      riskType: "Mud Loss",
      riskScore: 0.82,
      confidence: 0.82,
      severity: "High",
      currentDepth: W205.depth,
      riskInterval: RA1_INTERVAL,
      distanceToRiskM: RA1_DISTANCE,
      comparableWells: ["W-201", "W-198", "W-187"],
      // Each evidence entry must resolve to a historicalEvents record via
      // getAlertEvidence() below.
      evidence: [
        { wellId: "W-201", eventType: "Mud Loss", depth: 2875, document: "DDR-W201", page: 37 },
        { wellId: "W-198", eventType: "Mud Loss", depth: 2892, document: "WCR-W198", page: 112 },
        { wellId: "W-187", eventType: "Mud Loss", depth: 2868, document: "DDR-W187", page: 55 },
      ],
      mitigation: [
        { wellId: "W-201", action: "LCM treatment" },
        { wellId: "W-198", action: "Reduced circulation rate + LCM" },
        { wellId: "W-187", action: "Mud-property adjustment" },
      ],
      basis: [
        {
          label: "Formation similarity",
          present: true,
          detail: `F3 matches all ${3} comparable wells`,
        },
        {
          label: "Depth approaching historical event zone",
          present: true,
          detail: `${RA1_DISTANCE} m to ${RA1_INTERVAL[0].toLocaleString("en-IN")} m`,
        },
        {
          label: "Mud-weight similarity",
          present: true,
          detail: `${W205_MUD_WEIGHT.toFixed(2)} SG, comparable to incident wells`,
        },
        {
          label: "Operational similarity",
          present: true,
          detail: `${W205.holeSection} section, same BHA family`,
        },
        {
          label: "Historical mud-loss events",
          present: true,
          detail: `${f3MudLossEvents.length} mud-loss events recorded in F3 across comparable wells`,
        },
      ],
    },
    {
      id: "RA-205-2",
      riskType: "Stuck Pipe",
      riskScore: 0.54,
      confidence: 0.61,
      severity: "Medium",
      currentDepth: W205.depth,
      riskInterval: RA2_INTERVAL,
      distanceToRiskM: RA2_DISTANCE,
      comparableWells: ["W-187"],
      evidence: [
        { wellId: "W-187", eventType: "Stuck Pipe", depth: 2910, document: "DDR-W187", page: 58 },
      ],
      mitigation: [{ wellId: "W-187", action: "Pipe-freeing pill + back-off precaution" }],
      basis: [
        {
          label: "Formation similarity",
          present: true,
          detail: "F3 sand interval",
        },
        {
          label: "Depth approaching historical event zone",
          present: true,
          detail: `${RA2_DISTANCE} m to ${RA2_INTERVAL[0].toLocaleString("en-IN")} m`,
        },
        {
          label: "Mud-weight similarity",
          present: false,
          detail: "Incident run used 1.18 SG",
        },
        {
          label: "Historical stuck-pipe events",
          present: true,
          detail: `${f3StuckPipeEvents.length} stuck-pipe event in F3 at ${f3StuckPipeEvents[0]?.depth.toLocaleString("en-IN")} m`,
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Documents referenced by events
// ---------------------------------------------------------------------------

export const documents = [
  { id: "DDR-W201", type: "Daily Drilling Report", well: "W-201" },
  { id: "WCR-W198", type: "Well Completion Report", well: "W-198" },
  { id: "DDR-W187", type: "Daily Drilling Report", well: "W-187" },
  { id: "WCR-W187", type: "Well Completion Report", well: "W-187" },
  { id: "DDR-W198", type: "Daily Drilling Report", well: "W-198" },
  { id: "DDR-W176", type: "Daily Drilling Report", well: "W-176" },
  { id: "DDR-W163", type: "Daily Drilling Report", well: "W-163" },
];

// ---------------------------------------------------------------------------
// Derived collections (kept in sync with the records above automatically)
// ---------------------------------------------------------------------------

// Comparable wells for the current well, with event counts derived from
// historicalEvents so the table, map and popups always agree.
export const comparableWells = comparableWellsBase.map((c) => ({
  ...c,
  events: historicalEvents.filter((e) => e.wellId === c.wellId).length,
}));

// ---------------------------------------------------------------------------
// Look-up helpers
// ---------------------------------------------------------------------------

export function getWell(wellId) {
  return wells.find((w) => w.id === wellId);
}

export function getEventsForWell(wellId) {
  return historicalEvents.filter((e) => e.wellId === wellId);
}

export function getComparableWells(wellId) {
  return comparableWells.filter((c) => c.wellId !== wellId);
}

export function getRiskAlerts(wellId) {
  return riskAlerts[wellId] ?? [];
}

// Resolves an alert's evidence references against historicalEvents and
// returns the full event records, so the evidence panel always shows the
// same object the events table shows.
export function getAlertEvidence(alert) {
  return alert.evidence
    .map((e) => ({
      ...e,
      event: historicalEvents.find(
        (ev) =>
          ev.wellId === e.wellId && ev.depth === e.depth && ev.eventType === e.eventType
      ),
    }))
    .filter((e) => e.event);
}

// Formation context, derived entirely from the dataset for the active well.
export function getFormationContext(wellId) {
  const well = getWell(wellId);
  const f = well ? formations[well.formation] : null;
  if (!well || !f) return null;

  const events = historicalEvents.filter((e) => e.formation === well.formation);
  const counts = {};
  for (const e of events) {
    counts[e.eventType] = (counts[e.eventType] ?? 0) + 1;
  }
  const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

  return {
    formation: well.formation,
    interval: f.interval,
    lithology: f.lithology,
    historicalWells: new Set(events.map((e) => e.wellId)).size,
    historicalEvents: events.length,
    mostCommonEvent: mostCommon,
  };
}
