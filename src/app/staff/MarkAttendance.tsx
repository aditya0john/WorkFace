import { useAuthStore } from '@/src/store/useAuthStore';
import { Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

const MarkAttendance = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior='automatic'
      contentContainerStyle={{ gap: 20, padding: 14, paddingBottom: 40, paddingTop: Platform.OS === 'android' ? 120 : 40, }}>
        
      <View style={styles.card}>
        {/* Avatar / Photo */}
        {user?.staffData?.facePhotoUri ? (
          <Image source={{ uri: user?.staffData?.facePhotoUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={styles.placeholderText}>
              {user?.staffData?.fullName ? user.staffData.fullName.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        )}

        {/* Details */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{user?.staffData?.fullName}</Text>
          <Text style={styles.designation}>
            {user?.staffData?.designation} {user?.staffData?.department ? `• ${user.staffData.department}` : ''}
          </Text>
          <Text style={styles.subText}>ID: {user?.staffData?.employeeId} | {user?.staffData?.phoneNumber}</Text>
        </View>
      </View>

      <Text>MarkAttendance</Text>
    </ScrollView >
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 50,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  placeholderAvatar: {
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontWeight: '600',
    fontSize: 18,
    color: '#555',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  designation: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  subText: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
  },
});


export default MarkAttendance