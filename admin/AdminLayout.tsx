import { useEffect, useState, ReactNode } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { BookOpen, LayoutDashboard, ShoppingBag, Books, Users, LogOut, Bell, ChevronLeft, BookMarked } from 'lucide-react'
import { shipd } from '@/lib/shipd'
import { Skeleton } from '@/components/ui/skeleton'

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: ShoppingBag, label: 'Orders', path: '/admin/orders', badge: true },
  { icon: BookMarked, label: 'Books', path: '/admin/books' },
  { icon: Users, label: 'Customers', path: '/admin/customers' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [verified, setVerified] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    const verify = async () => {
      try {
        const user = await shipd.auth.user()
        if (!user) { navigate('/admin/login'); return }
        const profiles = await shipd.from('profiles').list()
        const profile = profiles.find((p: any) => p.data.userId === user.id)
        if (!profile || profile.data.role !== 'admin') { navigate('/admin/login'); return }
        setVerified(true)

        const orders = await shipd.from('orders').list()
        const pending = orders.filter((o: any) => o.data.status === 'Pending').length
        setPendingCount(pending)
      } catch {
        navigate('/admin/login')
      }
    }
    verify()

    const interval = setInterval(async () => {
      try {
        const orders = await shipd.from('orders').list()
        const pending = orders.filter((o: any) => o.data.status === 'Pending').length
        setPendingCount(pending)
      } catch {}
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleSignOut = async () => {
    await shipd.auth.signOut()
    navigate('/admin/login')
  }

  if (!verified) return (
    <div className="min-h-screen flex items-center justify-center navy-bg">
      <Skeleton className="w-64 h-8" />
    </div>
  )

  return (
    <div className="min-h-screen flex bg-stone-100">
      <aside className="admin-sidebar w-60 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 gold-accent" />
            <span className="font-display text-base font-semibold text-white">VELORA <span className="gold-accent">BOOKS</span></span>
          </Link>
          <span className="text-xs text-gray-500 mt-1 block">Admin Portal</span>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV.map(({ icon: Icon, label, path, badge }) => {
            const active = location.pathname === path
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-amber-600/20 text-amber-300' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {badge && pendingCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                    {pendingCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 pb-6">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors mb-1">
            <ChevronLeft className="w-4 h-4" /> View Store
          </Link>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
