import { calculateCosineSimilarity, getFaceEmbeddingFromBackend } from '@/src/Services/FaceService';
import { useAttendanceStore } from '@/src/store/useAttendanceStore';
import { useAuthStore } from '@/src/store/useAuthStore';
import { colors, spacing, type } from '@/src/theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const MarkAttendance = () => {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const addAttendanceRecord = useAttendanceStore((s) => s.addRecord);

  const [isVerifying, setIsVerifying] = useState(false);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);

  // Extract the logged-in staff member's registered face embedding from auth store
  const loggedInStaffEmbedding = user?.staffData?.faceEmbedding;

  const handleVerifyAndMarkAttendance = async () => {
    if (!loggedInStaffEmbedding || !Array.isArray(loggedInStaffEmbedding) || loggedInStaffEmbedding.length === 0) {
      Alert.alert("Profile Error", "No facial data found for your profile. Please contact an administrator to re-register your face.");
      return;
    }

    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      const locationPermission = await Location.requestForegroundPermissionsAsync();

      let latitude: number | undefined;
      let longitude: number | undefined;
      let fetchedCity = '';


      if (locationPermission.granted) {
        try {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          latitude = loc.coords.latitude;
          longitude = loc.coords.longitude;

          const addressArray = await Location.reverseGeocodeAsync({ latitude, longitude });

          if (addressArray.length > 0) {
            const address = addressArray[0];
            // Fallback to subregion or region if 'city' is null (happens on some Android devices)
            const cityName = address.city || address.subregion || address.district || 'Unknown City';
            const regionName = address.region || '';
            fetchedCity = `${cityName}, ${regionName}`.replace(/,\s*$/, ''); // Remove trailing comma if no region
          }
        } catch (e) {
          console.log("Could not fetch location coordinates:", e);
        }
      }

      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Camera permission is required for face verification.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        cameraType: ImagePicker.CameraType.front,
      });

      if (!result.canceled && result.assets[0].uri) {
        setIsVerifying(true);
        const imageUri = result.assets[0].uri;
        setCapturedUri(imageUri);

        // 1. Get embedding for the live attendance capture via Python Flask backend
        const liveEmbedding = await getFaceEmbeddingFromBackend(imageUri);

        // 2. Direct 1-to-1 Cosine Similarity against the logged-in user's stored embedding
        const similarity = calculateCosineSimilarity(liveEmbedding, loggedInStaffEmbedding);
        const MATCH_THRESHOLD = 0.60; // Adjust between 0.55 - 0.70 based on testing

        // 3. Evaluate match result
        if (similarity >= MATCH_THRESHOLD) {
          const now = new Date();
          addAttendanceRecord({
            employeeId: user?.staffData?.employeeId || 'UNKNOWN',
            fullName: user?.staffData?.fullName || 'Staff Member',
            timestamp: now.toLocaleString(), // e.g., "9/23/2026, 8:53:05 PM"
            confidenceScore: Number((similarity * 100).toFixed(1)),
            longitude: longitude ?? undefined,
            latitude: latitude ?? undefined,
            City: fetchedCity || 'Unknown Location',
            imageUri: imageUri,
          });

          Alert.alert(
            "Attendance Marked! ✅",
            `Welcome back, ${user?.staffData?.fullName}\nMatch Confidence: ${(similarity * 100).toFixed(1)}%`,
            [{ text: "OK", onPress: () => router.push('/staff/AttendanceHistory') }]
          );
        } else {
          Alert.alert(
            "Verification Failed ❌",
            `Face does not match your profile. Match score was ${(similarity * 100).toFixed(1)}%. Please try again.`
          );
        }
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to process face verification.");
    } finally {
      setIsVerifying(false);
    }
  };

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

      <View style={styles.cards}>
        <Ionicons name="scan-outline" size={64} color={colors.primary} />
        <Text style={styles.title}>Facial Attendance Check-In</Text>
        <Text style={styles.subtitle}>
          Position your face within the frame to verify your identity and record your attendance instantly.
        </Text>

        {capturedUri && (
          <Image source={{ uri: capturedUri }} style={styles.previewImage} />
        )}

        <Pressable
          onPress={handleVerifyAndMarkAttendance}
          style={[styles.button, isVerifying && { opacity: 0.7 }]}
          disabled={isVerifying}
        >
          <Text style={[type.button, styles.buttonText]}>
            {isVerifying ? 'Verifying with AI...' : 'Scan Face & Check In'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

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
  cards: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing(6),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing(4),
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  button: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing(2),
  },
  buttonText: {
    color: colors.surface,
    fontSize: 16,
  },
});

export default MarkAttendance;