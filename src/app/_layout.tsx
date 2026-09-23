import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { ActionSheetIOS, Platform, Pressable } from "react-native";

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
            <Pressable
              className="p-2 items-center"
              onPress={() => {
                if (Platform.OS === 'ios') {
                  ActionSheetIOS.showActionSheetWithOptions(
                    {
                      options: ['Cancel', 'Log Out'],
                      destructiveButtonIndex: 1, // Highlights "Log Out" in red
                      cancelButtonIndex: 0,
                    },
                    (buttonIndex) => {
                      if (buttonIndex === 1) {
                        router.replace('/');
                      }
                    }
                  );
                } else {
                  // Fallback for Android if needed (or use standard Alert)
                  router.replace('/');
                }
              }}
            >
              <Ionicons name="log-out-outline" color="gray" size={24} />
            </Pressable>
          ),
        }}
      />

      <Stack.Screen
        name="staff"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerShadowVisible: false,

          headerLeft: () => (
            <Pressable
              className="p-2 items-center"
              onPress={() => {
                if (Platform.OS === 'ios') {
                  ActionSheetIOS.showActionSheetWithOptions(
                    {
                      options: ['Cancel', 'Log Out'],
                      destructiveButtonIndex: 1, // Highlights "Log Out" in red
                      cancelButtonIndex: 0,
                    },
                    (buttonIndex) => {
                      if (buttonIndex === 1) {
                        router.replace('/');
                      }
                    }
                  );
                } else {
                  // Fallback for Android if needed (or use standard Alert)
                  router.replace('/');
                }
              }}
            >
              <Ionicons name="log-out-outline" color="gray" size={24} />
            </Pressable>
          ),
        }}
      />

      <Stack.Screen name="Modal/StaffProfileModal"
        options={{
          title: "Staff Profile",
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
