import AsyncStorage from '@react-native-async-storage/async-storage';
import { sampleEmployees } from '../data/sampleEmployees';
import type { Employee } from '../types';

// ─── STORAGE MODULE ───────────────────────────────────────────────
// The ONLY file in the app that talks to AsyncStorage.
// Every screen/context uses these functions — not AsyncStorage directly.
// Swap this file to swap the whole data layer (SQLite, backend, etc.).

const KEY = 'employees:v1';

/**
 * Load the full employee list from disk.
 * First launch → no data yet → seed with sample employees so the user
 * sees something and the app feels alive. Later launches read what we saved.
 */
export async function loadEmployees(): Promise<Employee[]> {
  try {
    const json = await AsyncStorage.getItem(KEY);
    if (json == null) {
      // First launch — seed with sample data and save it right away
      // so future launches read from storage (not from the sample array).
      await saveEmployees(sampleEmployees);
      return sampleEmployees;
    }
    return JSON.parse(json) as Employee[];
  } catch (err) {
    // If disk/JSON is corrupted somehow, don't crash the app.
    console.warn('Failed to load employees from storage:', err);
    return [];
  }
}

/**
 * Save the full employee list to disk.
 * We save the whole array because our dataset is small (<100 records).
 * For a large dataset we'd use SQLite with per-row writes instead.
 */
export async function saveEmployees(employees: Employee[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(employees));
  } catch (err) {
    console.warn('Failed to save employees to storage:', err);
  }
}
