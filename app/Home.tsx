import { useSupabase } from '@/src/hooks'
import { Text, TouchableOpacity, View } from 'react-native'

export default function Home() {
  const supabase = useSupabase()

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Home</Text>
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}
