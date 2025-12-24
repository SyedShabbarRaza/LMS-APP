import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import 'react-native-reanimated';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) return <Text>Loading fonts...</Text>;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(routes)/onboarding/index" options={{ headerShown: false }} />
      <Stack.Screen name="(routes)/notification/index" options={{ headerShown: false }} />
      <Stack.Screen name="(routes)/settings/index" options={{ headerShown: false }} />
      <Stack.Screen name="(routes)/support-center/index" options={{ headerShown: false }} />
      <Stack.Screen name="(routes)/faq/index" options={{ headerShown: false }} />
      <Stack.Screen name="(routes)/my-tickets/index" options={{ headerShown: false }} />
    </Stack>
  );
}
