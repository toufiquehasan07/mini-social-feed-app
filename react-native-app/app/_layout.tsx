import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Provider } from 'react-redux';
import store from '@/store/index';

export const unstable_settings = {
    anchor: '(tabs)',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
            <Provider store={store}>
                <Stack>
                    <Stack.Screen
                        name="(auth)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="create"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="comments/[id]"
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack>
                <StatusBar style="auto" />
            </Provider>
        </ThemeProvider>
    );
}
