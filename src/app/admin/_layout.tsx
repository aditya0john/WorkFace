import { Icon, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabsLayout() {

    return (
        <>
            <NativeTabs >
                <NativeTabs.Trigger name="AddStaff" options={{ title: 'Add Staff' }}>
                    <Icon sf={{ default: "house", selected: "house.fill" }} drawable="ic_place" />
                </NativeTabs.Trigger>

                <NativeTabs.Trigger name="StaffList" options={{ title: 'Staff List' }}>
                    <Icon sf={{ default: "square.grid.2x2", selected: "square.grid.2x2.fill" }} drawable="ic_menu" />
                </NativeTabs.Trigger>
            </NativeTabs>
        </>
    );
}
