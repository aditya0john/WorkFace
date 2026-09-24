import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { validateCredentials } from '../constants/DummyAuth';
import { colors, spacing, type } from '../theme/tokens';

export default function SignInScreen() {
    const [employeeId, setEmployeeId] = useState('ADMIN');
    const [password, setPassword] = useState('password');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = employeeId.trim().length > 0 && password.length > 0;

    const handleSignIn = useCallback(() => {
        if (!canSubmit) return;

        const user = validateCredentials(employeeId, password);
        if (!user) {
            setError('Invalid employee ID or password.');
            return;
        }

        setError(null);
        if (user.role === 'admin') {
            router.replace('/admin');
        } else {
            router.replace('/staff');
        }
    }, [canSubmit, employeeId, password]);

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: spacing(2)}}>
                        <View style={styles.mark} />
                        <Text style={type.title}>WorkFace</Text>
                    </View>
                    <Text style={[type.subtitle, styles.subtitle]}>
                        Sign in with your employee ID to continue
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.field}>
                        <Text style={styles.label}>EMPLOYEE ID</Text>
                        <TextInput
                            value={employeeId}
                            onChangeText={(v) => {
                                setEmployeeId(v);
                                if (error) setError(null);
                            }}
                            placeholder="e.g. ADMIN001"
                            placeholderTextColor={colors.textSecondary}
                            autoCapitalize="none"
                            autoCorrect={false}
                            style={styles.input}
                            returnKeyType="next"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>PASSWORD</Text>
                        <View style={styles.passwordRow}>
                            <TextInput
                                value={password}
                                onChangeText={(v) => {
                                    setPassword(v);
                                    if (error) setError(null);
                                }}
                                placeholder="Password"
                                placeholderTextColor={colors.textSecondary}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={[styles.input, styles.passwordInput]}
                                returnKeyType="done"
                                onSubmitEditing={handleSignIn}
                            />
                            <Pressable
                                onPress={() => setShowPassword((v) => !v)}
                                hitSlop={10}
                                style={styles.toggle}
                            >
                                <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
                            </Pressable>
                        </View>
                    </View>

                    {error ? <Text style={[type.error, styles.errorText]}>{error}</Text> : null}

                    <Pressable
                        onPress={handleSignIn}
                        disabled={!canSubmit}
                        style={({ pressed }) => [
                            styles.submitButton,
                            !canSubmit && styles.submitButtonDisabled,
                            pressed && canSubmit && styles.submitButtonPressed,
                        ]}
                    >
                        <Text style={[type.button, styles.submitText]}>Sign in</Text>
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: spacing(6),
    },
    header: {
        marginBottom: spacing(10),
    },
    mark: {
        width: 30,
        height: 30,
        borderRadius: 5,
        backgroundColor: colors.primary,
    },
    subtitle: {
        color: colors.textSecondary,
        marginTop: spacing(1),
    },
    form: {
        gap: spacing(5),
    },
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
    passwordRow: {
        position: 'relative',
        justifyContent: 'center',
    },
    passwordInput: {
        paddingRight: spacing(14),
    },
    toggle: {
        position: 'absolute',
        right: spacing(3.5),
    },
    toggleText: {
        ...type.label,
        color: colors.accent,
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
    submitButtonPressed: {
        opacity: 0.9,
    },
    submitButtonDisabled: {
        backgroundColor: colors.disabled,
    },
    submitText: {
        color: colors.surface,
    },
});