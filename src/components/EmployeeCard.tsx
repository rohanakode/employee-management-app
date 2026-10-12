import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { palette } from '../theme';
import type { Employee } from '../types';

type Props = {
  employee: Employee;
  onPress?: (employee: Employee) => void;
};

// Pick a stable gray shade based on the name's first letter.
function avatarColor(name: string): string {
  return palette.avatarShades[name.charCodeAt(0) % palette.avatarShades.length];
}

export default function EmployeeCard({ employee, onPress }: Props) {
  const initial = employee.name.charAt(0).toUpperCase();
  const isInactive = employee.status === 'Inactive';

  return (
    <Pressable
      onPress={() => onPress?.(employee)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
        isInactive && styles.cardInactive,
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: avatarColor(employee.name) }]}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <View style={styles.middle}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {employee.name}
          </Text>
          {isInactive ? <View style={styles.inactiveDot} /> : null}
        </View>
        <Text style={styles.position} numberOfLines={1}>
          {employee.position}
        </Text>
      </View>

      <View style={styles.deptBadge}>
        <Text style={styles.deptText}>{employee.department}</Text>
      </View>

      <Ionicons name="chevron-forward" size={16} color={palette.textLight} style={styles.chevron} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.card,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.985 }],
  },
  cardInactive: {
    opacity: 0.6,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  middle: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
  },
  inactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.danger,
    marginLeft: 8,
  },
  position: {
    fontSize: 13,
    color: palette.textMuted,
    marginTop: 2,
  },
  deptBadge: {
    backgroundColor: palette.deptBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 6,
  },
  deptText: {
    fontSize: 11,
    color: palette.deptText,
    fontWeight: '600',
  },
  chevron: {
    marginLeft: 2,
  },
});
