import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import store from '@/store';
import { restoreSession } from '@/store/authSlice';
import { getUser } from '@/services/auth.service';

export default function Index() {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const bootstrap = async () => {
            const user = await getUser();

            if (user) {
                store.dispatch(restoreSession(user));
                setAuthenticated(true);
            }

            setLoading(false);
        };

        bootstrap();
    }, []);

    if (loading) return null;

    return authenticated ? (
        <Redirect href="/(tabs)/home" />
    ) : (
        <Redirect href="/(auth)/login" />
    );
}
