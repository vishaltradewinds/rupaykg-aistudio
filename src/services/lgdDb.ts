import Database from "better-sqlite3";
import { INDIAN_STATES } from "../constants";
import fs from "fs";

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

let db: Database.Database | null = null;
let lastSyncedTime = "Never";
let lastSyncStatus = "Idle";

function assertDb(): Database.Database {
  if (!db) throw new Error("LGD database not initialized");
  return db;
}

/**
 * Initializes the local LGD index from the application's static domain dataset.
 * IMPORTANT: this dataset is NOT treated as authoritative Government LGD data.
 * No AI, hash, random, or fallback generator is permitted to manufacture LGD codes.
 */
export function initLgdDatabase() {
  try {
    db = new Database("lgd_directory.db");
    db.exec(`
      CREATE TABLE IF NOT EXISTS lgd_states (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        state_name TEXT UNIQUE,
        state_lgd_code INTEGER
      );
      CREATE TABLE IF NOT EXISTS lgd_districts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        district_name TEXT,
        district_lgd_code INTEGER,
        state_name TEXT,
        UNIQUE(district_name, state_name)
      );
      CREATE TABLE IF NOT EXISTS lgd_local_bodies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        local_body_name TEXT,
        local_body_lgd_code INTEGER,
        local_body_type TEXT,
        subdistrict_name TEXT,
        district_name TEXT,
        state_name TEXT,
        UNIQUE(local_body_name, local_body_type, subdistrict_name, district_name, state_name)
      );
      CREATE TABLE IF NOT EXISTS lgd_sync_tracker (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);

    const count = db.prepare("SELECT COUNT(*) as count FROM lgd_states").get() as { count: number };
    if (count.count === 0) {
      seedLgdDatabase();
      lastSyncedTime = new Date().toISOString();
      lastSyncStatus = "Loaded local index";
    } else {
      lastSyncStatus = "Loaded local index";
      lastSyncedTime = new Date().toISOString();
    }
  } catch (error) {
    console.error("Failed to initialize LGD database:", error);
    try { db?.close(); } catch {}
    db = null;
    if (fs.existsSync("lgd_directory.db")) {
      try { fs.unlinkSync("lgd_directory.db"); } catch {}
    }
    lastSyncStatus = "Failed";
    throw error;
  }
}

function seedLgdDatabase() {
  const database = assertDb();
  const insertState = database.prepare("INSERT OR IGNORE INTO lgd_states (state_name, state_lgd_code) VALUES (?, ?)");
  const insertDistrict = database.prepare("INSERT OR IGNORE INTO lgd_districts (district_name, district_lgd_code, state_name) VALUES (?, ?, ?)");
  const insertLocalBody = database.prepare(`INSERT OR IGNORE INTO lgd_local_bodies
    (local_body_name, local_body_lgd_code, local_body_type, subdistrict_name, district_name, state_name)
    VALUES (?, ?, ?, ?, ?, ?)`);

  database.transaction(() => {
    Object.keys(INDIAN_STATES).sort().forEach((state, stateIdx) => {
      // These numeric identifiers originate from the local application dataset.
      // They MUST NOT be represented as official Government LGD codes.
      const stateCode = stateIdx + 1;
      insertState.run(state, stateCode);
      const districts = INDIAN_STATES[state] || {};
      Object.keys(districts).sort().forEach((district, districtIdx) => {
        const districtCode = stateCode * 1000 + districtIdx + 1;
        insertDistrict.run(district, districtCode, state);
        const data = districts[district];
        const urban = (data.Urban || []).slice().sort();
        const rural = (data.Rural || []).slice().sort();
        urban.forEach((area, idx) => {
          insertLocalBody.run(area, districtCode * 1000 + idx + 1, "Ward", `${district} Tehsil (Urban)`, district, state);
        });
        rural.forEach((area, idx) => {
          insertLocalBody.run(area, districtCode * 1000 + 500 + idx + 1, "Gram Panchayat", `${district} Block (Rural)`, district, state);
        });
      });
    });
  })();
}

/** Returns the locally indexed states. These records are not authoritative LGD verification. */
export function getLgdStates(): LgdStateRecord[] {
  if (!db) return [];
  return (db.prepare("SELECT state_name, state_lgd_code FROM lgd_states ORDER BY state_name").all() as LgdStateRecord[])
    .map(row => ({ ...row, is_lgd_verified: false }));
}

/** Returns only locally indexed districts. No AI expansion or fabricated LGD codes. */
export function getLgdDistricts(state: string): LgdDistrictRecord[] {
  if (!db) return [];
  return (db.prepare(`SELECT district_name, district_lgd_code, state_name FROM lgd_districts WHERE state_name = ? ORDER BY district_name`).all(state) as LgdDistrictRecord[])
    .map(row => ({ ...row, is_lgd_verified: false }));
}

/** Returns locally indexed subdistrict names. Codes are local index identifiers, not official LGD codes. */
export async function getLgdSubdistricts(state: string, district: string) {
  if (!db) return [];
  const rows = db.prepare(`SELECT DISTINCT subdistrict_name FROM lgd_local_bodies WHERE state_name = ? AND district_name = ? ORDER BY subdistrict_name`).all(state, district) as Array<{ subdistrict_name: string }>;
  return rows.map((row, idx) => ({
    subdistrict_name: row.subdistrict_name,
    subdistrict_lgd_code: idx + 1,
    district_name: district,
    state_name: state,
    is_lgd_verified: false,
  }));
}

export function getLgdLocalBodies(state: string, district: string, subdistrict: string): LgdLocalBodyRecord[] {
  if (!db) return [];
  return (db.prepare(`SELECT local_body_name, local_body_lgd_code, local_body_type, subdistrict_name, district_name, state_name
    FROM lgd_local_bodies WHERE state_name = ? AND district_name = ? AND subdistrict_name = ? ORDER BY local_body_name`)
    .all(state, district, subdistrict) as LgdLocalBodyRecord[])
    .map(row => ({ ...row, is_lgd_verified: false }));
}

export function getLgdSyncStatus() {
  if (!db) return { lastSynced: "Never", status: "Idle", statesCount: 0, districtsCount: 0, totalLocalBodiesCount: 0 };
  try {
    const statesCount = db.prepare("SELECT COUNT(*) as count FROM lgd_states").get() as { count: number };
    const districtsCount = db.prepare("SELECT COUNT(*) as count FROM lgd_districts").get() as { count: number };
    const localBodiesCount = db.prepare("SELECT COUNT(*) as count FROM lgd_local_bodies").get() as { count: number };
    return {
      lastSynced: lastSyncedTime,
      status: lastSyncStatus,
      statesCount: statesCount.count,
      districtsCount: districtsCount.count,
      totalLocalBodiesCount: localBodiesCount.count,
    };
  } catch {
    return { lastSynced: lastSyncedTime, status: "Failed", statesCount: 0, districtsCount: 0, totalLocalBodiesCount: 0 };
  }
}

/** Reloads the local application index. This is not an official Government LGD synchronization. */
export async function syncLgdDatabase() {
  const database = assertDb();
  lastSyncStatus = "Syncing local index";
  database.prepare("DELETE FROM lgd_local_bodies").run();
  database.prepare("DELETE FROM lgd_districts").run();
  database.prepare("DELETE FROM lgd_states").run();
  database.prepare("DELETE FROM lgd_sync_tracker").run();
  seedLgdDatabase();
  lastSyncedTime = new Date().toISOString();
  lastSyncStatus = "Loaded local index";
  return getLgdSyncStatus();
}
