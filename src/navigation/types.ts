// ─── NAVIGATION TYPES ──────────────────────────────────────────────
// This type is the "map" of your app: which screens exist and what
// parameters each one receives. React Navigation uses it to:
//   - Autocomplete screen names when you call navigation.navigate(...)
//   - Type the `route.params` object inside each screen
//   - Catch typos at compile time instead of runtime
//
// Add a screen here → it becomes available everywhere.

export type RootStackParamList = {
  EmployeeList: undefined;                 // no params needed
  EmployeeDetail: { employeeId: string };  // tap passes which one
  AddEmployee: undefined;                  // blank form, no params
  EditEmployee: { employeeId: string };    // prefilled form, needs which one
};
