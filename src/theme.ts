// ─── APP COLOR PALETTE ────────────────────────────────────────────
// Option A: Monochrome + burnt orange accent.
// Centralized so swapping brand color later = change one file.
// Not every screen imports this yet; styles still inline their colors.
// But reach for these constants whenever you touch a color going forward.

export const palette = {
  // Surfaces
  bg: '#fafafa',
  card: '#ffffff',
  surfaceAlt: '#f4f4f5',

  // Text
  text: '#0a0a0a',
  textSecondary: '#525252',
  textMuted: '#737373',
  textLight: '#a3a3a3',

  // Borders
  border: '#e5e5e5',
  borderStrong: '#d4d4d4',
  separator: '#f4f4f5',

  // Accent (burnt orange) — used sparingly, high signal
  accent: '#ea580c',
  accentHover: '#c2410c',
  accentBg: '#fff7ed',
  accentText: '#9a3412',

  // Status
  success: '#059669',
  successBg: '#d1fae5',
  danger: '#dc2626',
  dangerBg: '#fef2f2',
  dangerBorder: '#fecaca',

  // Dept chip
  deptBg: '#f4f4f5',
  deptText: '#404040',

  // Monochrome avatar rotation — 6 shades of near-black/gray
  // All dark enough that white text stays legible.
  avatarShades: ['#0a0a0a', '#262626', '#374151', '#4b5563', '#525252', '#6b7280'],
} as const;
