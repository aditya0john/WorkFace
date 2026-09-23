import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { useCaptureStore } from '../../store/useCaptureStore';
import { useStaffStore } from '../../store/useStaffStore';
import { colors, spacing, type } from '../../theme/tokens';
import type { Staff } from '../../types/type';

interface FormState {
    employeeId: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    department: string;
    designation: string;
}

const EMPTY_FORM: FormState = {
    employeeId: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    department: '',
    designation: '',
};

export default function AddStaffScreen() {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [error, setError] = useState<string | null>(null);

    const addStaff = useStaffStore((s) => s.addStaff);
    const capturedUri = useCaptureStore((s) => s.capturedUri);
    const setCapturedUri = useCaptureStore((s) => s.setCapturedUri);
    const [permission, requestPermission] = ImagePicker.useCameraPermissions();

    const updateField = (key: keyof FormState) => (value: string) => {
        setForm((f) => ({ ...f, [key]: value }));
        if (error) setError(null);
    };

    const handleTakePhoto = useCallback(() => {
        router.push('/admin/capture-photo');
    }, []);

    const handleAddStaff = useCallback(() => {
        const trimmed: FormState = {
            employeeId: form.employeeId.trim(),
            fullName: form.fullName.trim(),
            phoneNumber: form.phoneNumber.trim(),
            email: form.email.trim(),
            department: form.department.trim(),
            designation: form.designation.trim(),
        };

        const missing = Object.entries(trimmed).some(([, value]) => value.length === 0);
        if (missing) {
            setError('Please fill in all fields before adding the staff member.');
            return;
        }
        if (!capturedUri) {
            setError('Please capture a face photo before adding the staff member.');
            return;
        }

        const staff: Staff = {
            id: `${Date.now()}`,
            ...trimmed,
            facePhotoUri: capturedUri,
        };

        addStaff(staff);
        setForm(EMPTY_FORM);
        setCapturedUri(null);
        setError(null);
        router.push('/admin/StaffList');
    }, [form, capturedUri, addStaff, setCapturedUri]);


    const handleCapturePress = async () => {
    // 1. Check if permission is granted; if not, request it
    if (!permission || !permission.granted) {
      const permissionResult = await requestPermission();
      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "Camera access is required to take a photo.");
        return;
      }
    }

    // 2. Launch the native camera app UI
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio works great for face photos
      quality: 0.8,
      cameraType: ImagePicker.CameraType.front, // Use the front camera for face photos
    });

    // 3. Save the image URI if the user took a photo
    if (!result.canceled) {
      setCapturedUri(result.assets[0].uri);
    }
  };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentInsetAdjustmentBehavior='automatic'
                style={styles.flex}
                contentContainerStyle={{ flexGrow: 1, gap: 20, padding: 14, paddingBottom: 40, paddingTop: Platform.OS === 'android' ? 80 : 0, }}
                keyboardShouldPersistTaps="handled"
            >
                <Field label="EMPLOYEE ID" value={form.employeeId} onChangeText={updateField('employeeId')} placeholder="e.g. STAFF001" />
                <Field label="FULL NAME" value={form.fullName} onChangeText={updateField('fullName')} placeholder="e.g. Jordan Lee" />
                <Field label="PHONE NUMBER" value={form.phoneNumber} onChangeText={updateField('phoneNumber')} placeholder="e.g. 555-0100" keyboardType="phone-pad" />
                <Field label="EMAIL" value={form.email} onChangeText={updateField('email')} placeholder="e.g. jordan@company.com" keyboardType="email-address" autoCapitalize="none" />
                <Field label="DEPARTMENT" value={form.department} onChangeText={updateField('department')} placeholder="e.g. Operations" />
                <Field label="DESIGNATION" value={form.designation} onChangeText={updateField('designation')} placeholder="e.g. Warehouse Associate" />

                <View style={styles.field}>
                    <Text style={styles.label}>FACE PHOTO</Text>
                    <Pressable onPress={handleCapturePress} style={styles.photoPressable}>
                        {capturedUri ? (
                            <Image source={{ uri: capturedUri }} style={styles.photoPreview} />
                        ) : (
                            <View style={styles.photoPlaceholder}>
                                <Text style={styles.photoPlaceholderText}>Tap to capture face photo</Text>
                            </View>
                        )}
                    </Pressable>
                    {/* TODO: wire this pressable into the app's existing camera modal
              (activated via router.push to the shared camera route) once that
              flow is finalized — capture-photo.tsx above is a local stand-in. */}
                </View>

                {error ? <Text style={[type.error, styles.errorText]}>{error}</Text> : null}

                <Pressable onPress={handleAddStaff} style={styles.submitButton}>
                    <Text style={[type.button, styles.submitText]}>Add Staff</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function Field({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType,
    autoCapitalize,
}: {
    label: string;
    value: string;
    onChangeText: (v: string) => void;
    placeholder: string;
    keyboardType?: 'default' | 'phone-pad' | 'email-address';
    autoCapitalize?: 'none' | 'sentences' | 'words';
}) {
    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
                keyboardType={keyboardType ?? 'default'}
                autoCapitalize={autoCapitalize ?? 'words'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    field: {
        gap: spacing(2),
    },
    label: {
        ...type.label,
        color: colors.textSecondary,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: spacing(3.5),
        backgroundColor: colors.surface,
        fontSize: 16,
        color: colors.textPrimary,
    },
    photoPressable: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    photoPlaceholder: {
        height: 160,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.border,
        borderRadius: 12,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoPlaceholderText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    photoPreview: {
        height: 340,
        borderRadius: 12,
        backgroundColor: colors.border,
    },
    errorText: {
        color: colors.danger,
    },
    submitButton: {
        height: 52,
        borderRadius: 10,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing(2),
    },
    submitText: {
        color: colors.surface,
    },
});