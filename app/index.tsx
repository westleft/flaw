import WelcomeScreen from '@/src/components/auth/Welcome'
import { useAuthStateChange } from '@/src/hooks/auth/useAuth'
import { useAuthStore } from '@/src/store'
import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import '../assets/styles/global.css'

export default function Index() {
  const { isLoggedIn } = useAuthStore()
  const [canNavigate, setCanNavigate] = useState(false)

  useAuthStateChange()

  // 當登入狀態「確定」後，再等 3 秒才允許跳頁
  useEffect(() => {
    if (isLoggedIn === 'loading') {
      return
    }

    const timer = setTimeout(() => {
      setCanNavigate(true)
    }, 30)

    return () => clearTimeout(timer)
  }, [isLoggedIn])

  if (isLoggedIn === 'loading' || !canNavigate) {
    return <WelcomeScreen />
  }

  return (
    <>
      {isLoggedIn
        ? <Redirect href="/Home" />
        : <Redirect href="/auth/Login" />}
    </>
  )
}
