import { api, USE_MOCK, mockDelay } from "./api";
import { BLOCKCHAIN_EVIDENCE } from "../utils/mockData";

const clone = (data) => JSON.parse(JSON.stringify(data));

export async function getEvidence(simulationId) {
  if (USE_MOCK) {
    await mockDelay(300);
    const evidence = clone(BLOCKCHAIN_EVIDENCE);
    if (simulationId) {
      evidence.simulationId = simulationId;
      evidence.event = `${evidence.event} · ${simulationId}`;
    }
    return evidence;
  }
  const response = await api.get(`/blockchain/evidence/${simulationId}`);
  return response.data;
}
