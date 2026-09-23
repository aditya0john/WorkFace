import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Pressable onPress={() => router.push("/Modal/CameraCaptureModal")} style={StyleSheet.absoluteFill}>
        <Text style={{ color: "black", fontSize: 20, textAlign: "center", marginTop: 50 }}>Open Camera</Text>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
