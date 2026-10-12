import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEmployees } from '../context/EmployeesContext';
import type { RootStackParamList } from '../navigation/types';
import { palette } from '../theme';
import { success, tapLight, warning } from '../utils/haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'EmployeeDetail'>;

function avatarColor(name: string): string {
  return palette.avatarShades[name.charCodeAt(0) % palette.avatarShades.length];
}

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export default function EmployeeDetailScreen({ route, navigation }: Props) {
  const { employeeId } = route.params;
  const { getEmployeeById, deleteEmployee } = useEmployees();
  const employee = getEmployeeById(employeeId);

  if (!employee) {
    return (
      <View style={styles.notFound}>
        <Ionicons name="alert-circle-outline" size={56} color={palette.border} />
        <Text style={styles.notFoundText}>Employee not found.</Text>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  function handleDelete() {
    if (!employee) return;
    warning();
    Alert.alert(
      'Delete employee?',
      `Remove ${employee.name} from the list? This can't be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteEmployee(employee.id);
            success();
            navigation.goBack();
          },
        },
      ],
    );
  }

  const isActive = employee.status === 'Active';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={[styles.avatar, { backgroundColor: avatarColor(employee.name) }]}>
          <Text style={styles.avatarText}>
            {employee.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{employee.name}</Text>

        <View
          style={[
            styles.statusPill,
            isActive ? styles.statusActive : styles.statusInactive,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              isActive ? styles.statusDotActive : styles.statusDotInactive,
            ]}
          />
          <Text
            style={[
              styles.statusText,
              isActive ? styles.statusTextActive : styles.statusTextInactive,
            ]}
          >
            {employee.status}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <DetailRow icon="briefcase-outline" label="Position" value={employee.position} />
        <Separator />
        <DetailRow icon="mail-outline" label="Email" value={employee.email} />
        <Separator />
        <DetailRow icon="call-outline" label="Phone" value={employee.phone} />
        <Separator />
        <DetailRow icon="business-outline" label="Department" value={employee.department} />
        {employee.dateOfJoining ? (
          <>
            <Separator />
            <DetailRow icon="calendar-outline" label="Joined" value={employee.dateOfJoining} />
          </>
        ) : null}
        <Separator />
        <DetailRow icon="finger-print-outline" label="Employee ID" value={employee.id} mono />
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.editBtn, pressed && styles.btnPressed]}
          onPress={() => {
            tapLight();
            navigation.navigate('EditEmployee', { employeeId: employee.id });
          }}
        >
          <Ionicons name="create-outline" size={18} color="#ffffff" />
          <Text style={styles.editBtnText}>Edit</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.deleteBtn, pressed && styles.btnPressed]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={18} color={palette.danger} />
          <Text style={styles.deleteBtnText}>Delete</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function DetailRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: IoniconName;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIconWrap}>
        <Ionicons name={icon} size={18} color={palette.textMuted} />
      </View>
      <View style={styles.rowTextWrap}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={[styles.rowValue, mono && styles.rowValueMono]}>{value}</Text>
      </View>
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '700',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.text,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusActive: {
    backgroundColor: palette.successBg,
  },
  statusInactive: {
    backgroundColor: palette.dangerBg,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  statusDotActive: {
    backgroundColor: palette.success,
  },
  statusDotInactive: {
    backgroundColor: palette.danger,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#065f46',
  },
  statusTextInactive: {
    color: '#991b1b',
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: palette.border,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
  },
  rowIconWrap: {
    width: 32,
    alignItems: 'center',
  },
  rowTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  rowLabel: {
    fontSize: 12,
    color: palette.textLight,
    fontWeight: '500',
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 15,
    color: palette.text,
  },
  rowValueMono: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: palette.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: palette.separator,
    marginLeft: 42,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: palette.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.dangerBorder,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    color: palette.danger,
    fontWeight: '700',
    fontSize: 15,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: palette.bg,
  },
  notFoundText: {
    fontSize: 16,
    color: palette.textMuted,
    marginTop: 12,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: palette.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
