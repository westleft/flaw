import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { useEffect } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import '../assets/styles/global.css'
import { useSupabase } from '../src/hooks/useSupabase'
import { parseTokensFromUrl } from '../src/utils'

/**
 * 初始化 WebBrowser 以支援認證流程
 * 這需要在組件外部調用以確保在整個應用生命週期中生效
 */
WebBrowser.maybeCompleteAuthSession()

/**
 * 認證頁面組件
 * 處理 Google OAuth 登入流程，包括：
 * 1. 啟動 OAuth 流程
 * 2. 處理來自瀏覽器的 redirect
 * 3. 設定 Supabase session
 */
export default function Index() {
  const supabase = useSupabase()
  const redirectUrl = Linking.createURL('/')

  /**
   * 使用 tokens 設定 Supabase session
   * @param tokens - 包含 accessToken 和 refreshToken 的對象
   * @returns Promise<boolean> - 成功返回 true，失敗返回 false
   */
  const setAuthSession = async (tokens: { accessToken: string, refreshToken: string }): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      })

      if (error) {
        Alert.alert('錯誤', error.message)
        return false
      }

      if (data.session) {
        Alert.alert('成功', '登入成功！')
        await WebBrowser.dismissBrowser()
        return true
      }

      return false
    } catch (error) {
      Alert.alert('錯誤', '設定 session 時發生錯誤')
      return false
    }
  }

  /**
   * 處理來自深度連結的認證回調
   * 當用戶完成 OAuth 登入後，瀏覽器會 redirect 回應用
   * 這個函數會解析 URL 中的 tokens 並設定 session
   */
  const handleAuthCallback = async (url: string): Promise<void> => {
    // 檢查 URL 是否包含認證 tokens
    const hasAuthTokens = url.includes('access_token') || url.includes('refresh_token')
    if (!hasAuthTokens) {
      return
    }

    const tokens = parseTokensFromUrl(url)
    if (!tokens) {
      return
    }

    await setAuthSession(tokens)
  }

  /**
   * 啟動 Google OAuth 登入流程
   * 流程：
   * 1. 向 Supabase 請求 OAuth URL
   * 2. 在瀏覽器中打開 OAuth 頁面
   * 3. 用戶完成認證後，瀏覽器會 redirect 回應用
   * 4. handleAuthCallback 會處理後續流程
   */
  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      // 步驟 1: 向 Supabase 請求 OAuth URL
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true, // 手動處理 redirect
        },
      })

      if (error) {
        Alert.alert('錯誤', error.message)
        return
      }

      if (!data.url) {
        Alert.alert('錯誤', '無法取得 OAuth URL')
        return
      }

      // 步驟 2: 在瀏覽器中打開 OAuth 頁面
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl)

      // 步驟 3: 處理認證結果
      if (result.type === 'success' && result.url) {
        await handleAuthCallback(result.url)
        Alert.alert('成功', '登入成功！')
      } else if (result.type === 'cancel') {
        // 用戶取消登入，不需要處理
      } else if (result.type === 'dismiss') {
        // 瀏覽器被關閉，不需要處理
      }
    } catch (error) {
      Alert.alert('錯誤', '登入過程中發生錯誤')
    }
  }

  /**
   * 檢查當前用戶登入狀態
   */
  useEffect(() => {
    const checkUserStatus = async (): Promise<void> => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
          console.log('未登入或取得用戶資訊失敗:', error.message)
        } else {
          console.log('當前用戶:', data.user?.email)
        }
      } catch (error) {
        console.error('檢查用戶狀態時發生錯誤:', error)
      }
    }

    checkUserStatus()
  }, [])

  useEffect(() => {
    // 初始檢查：取得當前 session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('session', session)
    })

    // 監聽認證狀態變化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('change session', session)
    })

    // 清理函數：取消訂閱
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <View className="flex-1 items-center justify-center">
      <TouchableOpacity onPress={handleGoogleSignIn}>
        <Text>Google Sign In</Text>
      </TouchableOpacity>
    </View>
  )
}
