import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function RootLayout() {
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
          headerTransparent: true,
          headerShadowVisible: false,


          headerTitle: () => (
            <View className='gap-2 items-center justify-center px-2'>
              <Text style={{ color: "black" }} className="text-xs font-bold capitalize">7-10 mins</Text>
            </View>
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
