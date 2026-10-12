import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import EmployeeForm from '../components/EmployeeForm';
import { useEmployees } from '../context/EmployeesContext';
import type { RootStackParamList } from '../navigation/types';
import type { EmployeeFormValues } from '../schemas/employeeSchema';
import { generateEmployeeId } from '../utils/generateEmployeeId';
import { success } from '../utils/haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEmployee'>;

export default function AddEmployeeScreen({ navigation }: Props) {
  const { employees, addEmployee } = useEmployees();

  const handleSave = (values: EmployeeFormValues) => {
    addEmployee({
      id: generateEmployeeId(employees),
      ...values,
      createdAt: new Date().toISOString(),
    });
    success();
    navigation.goBack();
  };

  return (
    <EmployeeForm
      submitLabel="Save employee"
      onSubmit={handleSave}
      onCancel={() => navigation.goBack()}
    />
  );
}
