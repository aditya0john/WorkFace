import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, type } from '../../theme/tokens';

export default function StaffScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={type.title}>Staff</Text>

      <Pressable onPress={() => router.push("/Modal/CameraCaptureModal")}>
        <Text style={{ color: "black", fontSize: 20, textAlign: "center", marginTop: 50 }}>Open Camera</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});