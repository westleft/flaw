import { Stack } from 'expo-router'
import { queryClient } from '@/src/api'
import { QueryClientProvider } from '@tanstack/react-query'

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/Login" options={{ headerShown: false }} />
        <Stack.Screen name="Home" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  )
}
