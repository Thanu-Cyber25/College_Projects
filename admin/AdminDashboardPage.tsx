import { useEffect, useState } from 'react'
import { ShoppingBag, Users, TrendingUp, BookOpen, AlertTriangle, Clock, Database, Server, CheckCircle, Info } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import AdminLayout from './AdminLayout'
import { shipd } from '@/lib/shipd'
import { SAMPLE_BOOKS } from '../../lib/bookData'

const chartData = [
  { month: 'Jul', sales: 4200 }, { month: 'Aug', sales: 6800 }, { month: 'Sep', sales: 5400 },
  { month: 'Oct', sales: 8900 }, { month: 'Nov', sales: 11200 }, { month: 'Dec', sales: 9600 },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ orders: 0, pending: 0, customers: 0, sales: 0 })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const orders = await shipd.from('orders').list()
        const profiles = await shipd.from('profiles').list()
        const customers = profiles.filter((p: any) => p.data.role !== 'admin')
        const pending = orders.filter((o: any) => o.data.status === 'Pending').length
        const sales = orders.reduce((s: number, o: any) => s + (o.data.grandTotal || 0), 0)
        setStats({ orders: orders.length, pending, customers: customers.length, sales })
        setRecentOrders(orders.slice(-5).reverse())
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const lowStock = SAMPLE_BOOKS.filter(b => b.stock < 10)

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Admin. Here is your store overview.</p>
        </div>

        {/* ── Database & Backend Info Panel ── */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-blue-900 text-sm mb-1 flex items-center gap-2">
                Where is the Admin Database?
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-200 text-blue-800 text-xs font-medium">
                  <CheckCircle className="w-3 h-3" /> Live &amp; Connected
                </span>
              </h2>
              <p className="text-blue-800 text-sm leading-relaxed mb-3">
                This admin portal uses <strong>Shipd</strong> as its managed backend database — there is no separate Express, Spring Boot, or SQL server to set up. Every customer order, profile, and status update is stored and retrieved directly via the <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-xs">@/lib/shipd</code> client, which talks to a hosted database on the server side with zero configuration.
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  {
                    icon: ShoppingBag,
                    collection: 'orders',
                    label: 'Orders Collection',
                    desc: 'Every order a customer places is written here via shipd.from("orders").insert(). The admin reads from the same collection in real time.',
                    color: 'text-amber-700',
                    bg: 'bg-amber-50 border-amber-200',
                  },
                  {
                    icon: Users,
                    collection: 'profiles',
                    label: 'Profiles Collection',
                    desc: 'Customer registrations and the admin account are stored here. Rows carry a role field — "admin" vs "customer" — for access control.',
                    color: 'text-purple-700',
                    bg: 'bg-purple-50 border-purple-200',
                  },
                  {
                    icon: Server,
                    collection: 'shipd.auth',
                    label: 'Auth Service',
                    desc: 'Sign-up, sign-in, and session management are handled server-side by shipd.auth. No password is stored in the frontend code.',
                    color: 'text-emerald-700',
                    bg: 'bg-emerald-50 border-emerald-200',
                  },
                ].map(({ icon: Icon, collection, label, desc, color, bg }) => (
                  <div key={collection} className={`rounded-lg border p-3 ${bg}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className={`w-4 h-4 ${color} shrink-0`} />
                      <span className={`text-xs font-semibold ${color}`}>{label}</span>
                    </div>
                    <code className="block text-xs font-mono text-gray-600 bg-white/60 rounded px-1.5 py-0.5 mb-1.5 truncate">
                      shipd.from("{collection}")
                    </code>
                    <p className="text-xs text-gray-600 leading-snug">{desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-start gap-2 text-xs text-blue-700">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  All data is <strong>auto-scoped per app</strong> and isolated from other projects. The Orders and Customers tabs above query these collections live — refresh them at any time to see the latest data.
                </span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-lg" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: TrendingUp, label: 'Total Sales', value: `₹${stats.sales.toLocaleString('en-IN')}`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: ShoppingBag, label: 'Total Orders', value: stats.orders, color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: Clock, label: 'Pending Orders', value: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
              { icon: Users, label: 'Customers', value: stats.customers, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="bg-white rounded-lg border border-stone-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <span className="text-sm text-gray-500">{label}</span>
                </div>
                <p className="font-display text-2xl font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg border border-stone-200 p-6">
            <h2 className="font-display font-semibold text-gray-900 mb-4">Sales Overview (Sample Data)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(43 42% 52%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(43 42% 52%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: any) => [`₹${v}`, 'Sales']} />
                <Area type="monotone" dataKey="sales" stroke="hsl(43 42% 52%)" fill="url(#salesGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <h2 className="font-display font-semibold text-gray-900">Low Stock Alert</h2>
            </div>
            <div className="space-y-3">
              {lowStock.map(book => (
                <div key={book.id} className="flex items-center gap-3">
                  <img src={book.coverUrl} alt={book.title} className="w-8 h-11 object-cover rounded shadow" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                    <p className="text-xs text-orange-600">{book.stock} left</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="font-display font-semibold text-gray-900 mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <div className="flex items-start gap-3 bg-stone-50 border border-stone-200 rounded-lg p-4">
              <Database className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">No orders in the database yet</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  When customers place orders on the storefront, they are written to the <code className="font-mono bg-stone-100 px-1 rounded">orders</code> collection via <code className="font-mono bg-stone-100 px-1 rounded">shipd.from("orders").insert()</code> and will appear here automatically — no manual sync needed.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-left py-2 font-medium text-gray-500">Order ID</th>
                    <th className="text-left py-2 font-medium text-gray-500">Customer</th>
                    <th className="text-left py-2 font-medium text-gray-500">Total</th>
                    <th className="text-left py-2 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {recentOrders.map((o: any) => (
                    <tr key={o.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-2 font-mono text-xs">#{o.id.slice(-8).toUpperCase()}</td>
                      <td className="py-2 font-medium">{o.data.customerName}</td>
                      <td className="py-2 font-semibold">₹{o.data.grandTotal}</td>
                      <td className="py-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          o.data.status === 'Pending' ? 'status-pending' :
                          o.data.status === 'Delivered' ? 'status-delivered' : 'status-confirmed'
                        }`}>{o.data.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
