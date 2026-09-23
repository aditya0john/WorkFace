import { router, useLocalSearchParams } from 'expo-router';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useStaffStore } from '../../store/useStaffStore'; // Adjust path to your store

export default function StaffProfileModal() {
  // 1. Grab the staffId passed from the router query parameters
  const { staffId } = useLocalSearchParams<{ staffId: string }>();

  // 2. Fetch the staff member from your Zustand store
  const staffList = useStaffStore((state) => state.staffList);
  const staff = staffList.find((s) => s.id === staffId);

  if (!staff) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Staff member not found.</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Card Header / Avatar */}
      <View style={styles.profileHeader}>
        {staff.facePhotoUri ? (
          <Image source={{ uri: staff.facePhotoUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={styles.placeholderText}>
              {staff.fullName ? staff.fullName.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        )}
        <Text style={styles.name}>{staff.fullName}</Text>
        <Text style={styles.designation}>
          {staff.designation} {staff.department ? `• ${staff.department}` : ''}
        </Text>
      </View>

      {/* Minimal Report Section */}
      <View style={styles.reportSection}>
        <Text style={styles.sectionTitle}>Employee Details</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Employee ID</Text>
          <Text style={styles.value}>{staff.employeeId}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Department</Text>
          <Text style={styles.value}>{staff.department || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Designation</Text>
          <Text style={styles.value}>{staff.designation || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Phone Number</Text>
          <Text style={styles.value}>{staff.phoneNumber}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email Address</Text>
          <Text style={styles.value}>{staff.email}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#eee',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  placeholderAvatar: {
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#495057',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  designation: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
    textAlign: 'center',
  },
  reportSection: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#adb5bd',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  label: {
    fontSize: 14,
    color: '#495057',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212529',
    textAlign: 'right',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
  backButton: {
    alignSelf: 'center',
    marginTop: 12,
    padding: 10,
  },
  backButtonText: {
    color: '#007aff',
    fontWeight: '600',
  },
});