import { useAttendanceStore } from '@/src/store/useAttendanceStore';
import { useAuthStore } from '@/src/store/useAuthStore';
import { colors, spacing } from '@/src/theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';

export default function AttendanceHistoryScreen() {
  const user = useAuthStore((state) => state.user);
  const employeeId = user?.staffData?.employeeId;

  // Fetch only this employee's logs from the Zustand store
  const getRecordsByEmployee = useAttendanceStore((state) => state.getRecordsByEmployee);
  const myRecords = employeeId ? getRecordsByEmployee(employeeId) : [];

  return (
    <FlatList
      data={myRecords}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      contentInsetAdjustmentBehavior='automatic'
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No attendance records found yet.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.recordCard}>
          <View style={styles.recordInfo}>
            <Text style={styles.timestampText}>{item.timestamp}</Text>
            <Text style={styles.idText}>ID: {item.employeeId}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Text style={styles.idText}>Lat: {item.latitude?.toFixed(4)}</Text>
              <Text style={styles.idText}>Lng: {item.longitude?.toFixed(4)}</Text>
            </View>
              <Text style={styles.idText}>City: {item.City}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="checkmark-circle" size={16} color={'green'} />
            <Text style={styles.badgeText}>{item.confidenceScore}% Match</Text>
          </View>
        </View>
      )}
    />

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing(4),
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing(4),
    marginTop: spacing(2),
  },
  listContainer: {
    gap: spacing(3),
    padding: spacing(4),
    paddingTop: Platform.OS === 'android' ? 120 : 20, paddingBottom: 60,
  },
  recordCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing(4),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recordInfo: {
    gap: 4,
  },
  timestampText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  idText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#137333',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    gap: spacing(3),
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});