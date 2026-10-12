import type { Employee } from '../types';

/**
 * Generate the next sequential Employee ID: 1, 2, 3, ...
 *
 * Scans existing IDs, picks the highest numeric one, adds 1.
 * Deleting mid-list doesn't reuse numbers — matches real HR convention
 * (an ex-employee's ID shouldn't get recycled).
 */
export function generateEmployeeId(existing: Employee[]): string {
  const highest = existing.reduce((max, e) => {
    const n = parseInt(e.id, 10);
    return !isNaN(n) && n > max ? n : max;
  }, 0);
  return String(highest + 1);
}
