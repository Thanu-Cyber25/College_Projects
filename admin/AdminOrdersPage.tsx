import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, RefreshCw, ShoppingBag, Clock, TrendingUp, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import AdminLayout from './AdminLayout'
import StatusBadge from '../../components/StatusBadge'
import { shipd } from '@/lib/shipd'

const STATUSES = ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
const PAGE_SIZE = 10

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortDir, setSortDir] = useState<'newest' | 'oldest'>('newest')
  const [page, setPage] = useState(1)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const all = await shipd.from('orders').list()
      setOrders(all)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  useEffect(() => {
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  const filtered = orders
    .filter(o => {
      if (statusFilter !== 'All' && o.data.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return o.id.toLowerCase().includes(q) || o.data.customerName?.toLowerCase().includes(q) || o.data.customerEmail?.toLowerCase().includes(q)
      }
      return true
    })
    .sort((a, b) => {
      const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      return sortDir === 'newest' ? diff : -diff
    })

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalSales = orders.reduce((s, o) => s + (o.data.grandTotal || 0), 0)
  const pending = orders.filter(o => o.data.status === 'Pending').length
  const processing = orders.filter(o => o.data.status === 'Processing').length

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-500 mt-0.5">All customer orders, live from the database</p>
          </div>
          <Button onClick={fetchOrders} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: ShoppingBag, label: 'Total Orders', value: orders.length, color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: Clock, label: 'Pending', value: pending, color: 'text-amber-600', bg: 'bg-amber-50' },
            { icon: Package, label: 'Processing', value: processing, color: 'text-purple-600', bg: 'bg-purple-50' },
            { icon: TrendingUp, label: 'Total Sales', value: `₹${totalSales.toLocaleString('en-IN')}`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-lg border border-stone-200 p-4">
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="font-display text-xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-stone-200 p-4 mb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by order ID or customer…"
              className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="min-w-40">
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1) }}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map(s => <SelectItem key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-36">
            <Select value={sortDir} onValueChange={v => setSortDir(v as any)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 rounded" />)}
            </div>
          ) : paginated.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No orders found</p>
              <p className="text-sm text-gray-400">Orders placed by customers will appear here automatically</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Order ID</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Items</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Total</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Payment</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {paginated.map(order => (
                    <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-medium">#{order.id.slice(-8).toUpperCase()}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{order.data.customerName}</p>
                        <p className="text-xs text-gray-400">{order.data.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3 text-gray-600">{order.data.itemCount}</td>
                      <td className="px-4 py-3 text-right font-semibold font-display">₹{order.data.grandTotal}</td>
                      <td className="px-4 py-3 text-gray-600">{order.data.paymentMethod}</td>
                      <td className="px-4 py-3"><StatusBadge status={order.data.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/admin/orders/${order.id}`} className="text-amber-700 hover:text-amber-900 font-medium text-xs underline underline-offset-2">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pageCount > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-stone-100">
              <p className="text-sm text-gray-500">{filtered.length} orders</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
                <span className="px-3 py-1.5 text-sm text-gray-600">{page} / {pageCount}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={page === pageCount}>Next</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
