import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "transparent" },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" options={{ title: "index", headerShown: false }} />

      <Stack.Screen name="admin" options={{ title: "admin", headerShown: true }} />
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
