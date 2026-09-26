// Wellora frontend service layer.
//
// This module is the future integration point with the NWIS backend
// (FastAPI + PostgreSQL). Components receive data through these functions so
// they can be switched from representative mock data to live endpoints without
// touching JSX. No live API calls are made in the prototype.

import {
  drillingParameters as mockParameters,
  drillingParametersFallback,
  drillingTrends as mockTrends,
  drillingTrendsFallback,
  formationContext,
  getComparableWells as getComparableWellsFromData,
  getEventsForWell as getEventsForWellFromData,
  getRiskAlerts as getRiskAlertsFromData,
  getWell as getWellFromData,
  wells as mockWells,
} from "../data/mockData.js";

// Future backend endpoints (for reference, intentionally unused for now):
//
//   GET /api/wells
//   GET /api/wells/{well_id}
//   GET /api/wells/{well_id}/nearby
//   GET /api/wells/{well_id}/events
//   GET /api/wells/{well_id}/parameters
//   GET /api/wells/{well_id}/risk
//   GET /api/wells/{well_id}/evidence

const ENDPOINTS = {
  wells: "/api/wells",
  well: (wellId) => `/api/wells/${wellId}`,
  nearby: (wellId) => `/api/wells/${wellId}/nearby`,
  events: (wellId) => `/api/wells/${wellId}/events`,
  parameters: (wellId) => `/api/wells/${wellId}/parameters`,
  risk: (wellId) => `/api/wells/${wellId}/risk`,
  evidence: (wellId) => `/api/wells/${wellId}/evidence`,
};

export async function fetchWells() {
  return mockWells;
}

export async function fetchWell(wellId) {
  return getWellFromData(wellId) ?? null;
}

export async function fetchNearbyWells(wellId) {
  return getComparableWellsFromData(wellId);
}

export async function fetchEvents(wellId) {
  return wellId ? getEventsForWellFromData(wellId) : getEventsForWellFromData(null);
}

export async function fetchParameters(wellId) {
  return mockParameters[wellId] ?? drillingParametersFallback;
}

export async function fetchTrends(wellId) {
  return mockTrends[wellId] ?? drillingTrendsFallback;
}

export async function fetchRiskAlerts(wellId) {
  return getRiskAlertsFromData(wellId);
}

export async function fetchFormationContext(wellId) {
  return formationContext;
}

export { ENDPOINTS };
