import { supabase } from '@/src/hooks/useSupabase'
import { useQuery } from '@tanstack/react-query'

interface Version {
  version: string
  min_version: string
  created_at: string
}

export async function getVersion() {
  try {
    const { data } = await supabase.from('version')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    return data
  } catch (error) {
    console.error('getVersion error:', error)
    throw error // 讓 React Query 處理錯誤
  }
}

export function useGetVersion() {
  return useQuery<Version>({
    queryKey: ['version'],
    queryFn: getVersion,
  })
}
