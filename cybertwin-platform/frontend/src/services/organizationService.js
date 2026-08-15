import { api, USE_MOCK, mockDelay } from "./api";
import {
  DEMO_ENVIRONMENT,
  ORGANIZATION_OVERVIEW,
  USERS,
  DEVICES,
  ASSETS,
  DATA_ASSETS,
} from "../utils/mockData";

const clone = (data) => JSON.parse(JSON.stringify(data));

async function organizationFromApi() {
  const response = await api.get("/organization");
  return response.data;
}

async function usersFromApi() {
  const response = await api.get("/users");
  return response.data;
}

async function devicesFromApi() {
  const response = await api.get("/devices");
  return response.data;
}

async function assetsFromApi() {
  const response = await api.get("/assets");
  return response.data;
}

async function dataAssetsFromApi() {
  const response = await api.get("/data-assets");
  return response.data;
}

export async function getOrganization() {
  if (USE_MOCK) {
    await mockDelay();
    return clone(DEMO_ENVIRONMENT);
  }
  return organizationFromApi();
}

export async function getOverview() {
  if (USE_MOCK) {
    await mockDelay(300);
    return clone(ORGANIZATION_OVERVIEW);
  }
  return usersFromApi().then(() => clone(ORGANIZATION_OVERVIEW));
}

export async function getUsers() {
  if (USE_MOCK) {
    await mockDelay();
    return clone(USERS);
  }
  return usersFromApi();
}

export async function getDevices() {
  if (USE_MOCK) {
    await mockDelay();
    return clone(DEVICES);
  }
  return devicesFromApi();
}

export async function getAssets() {
  if (USE_MOCK) {
    await mockDelay();
    return clone(ASSETS);
  }
  return assetsFromApi();
}

export async function getDataAssets() {
  if (USE_MOCK) {
    await mockDelay();
    return clone(DATA_ASSETS);
  }
  return dataAssetsFromApi();
}
