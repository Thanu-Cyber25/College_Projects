import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import AdminLayout from './AdminLayout'
import StatusBadge from '../../components/StatusBadge'
import { shipd } from '@/lib/shipd'
import { toast } from '@/components/ui/toast'

const STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [newStatus, setNewStatus] = useState('')
  const [updating, setUpdating] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)

  const fetchOrder = async () => {
    try {
      const all = await shipd.from('orders').list()
      const found = all.find((o: any) => o.id === orderId)
      setOrder(found)
      setNewStatus(found?.data.status || '')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrder() }, [orderId])

  const handleUpdateStatus = async () => {
    if (!order || !newStatus || newStatus === order.data.status) return

    if (newStatus === 'Cancelled' && !confirmCancel) {
      setConfirmCancel(true)
      return
    }

    setUpdating(true)
    try {
      const history = [...(order.data.statusHistory || []), {
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: `Status updated to ${newStatus} by admin`,
      }]

      await shipd.from('orders').update(order.id, {
        ...order.data,
        status: newStatus,
        statusHistory: history,
      })

      toast.success(`Order status updated to ${newStatus}`)
      setConfirmCancel(false)
      await fetchOrder()
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <button onClick={() => navigate('/admin/orders')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        ) : !order ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Order not found.</p>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-gray-900">
                  Order #{order.id.slice(-8).toUpperCase()}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Placed on {new Date(order.created_at).toLocaleString('en-IN')}
                </p>
              </div>
              <StatusBadge status={order.data.status} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Items */}
                <div className="bg-white rounded-lg border border-stone-200 p-6">
                  <h2 className="font-display font-semibold text-gray-900 mb-4">Books Ordered</h2>
                  <div className="space-y-4">
                    {order.data.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4">
                        <img src={item.coverUrl} alt={item.title} className="w-12 h-16 object-cover rounded shadow" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-500">{item.author}</p>
                          <p className="text-sm mt-1">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <p className="font-semibold font-display">₹{item.lineTotal}</p>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{order.data.subtotal}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>{order.data.deliveryFee === 0 ? 'Free' : `₹${order.data.deliveryFee}`}</span></div>
                    <div className="flex justify-between font-semibold text-base"><span>Grand Total</span><span className="font-display">₹{order.data.grandTotal}</span></div>
                  </div>
                </div>

                {/* Status History */}
                {order.data.statusHistory && (
                  <div className="bg-white rounded-lg border border-stone-200 p-6">
                    <h2 className="font-display font-semibold text-gray-900 mb-4">Status History</h2>
                    <div className="space-y-3">
                      {order.data.statusHistory.map((h: any, idx: number) => (
                        <div key={idx} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-2.5 h-2.5 rounded-full gold-bg mt-1"></div>
                            {idx < order.data.statusHistory.length - 1 && <div className="w-px flex-1 bg-stone-200 mt-1"></div>}
                          </div>
                          <div className="pb-3">
                            <p className="text-sm font-medium text-gray-900">{h.status}</p>
                            <p className="text-xs text-gray-500">{new Date(h.timestamp).toLocaleString('en-IN')}</p>
                            {h.note && <p className="text-xs text-gray-400 mt-0.5">{h.note}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Customer Info */}
                <div className="bg-white rounded-lg border border-stone-200 p-5">
                  <h2 className="font-display font-semibold text-gray-900 mb-3">Customer</h2>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{order.data.customerName}</p>
                    <p className="text-gray-500">{order.data.customerEmail}</p>
                    <p className="text-gray-500">{order.data.customerPhone}</p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-lg border border-stone-200 p-5">
                  <h2 className="font-display font-semibold text-gray-900 mb-3">Delivery Address</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {order.data.address}<br />
                    {order.data.city}, {order.data.state}<br />
                    {order.data.pincode}
                  </p>
                </div>

                {/* Payment */}
                <div className="bg-white rounded-lg border border-stone-200 p-5">
                  <h2 className="font-display font-semibold text-gray-900 mb-3">Payment</h2>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-medium">{order.data.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Demo Payment'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-medium">{order.data.paymentStatus}</span></div>
                  </div>
                </div>

                {/* Update Status */}
                <div className="bg-white rounded-lg border border-stone-200 p-5">
                  <h2 className="font-display font-semibold text-gray-900 mb-3">Update Status</h2>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="mb-3"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  {confirmCancel && newStatus === 'Cancelled' && (
                    <div className="bg-red-50 border border-red-200 rounded p-3 mb-3 text-sm text-red-700 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Confirm cancellation? This action will be saved to the database and visible to the customer.</span>
                    </div>
                  )}

                  <Button
                    onClick={handleUpdateStatus}
                    disabled={updating || newStatus === order.data.status}
                    className={`w-full gap-2 ${newStatus === 'Cancelled' ? 'bg-red-600 hover:bg-red-700 text-white border-0' : 'gold-bg hover:opacity-90 text-white border-0'}`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {updating ? 'Saving…' : confirmCancel && newStatus === 'Cancelled' ? 'Confirm Cancellation' : 'Update Status'}
                  </Button>
                  {confirmCancel && <button onClick={() => setConfirmCancel(false)} className="w-full text-center text-xs text-gray-500 mt-2 hover:text-gray-700">Cancel</button>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
