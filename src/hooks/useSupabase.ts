import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'
import { Platform } from 'react-native'

export function useSupabase() {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  })

  return supabase
}
