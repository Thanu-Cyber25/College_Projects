import { useEffect, useState } from 'react'
import { Users, Mail, Calendar } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import AdminLayout from './AdminLayout'
import { shipd } from '@/lib/shipd'

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const profiles = await shipd.from('profiles').list()
        const allOrders = await shipd.from('orders').list()
        setCustomers(profiles.filter((p: any) => p.data.role !== 'admin'))
        setOrders(allOrders)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const filtered = customers.filter(c =>
    c.data.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.data.email?.toLowerCase().includes(search.toLowerCase())
  )

  const getCustomerOrders = (userId: string) => orders.filter(o => o.data.userId === userId)
  const getCustomerTotal = (userId: string) => getCustomerOrders(userId).reduce((s: number, o: any) => s + (o.data.grandTotal || 0), 0)

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-500 mt-0.5">{customers.length} registered customers</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search customers…"
              className="w-72 px-3 py-2 border border-stone-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-16 rounded" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500">No customers yet</p>
              <p className="text-sm text-gray-400">Customers who register will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Orders</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Total Spent</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filtered.map(customer => {
                    const customerOrders = getCustomerOrders(customer.data.userId)
                    const total = getCustomerTotal(customer.data.userId)
                    return (
                      <tr key={customer.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full gold-bg flex items-center justify-center text-white text-xs font-bold">
                              {customer.data.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span className="font-medium text-gray-900">{customer.data.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{customer.data.email}</td>
                        <td className="px-4 py-3 text-right font-medium">{customerOrders.length}</td>
                        <td className="px-4 py-3 text-right font-semibold font-display">
                          {total > 0 ? `₹${total.toLocaleString('en-IN')}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(customer.created_at).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
