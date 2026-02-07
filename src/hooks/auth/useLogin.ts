import { parseTokensFromUrl } from '@/src/utils'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { Alert } from 'react-native'
import { supabase } from '../useSupabase'

function useGoogleLogin() {
  /**
   * 初始化 WebBrowser 以支援認證流程
   * 這需要在組件外部調用以確保在整個應用生命週期中生效
   */
  WebBrowser.maybeCompleteAuthSession()

  const redirectUrl = Linking.createURL('/')

  /**
   * 使用 tokens 設定 Supabase session
   * @param tokens - 包含 accessToken 和 refreshToken 的對象
   * @param tokens.accessToken - 用於授權的 access token
   * @param tokens.refreshToken - 用於刷新 session 的 refresh token
   * @returns Promise<boolean> - 成功返回 true，失敗返回 false
   */
  const setAuthSession = async (tokens: { accessToken: string, refreshToken: string }): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.setSession({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      })
      if (error) {
        return false
      }
      return true
    } catch (e) {
      Alert.alert('錯誤', '設定 session 時發生錯誤')
      return false
    }
  }
  /**
   * 處理來自深度連結的認證回調
   * 當用戶完成 OAuth 登入後，瀏覽器會 redirect 回應用
   * 這個函數會解析 URL 中的 tokens 並設定 session
   */
  const handleAuthCallback = async (url: string): Promise<boolean> => {
    // 檢查 URL 是否包含認證 tokens
    const hasAuthTokens = url.includes('access_token') || url.includes('refresh_token')
    if (!hasAuthTokens) {
      return false
    }

    const tokens = parseTokensFromUrl(url)
    if (!tokens) {
      return false
    }

    return await setAuthSession(tokens)
  }

  /**
   * 啟動 Google OAuth 登入流程
   * 流程：
   * 1. 向 Supabase 請求 OAuth URL
   * 2. 在瀏覽器中打開 OAuth 頁面
   * 3. 用戶完成認證後，瀏覽器會 redirect 回應用
   * 4. handleAuthCallback 會處理後續流程
   */
  const handleGoogleSignIn = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      })

      if (error || !data.url) {
        return false
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl)

      if (result.type === 'success' && result.url) {
        const isSuccess = await handleAuthCallback(result.url)
        return isSuccess
      }

      return false
    } catch (e) {
      Alert.alert('錯誤', '登入過程中發生錯誤')
      return false
    }
  }

  return {
    handleGoogleSignIn,
  }
}

export { useGoogleLogin }
