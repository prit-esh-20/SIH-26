import { api, USE_MOCK, mockDelay } from "./api";
import { SCENARIOS, USERS } from "../utils/mockData";
import { simulateAttack, simulateCounterfactual } from "../utils/simulation";
import { nextSimulationId, addToHistory, getSimulationHistory } from "../utils/twinStore";

const clone = (data) => JSON.parse(JSON.stringify(data));

export async function getScenarios() {
  if (USE_MOCK) {
    await mockDelay(200);
    return clone(SCENARIOS);
  }
  const response = await api.get("/simulation/scenarios");
  return response.data;
}

export async function getSimulationUsers() {
  if (USE_MOCK) {
    await mockDelay(200);
    return clone(USERS);
  }
  const response = await api.get("/simulation/users");
  return response.data;
}

/**
 * Runs an attack simulation.
 * @param {object} config { scenarioId, userId, mfa, control }
 */
export async function runSimulation(config) {
  if (USE_MOCK) {
    await mockDelay(600);
    const result = simulateAttack({ ...config, simulationId: nextSimulationId() });
    addToHistory(result);
    return result;
  }
  const response = await api.post("/simulations", config);
  return response.data;
}

/**
 * Counterfactual: same attack, alternative control applied.
 * @param {object} config { scenarioId, userId, mfa, control, controlId }
 */
export async function runCounterfactual(config) {
  if (USE_MOCK) {
    await mockDelay(600);
    return simulateCounterfactual({ ...config, simulationId: nextSimulationId() });
  }
  const response = await api.post("/simulations/counterfactual", config);
  return response.data;
}

export async function getSimulation(id) {
  if (USE_MOCK) {
    await mockDelay(200);
    return getSimulationHistory().find((entry) => entry.id === id) ?? null;
  }
  const response = await api.get(`/simulations/${id}`);
  return response.data;
}

export async function getHistory() {
  if (USE_MOCK) {
    await mockDelay(150);
    return clone(getSimulationHistory());
  }
  const response = await api.get("/simulations");
  return response.data;
}
