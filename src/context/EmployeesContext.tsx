import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { loadEmployees, saveEmployees } from '../storage/employeeStorage';
import type { Employee } from '../types';

type EmployeesContextValue = {
  employees: Employee[];
  isLoading: boolean;  // true while we read from AsyncStorage on first mount
  addEmployee: (e: Employee) => void;
  updateEmployee: (e: Employee) => void;
  deleteEmployee: (id: string) => void;
  getEmployeeById: (id: string) => Employee | undefined;
};

const EmployeesContext = createContext<EmployeesContextValue | undefined>(undefined);

export function EmployeesProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ─── LOAD ON MOUNT ─────────────────────────────────────────
  // useEffect with [] runs ONCE when the Provider first mounts
  // (which is at app startup). Reads from AsyncStorage, then sets state.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await loadEmployees();
      if (!cancelled) {
        setEmployees(data);
        setIsLoading(false);
      }
    })();
    // Cleanup: if the Provider unmounts before load finishes,
    // don't try to setState on an unmounted component.
    return () => {
      cancelled = true;
    };
  }, []);

  // ─── SAVE ON CHANGE ────────────────────────────────────────
  // Every time `employees` changes AND we're past initial load,
  // persist the new array to disk.
  //
  // We skip the save on the very first render (where the array is
  // still the empty [] placeholder) by gating on !isLoading.
  useEffect(() => {
    if (isLoading) return;  // don't overwrite storage with the empty seed
    saveEmployees(employees);
  }, [employees, isLoading]);

  const addEmployee = (e: Employee) => {
    setEmployees((prev) => [e, ...prev]);
  };

  const updateEmployee = (updated: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const getEmployeeById = (id: string) => employees.find((e) => e.id === id);

  return (
    <EmployeesContext.Provider
      value={{
        employees,
        isLoading,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployeeById,
      }}
    >
      {children}
    </EmployeesContext.Provider>
  );
}

export function useEmployees() {
  const ctx = useContext(EmployeesContext);
  if (!ctx) {
    throw new Error('useEmployees must be used inside <EmployeesProvider>');
  }
  return ctx;
}
