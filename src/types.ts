// The shape of a single employee record.
// Every screen, every function, every piece of state will use this type.
// Change it in one place and TypeScript tells you everywhere else that breaks.

export type Department =
  | 'Engineering'
  | 'HR'
  | 'Sales'
  | 'Marketing'
  | 'Finance'
  | 'Operations';

export type EmployeeStatus = 'Active' | 'Inactive';

export type Employee = {
  id: string;              // unique id (we'll generate with Date.now() or uuid later)
  name: string;
  email: string;
  phone: string;
  position: string;        // e.g. "Software Engineer"
  department: Department;
  dateOfJoining?: string;  // ISO date string, optional for now
  status: EmployeeStatus;
  createdAt: string;       // when the record was added
};
