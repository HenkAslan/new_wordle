import Logo from '@/assets/images/nyt-logo.svg';
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import {
  FrankRuhlLibre_500Medium,
  FrankRuhlLibre_800ExtraBold,
  FrankRuhlLibre_900Black,
} from '@expo-google-fonts/frank-ruhl-libre';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Appearance, Platform, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log('No values stored under key: ' + key);
      }
      return item;
    } catch (error) {
      console.error('SecureStore get item error: ', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  );
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const [dark, setDark] = useState(false);

  useEffect(() => {
    const loadDarkMode = async () => {
      const storedDarkMode = await SecureStore.getItemAsync('dark-mode');
      if (storedDarkMode !== null) {
        setDark(JSON.parse(storedDarkMode));
      }
    };
    loadDarkMode();
  }, []);

  const toggleDarkMode = async () => {
    const newDarkMode = !dark;
    setDark(newDarkMode);
    await SecureStore.setItemAsync('dark-mode', JSON.stringify(newDarkMode));
    if (Platform.OS !== 'web') {
      Appearance.setColorScheme(newDarkMode ? 'dark' : 'light');
    }
  };

  let [fontsLoaded] = useFonts({
    FrankRuhlLibre_800ExtraBold,
    FrankRuhlLibre_500Medium,
    FrankRuhlLibre_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ThemeProvider value={dark ? DarkTheme : DefaultTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <Stack>
                <Stack.Screen
                  name="game"
                  options={{
                    title: 'Wordle',
                    headerTintColor: dark ? '#000' : '#fff',
                    headerTitleStyle: {
                      fontSize: 26,
                      fontFamily: 'FrankRuhlLibre_800ExtraBold',
                    },
                    headerStyle: {
                      backgroundColor:dark?'#fff':'#000',
                    },
                  }}
                />
                <Stack.Screen
                  name="end"
                  options={{
                    headerShown: false,
                    presentation: 'fullScreenModal',
                    headerTintColor: dark ? '#fff' : '#000',
                    headerShadowVisible: false,
                  }}
                />
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                  name="login"
                  options={{
                    presentation: 'modal',
                    headerShadowVisible: false,
                    headerTitle: () => <Logo width={160} height={60} />,
                    headerTintColor:dark?'#fff':'#000',
                    
                  }}
                />
              </Stack>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
