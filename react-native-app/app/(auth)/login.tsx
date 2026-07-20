import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import { Colors, FontSize, Spacing } from '../../constants/theme';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, isLoading } from '@/store/authSlice';

const LoginScreen = () => {
    const dispatch = useDispatch<any>();
    const router = useRouter();
    const loading = useSelector(isLoading);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const canSubmit = !!email && !!password && !loading;

    const handleLogin = async () => {
        if (!canSubmit) return;

        try {
            await dispatch(
                loginThunk({
                    email,
                    password,
                }),
            ).unwrap();

            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Login Failed', error?.message || 'Something went wrong.');
        }
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.brandBlock}>
                        <Text style={styles.brandTitle}>SocialFeed</Text>
                        <Text style={styles.brandSubtitle}>
                            Mini Social Media Feed App
                        </Text>
                    </View>

                    <Text style={styles.heading}>Welcome back</Text>

                    <View style={{ gap: Spacing.lg }}>
                        <FormField
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="your@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <FormField
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            secureTextEntry
                            onSubmitEditing={handleLogin}
                        />
                    </View>

                    <PrimaryButton
                        label={loading ? 'Signing in…' : 'Sign In'}
                        onPress={handleLogin}
                        disabled={!canSubmit}
                        loading={loading}
                        style={{ marginTop: Spacing.xxl }}
                    />

                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>
                            Don't have an account?{' '}
                        </Text>
                        <Pressable
                            onPress={() => router.push('/(auth)/signup')}
                        >
                            <Text style={styles.footerLink}>Sign Up</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.surface,
    },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: Spacing.xxl,
        paddingBottom: Spacing.xxl,
    },
    brandBlock: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 40,
    },
    brandIcon: {
        width: 64,
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    brandTitle: {
        fontSize: FontSize.hero,
        fontWeight: '700',
        color: Colors.text,
    },
    brandSubtitle: {
        fontSize: FontSize.md,
        color: Colors.text3,
        marginTop: 4,
    },
    heading: {
        fontSize: FontSize.title,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: Spacing.xl,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        marginVertical: Spacing.xl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.divider,
    },
    dividerText: {
        fontSize: FontSize.sm,
        color: Colors.text4,
    },
    socialRow: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    socialBtn: {
        flex: 1,
        paddingVertical: Spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
        alignItems: 'center',
    },
    socialText: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.text2,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingTop: Spacing.xxl,
    },
    footerText: {
        fontSize: FontSize.md,
        color: Colors.text3,
    },
    footerLink: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.primary,
    },
});
