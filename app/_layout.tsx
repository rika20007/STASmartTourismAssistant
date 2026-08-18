// Powered by OnSpace.AI
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AlertProvider } from '@/template';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WalletProvider } from '@/contexts/WalletContext';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
          <LocaleProvider>
            <WalletProvider>
              <StatusBar style="auto" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.background },
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                  name="topup"
                  options={{ presentation: 'modal', headerShown: false }}
                />
                <Stack.Screen
                  name="pay"
                  options={{ presentation: 'modal', headerShown: false }}
                />
                <Stack.Screen name="partner/[id]" options={{ headerShown: false }} />
              </Stack>
            </WalletProvider>
          </LocaleProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
