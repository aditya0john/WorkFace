import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabsLayout() {

    return (
        <>
            <NativeTabs >
                <NativeTabs.Trigger name="MarkAttendance">
                    <NativeTabs.Trigger.Icon
                        sf={{
                            default: "plus.circle",
                            selected: "plus.circle.fill",
                        }}
                        drawable="ic_menu"
                    />

                </NativeTabs.Trigger>

                <NativeTabs.Trigger name="AttendanceHistory">
                    <NativeTabs.Trigger.Icon
                        sf={{
                            default: "person.2",
                            selected: "person.2.fill",
                        }}
                        drawable="ic_people"
                    />
                </NativeTabs.Trigger>
            </NativeTabs>
        </>
    );
}
