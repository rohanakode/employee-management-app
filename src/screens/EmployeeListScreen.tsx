import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import EmployeeCard from '../components/EmployeeCard';
import { useEmployees } from '../context/EmployeesContext';
import type { RootStackParamList } from '../navigation/types';
import { palette } from '../theme';
import { tapLight } from '../utils/haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'EmployeeList'>;
type Filter = 'All' | 'Active' | 'Inactive';
const FILTERS: Filter[] = ['All', 'Active', 'Inactive'];

function buildSubtitle(
  shown: number,
  total: number,
  filter: Filter,
  query: string,
): string {
  const noun = total === 1 ? 'person' : 'people';
  const isFiltering = filter !== 'All' || query.trim().length > 0;
  if (!isFiltering) {
    return `${total} ${noun}`;
  }
  const parts = [`${shown} of ${total} ${noun}`];
  if (filter !== 'All') parts.push(filter);
  if (query.trim().length > 0) parts.push(`matching "${query.trim()}"`);
  return parts.join(' · ');
}

export default function EmployeeListScreen({ navigation }: Props) {
  const { employees, isLoading } = useEmployees();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees.filter((e) => {
      if (filter !== 'All' && e.status !== filter) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
      );
    });
  }, [employees, query, filter]);

  const onRefresh = () => {
    setRefreshing(true);
    tapLight();
    setTimeout(() => setRefreshing(false), 500);
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={palette.accent} />
        <Text style={styles.loadingText}>Loading employees…</Text>
      </View>
    );
  }

  const hasEmployees = employees.length > 0;
  const nothingMatches = hasEmployees && filtered.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Employees</Text>
        <Text style={styles.subtitle}>
          {buildSubtitle(filtered.length, employees.length, filter, query)}
        </Text>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={palette.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email, position…"
          placeholderTextColor={palette.textLight}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 ? (
          <Pressable onPress={() => setQuery('')} style={styles.clearBtn} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color={palette.textLight} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <Pressable
              key={f}
              onPress={() => {
                tapLight();
                setFilter(f);
              }}
              style={({ pressed }) => [
                styles.filterChip,
                active && styles.filterChipActive,
                pressed && !active && styles.filterChipPressed,
              ]}
            >
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                {f}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EmployeeCard
            employee={item}
            onPress={(e) => {
              tapLight();
              navigation.navigate('EmployeeDetail', { employeeId: e.id });
            }}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={palette.accent}
            colors={[palette.accent]}
          />
        }
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          nothingMatches ? (
            <View style={styles.empty}>
              <Ionicons name="search" size={48} color={palette.border} />
              <Text style={styles.emptyTitle}>No matches</Text>
              <Text style={styles.emptyHint}>
                Try a different search or filter.
              </Text>
            </View>
          ) : (
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={56} color={palette.border} />
              <Text style={styles.emptyTitle}>No employees yet</Text>
              <Text style={styles.emptyHint}>
                Tap the + button to add your first employee.
              </Text>
            </View>
          )
        }
      />

      <Pressable
        onPress={() => {
          tapLight();
          navigation.navigate('AddEmployee');
        }}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Ionicons name="add" size={30} color="#ffffff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.bg,
  },
  loadingText: {
    marginTop: 12,
    color: palette.textMuted,
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: palette.text,
  },
  subtitle: {
    fontSize: 13,
    color: palette.textMuted,
    marginTop: 2,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.card,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: palette.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: palette.text,
  },
  clearBtn: {
    padding: 4,
    marginLeft: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  filterChipActive: {
    backgroundColor: palette.text,
    borderColor: palette.text,
  },
  filterChipPressed: {
    backgroundColor: palette.surfaceAlt,
  },
  filterChipText: {
    fontSize: 13,
    color: palette.textSecondary,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 100,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.textSecondary,
    marginTop: 14,
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 13,
    color: palette.textLight,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
});
