import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import EmployeeForm from '../components/EmployeeForm';
import { useEmployees } from '../context/EmployeesContext';
import type { RootStackParamList } from '../navigation/types';
import type { EmployeeFormValues } from '../schemas/employeeSchema';
import { success } from '../utils/haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'EditEmployee'>;

export default function EditEmployeeScreen({ route, navigation }: Props) {
  const { employeeId } = route.params;
  const { getEmployeeById, updateEmployee } = useEmployees();
  const employee = getEmployeeById(employeeId);

  // Defensive: deep-link or stale navigation could land here with a missing id.
  if (!employee) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Employee not found.</Text>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const handleSave = (values: EmployeeFormValues) => {
    // Keep original id + createdAt, overwrite everything else.
    updateEmployee({
      ...employee,
      ...values,
    });
    success();
    navigation.goBack();  // return to Detail screen, now showing updated info
  };

  return (
    <EmployeeForm
      initialValues={{
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        position: employee.position,
        department: employee.department,
        status: employee.status,
      }}
      submitLabel="Update"
      onSubmit={handleSave}
      onCancel={() => navigation.goBack()}
    />
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#f5f7fb',
  },
  notFoundText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
