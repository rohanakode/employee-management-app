import { z } from 'zod';

// ─── VALIDATION SCHEMA ────────────────────────────────────────────
// zod is a "schema validator". You describe the shape of valid data,
// and zod produces:
//   1. A runtime validator  (checks user input)
//   2. A TypeScript type   (derived from the schema — one source of truth)
//
// This file is the ONLY place validation rules live. Add a rule here,
// the Add + Edit forms both pick it up automatically.

export const DEPARTMENTS = [
  'Engineering',
  'HR',
  'Sales',
  'Marketing',
  'Finance',
  'Operations',
] as const;

export const employeeFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name is too long'),

  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),

  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, 'Phone must be exactly 10 digits'),

  position: z
    .string()
    .trim()
    .min(2, 'Position is required'),

  department: z.enum(DEPARTMENTS, {
    message: 'Pick a department',
  }),

  status: z.enum(['Active', 'Inactive']),
});

// Derive the TypeScript type from the schema.
// If we add a field to the schema, this type auto-updates.
export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
