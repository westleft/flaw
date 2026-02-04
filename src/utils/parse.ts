// 解析 URL 中的 token（支援 query string 和 hash fragment）
export function parseTokensFromUrl(url: string) {
  try {
    // 處理 hash fragment (#access_token=...)
    if (url.includes('#access_token')) {
      const hash = url.split('#')[1]
      const params = new URLSearchParams(hash)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      if (accessToken && refreshToken) {
        return { accessToken, refreshToken }
      }
    }

    // 處理 query string (?access_token=...)
    if (url.includes('?access_token') || url.includes('&access_token')) {
      const urlObj = new URL(url)
      const accessToken = urlObj.searchParams.get('access_token')
      const refreshToken = urlObj.searchParams.get('refresh_token')
      if (accessToken && refreshToken) {
        return { accessToken, refreshToken }
      }
    }

    // 備用：正則表達式匹配
    const match = url.match(/[#&?]access_token=([^&]+).*[#&?]refresh_token=([^&]+)/)
    if (match) {
      return {
        accessToken: decodeURIComponent(match[1]),
        refreshToken: decodeURIComponent(match[2]),
      }
    }
  } catch (error) {
    console.error('解析 URL 錯誤:', error)
  }
  return null
}
