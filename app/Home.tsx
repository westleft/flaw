import UpdateModal from '@/src/components/modals/VersionUpdate'
import { useSupabase, useVersion } from '@/src/hooks'
import { Text, TouchableOpacity, View } from 'react-native'

export default function Home() {
  const { updateInfo } = useVersion()
  const supabase = useSupabase()

  const logout = async () => {
    await supabase.auth.signOut()
  }

  // 如果有需要更新，則顯示更新彈窗
  if (updateInfo.forceUpdate || updateInfo.optionalUpdate) {
    return <UpdateModal updateInfo={updateInfo} />
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
