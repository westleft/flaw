import { useState } from 'react'
import { Linking, Modal, Text, TouchableOpacity, View } from 'react-native'

interface UpdateModalProps {
  updateInfo: {
    forceUpdate: boolean
    optionalUpdate: boolean
  }
}

function UpdateModal({ updateInfo }: UpdateModalProps) {
  const [visible, setVisible] = useState(true)

  const handleStoreUpdate = () => {
    Linking.openURL('https://www.google.com')
  }

  const closeModal = () => {
    setVisible(false)
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View className="bg-black/50 flex-1 items-center justify-center">
        <View className="bg-white p-4 rounded-lg">
          <Text className="text-2xl font-bold text-red-400">
            有新版本
          </Text>
          <View className="flex-row gap-2">
            {
              updateInfo.optionalUpdate && (
                <TouchableOpacity onPress={closeModal}>
                  <Text>稍後再說</Text>
                </TouchableOpacity>
              )
            }
            <TouchableOpacity onPress={handleStoreUpdate}>
              <Text>前往更新</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default UpdateModal
