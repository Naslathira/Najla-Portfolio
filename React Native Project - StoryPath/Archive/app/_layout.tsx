
import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useColorScheme } from 'react-native'
import { TamaguiProvider } from 'tamagui'


import { tamaguiConfig } from '../tamagui.config'

export default function RootLayout() {
  const colorScheme = useColorScheme()


  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(drawer)" options={{ headerShown: false, title: 'Home' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </TamaguiProvider >
  );
}