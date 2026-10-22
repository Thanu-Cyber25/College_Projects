import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { shipd } from '@/lib/shipd'

interface AuthUser {
  id: string
  email: string
  name?: string
  role?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const u = await shipd.auth.user()
      if (u) {
        const profiles = await shipd.from('profiles').list()
        const profile = profiles.find((p: any) => p.data.userId === u.id)
        setUser({
          id: u.id,
          email: u.email,
          name: profile?.data?.name || u.email.split('@')[0],
          role: profile?.data?.role || 'customer',
        })
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refreshUser() }, [])

  const signIn = async (email: string, password: string) => {
    await shipd.auth.signIn(email, password)
    await refreshUser()
  }

  const signUp = async (email: string, password: string, name: string) => {
    await shipd.auth.signUp(email, password)
    await refreshUser()
    const u = await shipd.auth.user()
    if (u) {
      await shipd.from('profiles').insert({ userId: u.id, name, role: 'customer', email })
    }
  }

  const signOut = async () => {
    await shipd.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
