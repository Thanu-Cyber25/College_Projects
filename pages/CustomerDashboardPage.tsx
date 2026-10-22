import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Package, LogOut, ChevronDown, ChevronRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../contexts/AuthContext'
import { shipd } from '@/lib/shipd'

export default function CustomerDashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) { navigate('/login'); return }
    if (user) {
      const fetchOrders = async () => {
        try {
          const all = await shipd.from('orders').list()
          setOrders(all.filter((o: any) => o.data.userId === user.id).reverse())
        } finally {
          setLoadingOrders(false)
        }
      }
      fetchOrders()
    }
  }, [user, authLoading])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (authLoading) return <div className="min-h-screen bg-stone-50"><Navbar /></div>

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-500 mt-1">Manage your orders and profile</p>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="gap-2 text-gray-600">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-stone-200 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full gold-bg flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="font-display text-3xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="font-display text-3xl font-bold text-gray-900">
              ₹{orders.reduce((s: number, o: any) => s + (o.data.grandTotal || 0), 0)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-stone-200">
          <div className="p-6 border-b border-stone-100">
            <h2 className="font-display text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 gold-accent" /> Order History
            </h2>
          </div>

          {loadingOrders ? (
            <div className="p-6 space-y-4">
              {[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No orders yet</p>
              <p className="text-sm text-gray-400 mb-4">Start exploring our curated collection</p>
              <Link to="/catalogue"><Button className="gold-bg text-white border-0">Browse Books</Button></Link>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {orders.map((order: any) => (
                <div key={order.id}>
                  <button
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="w-full flex items-center justify-between p-6 hover:bg-stone-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-6 flex-wrap">
                      <div>
                        <p className="text-xs text-gray-500">Order ID</p>
                        <p className="font-mono font-semibold text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-sm font-medium">{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Items</p>
                        <p className="text-sm font-medium">{order.data.itemCount} book{order.data.itemCount !== 1 ? 's' : ''}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-display font-bold text-gray-900">₹{order.data.grandTotal}</p>
                      </div>
                      <StatusBadge status={order.data.status} />
                    </div>
                    {expanded === order.id ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                  </button>

                  {expanded === order.id && (
                    <div className="px-6 pb-6 bg-stone-50 border-t border-stone-100">
                      <div className="grid sm:grid-cols-2 gap-6 mt-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Books Ordered</p>
                          <div className="space-y-2">
                            {order.data.items?.map((item: any, idx: number) => (
                              <div key={idx} className="flex gap-3">
                                <img src={item.coverUrl} alt={item.title} className="w-10 h-14 object-cover rounded shadow" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                  <p className="text-xs text-gray-500">{item.author}</p>
                                  <p className="text-xs text-gray-700">Qty: {item.quantity} × ₹{item.price} = ₹{item.lineTotal}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Delivery Address</p>
                          <div className="flex gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700">
                              {order.data.address}, {order.data.city}, {order.data.state} — {order.data.pincode}
                            </p>
                          </div>
                          <div className="mt-4 text-sm space-y-1">
                            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{order.data.subtotal}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>{order.data.deliveryFee === 0 ? 'Free' : `₹${order.data.deliveryFee}`}</span></div>
                            <div className="flex justify-between font-semibold border-t pt-1 mt-1"><span>Total</span><span>₹{order.data.grandTotal}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
