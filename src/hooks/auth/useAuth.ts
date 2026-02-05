import { useAuthStore } from '@/src/store'
import { useEffect } from 'react'
import { useSupabase } from '../useSupabase'

function useAuthStateChange() {
  const supabase = useSupabase()
  const { setIsLoggedIn } = useAuthStore()

  useEffect(() => {
    // 一開始先檢查目前 session，避免一直是 'loading'
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })

    // 之後監聽變化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    // 清理，避免重複訂閱
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, setIsLoggedIn])
}

export { useAuthStateChange }
