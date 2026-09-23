import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useStaffStore } from '../../store/useStaffStore'; // Adjust path as needed

const StaffList = () => {
  const staffList = useStaffStore((state) => state.staffList);

  if (staffList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No staff members found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={staffList}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      contentInsetAdjustmentBehavior="automatic"
      renderItem={({ item }) => (
        <View style={styles.card}>
          {/* Avatar / Photo */}
          {item.facePhotoUri ? (
            <Image source={{ uri: item.facePhotoUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Text style={styles.placeholderText}>
                {item.fullName ? item.fullName.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
          )}

          {/* Details */}
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{item.fullName}</Text>
            <Text style={styles.designation}>
              {item.designation} {item.department ? `• ${item.department}` : ''}
            </Text>
            <Text style={styles.subText}>ID: {item.employeeId} | {item.phoneNumber}</Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
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

export default StaffList;