import { INDIAN_STATES } from "../constants.ts";

export interface LgdStateRecord {
  state_name: string;
  state_lgd_code: number;
  is_lgd_verified?: boolean;
}

export interface LgdDistrictRecord {
  district_name: string;
  district_lgd_code: number;
  state_name: string;
  is_lgd_verified?: boolean;
}

export interface LgdLocalBodyRecord {
  local_body_name: string;
  local_body_lgd_code: number;
  local_body_type: string;
  subdistrict_name: string;
  district_name: string;
  state_name: string;
  is_lgd_verified?: boolean;
}

/**
 * Local LGD reference index — NOT an authoritative Government LGD database.
 *
 * This boundary is intentionally in-memory. PostgreSQL is the only application
 * persistence database. No SQLite file, local database writes, or synthetic
 * Government identifiers are persisted by this module.
 *
 * Numeric *_lgd_code fields are retained only for compatibility with the
 * existing frontend contract and are explicitly marked is_lgd_verified=false.
 */
let initialized = false;
let lastSyncedTime = "Never";
let lastSyncStatus = "Idle";

function ensureInitialized() {
  if (!initialized) initLgdDatabase();
}

function buildStates(): LgdStateRecord[] {
  return Object.keys(INDIAN_STATES)
    .sort()
    .map((state, index) => ({
      state_name: state,
      state_lgd_code: index + 1,
      is_lgd_verified: false,
    }));
}

function buildDistricts(state: string): LgdDistrictRecord[] {
  const districts = INDIAN_STATES[state] || {};
  const stateRecord = buildStates().find((row) => row.state_name === state);
  const stateCode = stateRecord?.state_lgd_code || 0;

  return Object.keys(districts)
    .sort()
    .map((district, index) => ({
      district_name: district,
      district_lgd_code: stateCode * 1000 + index + 1,
      state_name: state,
      is_lgd_verified: false,
    }));
}

function buildLocalBodies(state: string, district: string): LgdLocalBodyRecord[] {
  const data = INDIAN_STATES[state]?.[district];
  if (!data) return [];

  const districtRecord = buildDistricts(state).find((row) => row.district_name === district);
  const districtCode = districtRecord?.district_lgd_code || 0;
  const rows: LgdLocalBodyRecord[] = [];

  (data.Urban || []).slice().sort().forEach((area, index) => {
    rows.push({
      local_body_name: area,
      local_body_lgd_code: districtCode * 1000 + index + 1,
      local_body_type: "Ward",
      subdistrict_name: `${district} Tehsil (Urban)`,
      district_name: district,
      state_name: state,
      is_lgd_verified: false,
    });
  });

  (data.Rural || []).slice().sort().forEach((area, index) => {
    rows.push({
      local_body_name: area,
      local_body_lgd_code: districtCode * 1000 + 500 + index + 1,
      local_body_type: "Gram Panchayat",
      subdistrict_name: `${district} Block (Rural)`,
      district_name: district,
      state_name: state,
      is_lgd_verified: false,
    });
  });

  return rows;
}

/** Initializes the immutable local reference index. */
export function initLgdDatabase() {
  initialized = true;
  lastSyncedTime = new Date().toISOString();
  lastSyncStatus = "Loaded in-memory local index";
}

/** Returns locally indexed states. These records are not authoritative LGD verification. */
export function getLgdStates(): LgdStateRecord[] {
  ensureInitialized();
  return buildStates();
}

/** Returns locally indexed districts. Codes are compatibility identifiers, not official LGD codes. */
export function getLgdDistricts(state: string): LgdDistrictRecord[] & {
  then: <T>(onfulfilled: (value: LgdDistrictRecord[]) => T) => T;
} {
  ensureInitialized();
  const rows = buildDistricts(state) as LgdDistrictRecord[] & {
    then: <T>(onfulfilled: (value: LgdDistrictRecord[]) => T) => T;
  };
  Object.defineProperty(rows, "then", {
    enumerable: false,
    value: <T>(onfulfilled: (value: LgdDistrictRecord[]) => T) => onfulfilled(rows),
  });
  return rows;
}

/** Returns locally indexed subdistrict names. */
export async function getLgdSubdistricts(state: string, district: string) {
  ensureInitialized();
  const rows = buildLocalBodies(state, district);
  return [...new Set(rows.map((row) => row.subdistrict_name))].sort().map((name, index) => ({
    subdistrict_name: name,
    subdistrict_lgd_code: index + 1,
    district_name: district,
    state_name: state,
    is_lgd_verified: false,
  }));
}

/** Returns locally indexed local bodies; none are Government-LGD verified. */
export function getLgdLocalBodies(state: string, district: string, subdistrict: string): LgdLocalBodyRecord[] {
  ensureInitialized();
  return buildLocalBodies(state, district).filter((row) => row.subdistrict_name === subdistrict);
}

export function getLgdSyncStatus() {
  ensureInitialized();
  let statesCount = 0;
  let districtsCount = 0;
  let totalLocalBodiesCount = 0;

  for (const state of Object.keys(INDIAN_STATES)) {
    statesCount += 1;
    const districts = Object.keys(INDIAN_STATES[state] || {});
    districtsCount += districts.length;
    for (const district of districts) totalLocalBodiesCount += buildLocalBodies(state, district).length;
  }

  return {
    lastSynced: lastSyncedTime,
    status: lastSyncStatus,
    statesCount,
    districtsCount,
    totalLocalBodiesCount,
  };
}

/** Reloads the immutable in-memory application index; no persistence is performed. */
export async function syncLgdDatabase() {
  initialized = true;
  lastSyncedTime = new Date().toISOString();
  lastSyncStatus = "Reloaded in-memory local index";
  return getLgdSyncStatus();
}
