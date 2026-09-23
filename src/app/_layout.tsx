import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function RootLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "transparent" },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" options={{ title: "index", headerShown: false }} />

      <Stack.Screen
        name="admin"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerShadowVisible: false,

          headerLeft: () => (
            <Pressable className="p-2 items-center" onPress={() => router.replace("/")}>
              <Ionicons name="arrow-back" color="gray" size={24} />
            </Pressable>
          ),

        }}
      />

      <Stack.Screen name="staff" options={{ title: "staff", headerShown: true }} />

      <Stack.Screen name="Modal/CameraCaptureModal"
        options={{
          title: "Camera Capture",
          headerShown: false,
          gestureDirection: "vertical",
          presentation: "formSheet",
          animation: "slide_from_bottom",
          sheetAllowedDetents: [0.8],
          sheetCornerRadius: 42,
        }} />
    </Stack>
  )
}
