import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Provider } from 'react-redux';
import store from '@/store/index';
import { useEffect, useState } from 'react';
import { getUser } from '@/services/auth.service';
import { restoreSession } from '@/store/authSlice';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<"(auth)" | "(tabs)">("(auth)");

  useEffect(() => {
    const bootstrap = async () => {
      const user = await getUser();

      if (user) {
        store.dispatch(restoreSession(user));
        setInitialRoute("(tabs)");
      } else {
        setInitialRoute("(auth)");
      }
      setLoading(false);
    };

    bootstrap();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <Stack initialRouteName={initialRoute}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </Provider>
    </ThemeProvider>
  );
}
