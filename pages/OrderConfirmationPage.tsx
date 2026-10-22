import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Package, Home, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { shipd } from '@/lib/shipd'
import { Skeleton } from '@/components/ui/skeleton'

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const orders = await shipd.from('orders').list()
        const found = orders.find((o: any) => o.id === orderId)
        setOrder(found)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [orderId])

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-16">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        ) : !order ? (
          <div className="text-center">
            <p className="text-gray-500">Order not found.</p>
            <Link to="/"><Button className="mt-4 gold-bg text-white border-0">Go Home</Button></Link>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
            <p className="text-gray-500 mb-6">Thank you for your purchase. Your order has been confirmed.</p>

            <div className="bg-white rounded-xl border border-stone-200 p-6 text-left mb-6">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Order ID</p>
                  <p className="font-mono font-semibold text-gray-900">{order.id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-semibold text-amber-700">{order.data.status}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-display font-bold text-lg">₹{order.data.grandTotal}</p>
                </div>
                <div>
                  <p className="text-gray-500">Payment</p>
                  <p className="font-semibold">{order.data.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Demo Payment'}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-stone-100">
                <p className="text-gray-500 text-sm">Deliver to</p>
                <p className="font-medium">{order.data.customerName}</p>
                <p className="text-sm text-gray-600">{order.data.address}, {order.data.city}, {order.data.state} — {order.data.pincode}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
              <Clock className="w-4 h-4" /> Expected delivery: 2–5 business days
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/account">
                <Button variant="outline" className="gap-2"><Package className="w-4 h-4" /> Track Order</Button>
              </Link>
              <Link to="/">
                <Button className="gold-bg text-white border-0 gap-2"><Home className="w-4 h-4" /> Continue Shopping</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
