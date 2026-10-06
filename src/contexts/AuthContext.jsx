/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Resolve the current session once on mount.
  useEffect(() => {
    let active = true
    const bootstrap = async () => {
      if (!supabase) {
        setLoading(false)
        return
      }
      const { data: { session } } = await supabase.auth.getSession()
      if (active) setUser(session?.user ?? null)
      if (active) setLoading(false)
    }
    bootstrap()

    let subscription = null
    if (supabase) {
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          const u = session?.user ?? null
          setUser(u)
          if (!u) setProfile(null)
        }
      )
      subscription = sub
    }
    return () => {
      active = false
      subscription?.unsubscribe?.()
    }
  }, [])

  // Load the user's profile (role / kyc / vip) when the user changes.
  useEffect(() => {
    if (!supabase || !user) {
      return
    }
    let cancelled = false
    supabase
      .from('profiles')
      .select('role,kyc_level,is_vip,risk_score,username,avatar_url,full_name')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (!cancelled && !error) setProfile(data)
      })
    return () => { cancelled = true }
  }, [user])

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'

  const value = {
    user,
    profile,
    loading,
    isAdmin,
    signOut: () => supabase?.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
