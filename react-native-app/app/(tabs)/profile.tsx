import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Divider, List, Text } from 'react-native-paper';

import Avatar from '@/components/Avatar';
import { Colors, Spacing } from '@/constants/theme';
import { logout as logoutAction, selectUser } from '@/store/authSlice';
import { logout } from '@/services/auth.service';

export default function ProfileScreen() {
    const router = useRouter();
    const dispatch = useDispatch<any>();

    const user = useSelector(selectUser);

    if (!user) return null;

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await logout();
                    dispatch(logoutAction());
                    router.replace('/(auth)/login');
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Avatar user={user} size="lg" />
            <Text variant="headlineSmall" style={styles.name}>
                {user.name}
            </Text>
            <Text variant="bodyMedium" style={styles.username}>
                {user.username}
            </Text>
            <Card mode="contained" style={styles.card}>
                <List.Item
                    title="Name"
                    description={user.name}
                    left={(props) => (
                        <List.Icon {...props} icon="account-outline" />
                    )}
                />
                <Divider />
                <List.Item
                    title="Username"
                    description={`${user.username}`}
                    left={(props) => <List.Icon {...props} icon="at" />}
                />
                <Divider />
                <List.Item
                    title="Email"
                    description={user.email}
                    left={(props) => (
                        <List.Icon {...props} icon="email-outline" />
                    )}
                />
            </Card>
            <Button
                mode="contained"
                buttonColor={Colors.likeRed}
                style={styles.logout}
                onPress={handleLogout}
            >
                Logout
            </Button>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.phoneBg,
        padding: Spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        marginTop: 16,
        fontWeight: '700',
    },
    username: {
        color: Colors.text3,
        marginTop: 4,
        marginBottom: 28,
    },
    card: {
        width: '100%',
        borderRadius: 14,
        backgroundColor: Colors.surface,
    },
    logout: {
        width: '100%',
        marginTop: 28,
        borderRadius: 12,
    },
});
