import { useGoogleLogin } from '@/src/hooks'
import { useAuthStore } from '@/src/store'
import { Redirect } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'

export default function Index() {
  const { handleGoogleSignIn } = useGoogleLogin()
  const { setIsLoggedIn, isLoggedIn } = useAuthStore()

  const handleLogin = async () => {
    const isSuccess = await handleGoogleSignIn()
    if (isSuccess) {
      setIsLoggedIn(true)
    }
  }

  if (isLoggedIn) {
    return <Redirect href="/Home" />
  }

  return (
    <View className="flex-1 items-center justify-center">
      <TouchableOpacity onPress={handleLogin}>
        <Text>Google Sign In</Text>
      </TouchableOpacity>
    </View>
  )
}
