import { api, USE_MOCK, mockDelay } from "./api";
import { ML_USER_RISKS } from "../utils/mockData";

const clone = (data) => JSON.parse(JSON.stringify(data));

export async function getUserBehavioralRisk(userId) {
  if (USE_MOCK) {
    await mockDelay(350);
    return clone(ML_USER_RISKS.find((entry) => entry.userId === userId) ?? null);
  }
  const response = await api.get(`/ml/user-risk/${userId}`);
  return response.data;
}

export async function getTopBehavioralRisks() {
  if (USE_MOCK) {
    await mockDelay(300);
    return clone(ML_USER_RISKS);
  }
  const response = await api.get("/ml/user-risk");
  return response.data;
}
