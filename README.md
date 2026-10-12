<div align="center">

# Employee Management

**A React Native (Expo) Android app for managing employee records.**

Full CRUD · Local persistence · Search · Filters · Form validation

Built as a take-home assignment to demonstrate React Native fundamentals.

</div>

---

## Overview

The app models a lightweight HR directory. You can list employees, view each record in detail, add new ones, edit existing ones, and delete with a confirmation prompt. Data persists across app restarts.

## Features

- **Create** — Add new employees via a validated form (name, email, phone, position, department, status).
- **Read** — Scrollable list with search (by name, email, position, or department) and status filter (All / Active / Inactive). Tap a row to open the full profile.
- **Update** — Edit any employee; the same form is reused with the existing record prefilled.
- **Delete** — Delete from the detail screen with a native confirmation dialog.
- **Persistence** — All changes save to the device's local storage and survive restarts.
- **Validation** — Schema-driven validation with inline error messages per field.
- **UI polish** — Monochrome palette with a single accent, icons on every row and action, haptic feedback on taps and successes, pull-to-refresh, empty states, and distinct styling for inactive employees.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Expo (React Native) with TypeScript |
| Navigation | React Navigation (native stack) |
| State | React Context + hooks |
| Forms | react-hook-form |
| Validation | zod (with `z.infer` deriving the TypeScript type) |
| Storage | AsyncStorage, behind a module so it can be swapped |
| Icons | @expo/vector-icons (Ionicons) |
| Haptics | expo-haptics |

## Project structure

```
src/
├── components/        Reusable UI (EmployeeCard, FormField, OptionPicker, EmployeeForm)
├── context/           EmployeesContext — single source of truth for the list
├── data/              Seed employees (used on first launch)
├── navigation/        Typed navigation parameter list
├── schemas/           zod validation schema (also the TS form type)
├── screens/           EmployeeList, EmployeeDetail, AddEmployee, EditEmployee
├── storage/           AsyncStorage read/write (the ONLY file touching storage)
├── utils/             haptics, generateEmployeeId
├── theme.ts           Centralized color palette
└── types.ts           Employee domain type
```

## Getting started

Requires Node 18+ and a phone with Expo Go installed (available free on the Play Store).

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on an Android device on the same Wi-Fi network.

## Building an APK

Uses EAS Build to produce a standalone Android APK in Expo's cloud.

```bash
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform android --profile preview
```

The build URL that EAS prints is the installable download link.

## Design decisions

- **AsyncStorage over SQLite** — the dataset is small (dozens of records). AsyncStorage with a JSON array is simpler and sufficient. The storage layer is behind a module so swapping to SQLite or a REST API later changes only one file.
- **react-hook-form + zod** — one schema is both the runtime validator and the TypeScript type (`z.infer`). The same schema and the same form component (`EmployeeForm`) back both the Add and Edit screens, so validation rules live in exactly one place.
- **Context over Redux** — a single list and a few mutations don't justify Redux. Context plus a custom `useEmployees` hook stays flat and readable.
- **Monochrome palette with one accent** — chosen to feel designed rather than templated. The burnt-orange accent is reserved for the primary action (FAB, Save, Edit), so the eye always lands on the next step.
- **Sequential numeric IDs** — human-readable, don't reuse deleted IDs (matches real HR convention).

