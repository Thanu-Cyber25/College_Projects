import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Shield, Server } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { shipd } from '@/lib/shipd'
import { toast } from '@/components/ui/toast'

const ADMIN_EMAIL = 'admin@velorabooks.in'
const ADMIN_PASSWORD = 'VeloraAdmin2024'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await shipd.auth.signIn(form.email, form.password)
      const user = await shipd.auth.user()
      if (!user) throw new Error('Sign in failed')
      const profiles = await shipd.from('profiles').list()
      const profile = profiles.find((p: any) => p.data.userId === user.id)
      if (!profile || profile.data.role !== 'admin') {
        await shipd.auth.signOut()
        throw new Error('Access denied. This account does not have admin privileges.')
      }
      toast.success('Welcome, Admin!')
      navigate('/admin/dashboard')
    } catch (err: any) {
      setError(err.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen navy-bg flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-2 mb-8">
        <BookOpen className="w-7 h-7 gold-accent" />
        <span className="font-display text-2xl font-semibold text-white">VELORA <span className="gold-accent">BOOKS</span></span>
      </div>

      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-amber-700" />
          <h1 className="font-display text-2xl font-bold text-gray-900">Admin Login</h1>
        </div>
        <p className="text-sm text-gray-500 mb-6">Secure access for store administrators only</p>

        {/* Backend info banner */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 text-xs text-blue-800 flex gap-2">
          <Server className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
          <div>
            <strong>No separate backend folder.</strong> This app uses{' '}
            <code className="bg-blue-100 px-1 rounded font-mono">@/lib/shipd</code> as its
            backend — a hosted service that handles auth, database, storage, AI, email and
            payments server-side with no API keys or Express/Spring server required. All data
            calls (<code className="bg-blue-100 px-1 rounded font-mono">shipd.from()</code>,{' '}
            <code className="bg-blue-100 px-1 rounded font-mono">shipd.auth.*</code>) go
            directly to that managed backend from the frontend code.
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4 text-xs text-amber-800">
          <strong>Demo credentials:</strong> {ADMIN_EMAIL} / {ADMIN_PASSWORD}
          <br />First time?{' '}
          <button
            className="underline font-medium"
            onClick={async () => {
              try {
                await shipd.auth.signUp(ADMIN_EMAIL, ADMIN_PASSWORD)
                const user = await shipd.auth.user()
                if (user) {
                  await shipd.from('profiles').insert({ userId: user.id, name: 'Store Admin', role: 'admin', email: ADMIN_EMAIL })
                  await shipd.auth.signOut()
                  toast.success('Admin account created! Now sign in.')
                }
              } catch {
                toast('Admin account already exists — just sign in.')
              }
            }}
          >
            Click here to create admin account
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required placeholder={ADMIN_EMAIL} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full navy-bg hover:opacity-90 text-white border-0 py-2.5">
            {loading ? 'Authenticating…' : 'Sign In to Admin'}
          </Button>
        </form>
      </div>
    </div>
  )
}
