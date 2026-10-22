import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Navbar from '../components/Navbar'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { shipd } from '@/lib/shipd'
import { toast } from '@/components/ui/toast'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    paymentMethod: 'COD',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const delivery = total < 500 ? 49 : 0
  const grandTotal = total + delivery

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit phone number'
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Valid 6-digit pincode required'
    if (!form.state.trim()) e.state = 'State is required'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    if (!user) { navigate('/login'); return }
    if (items.length === 0) { toast.error('Your cart is empty'); return }

    setSubmitting(true)
    try {
      const orderData = {
        userId: user.id,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        address: form.address,
        city: form.city,
        pincode: form.pincode,
        state: form.state,
        paymentMethod: form.paymentMethod,
        paymentStatus: 'Pending',
        status: 'Pending',
        subtotal: total,
        deliveryFee: delivery,
        grandTotal,
        itemCount: items.reduce((s, i) => s + i.quantity, 0),
        items: items.map(i => ({
          bookId: i.bookId,
          title: i.title,
          author: i.author,
          coverUrl: i.coverUrl,
          price: i.price,
          quantity: i.quantity,
          lineTotal: i.price * i.quantity,
        })),
        statusHistory: [{ status: 'Pending', timestamp: new Date().toISOString(), note: 'Order placed by customer' }],
      }

      const result = await shipd.from('orders').insert(orderData)
      clearCart()
      navigate(`/order-confirmation/${result.id}`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    navigate('/login?redirect=/checkout')
    return null
  }

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg border border-stone-200 p-6">
                <h2 className="font-display text-lg font-semibold mb-4">Delivery Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" value={form.name} onChange={f('name')} className={errors.name ? 'border-red-400' : ''} />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={form.email} onChange={f('email')} className={errors.email ? 'border-red-400' : ''} />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" value={form.phone} onChange={f('phone')} placeholder="10-digit number" className={errors.phone ? 'border-red-400' : ''} />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Input id="address" value={form.address} onChange={f('address')} placeholder="Street, Building, Area" className={errors.address ? 'border-red-400' : ''} />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" value={form.city} onChange={f('city')} className={errors.city ? 'border-red-400' : ''} />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" value={form.state} onChange={f('state')} className={errors.state ? 'border-red-400' : ''} />
                    {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input id="pincode" value={form.pincode} onChange={f('pincode')} placeholder="6-digit pincode" className={errors.pincode ? 'border-red-400' : ''} />
                    {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-stone-200 p-6">
                <h2 className="font-display text-lg font-semibold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${form.paymentMethod === 'COD' ? 'border-amber-400 bg-amber-50' : 'border-stone-200'}`}>
                    <input type="radio" name="payment" value="COD" checked={form.paymentMethod === 'COD'} onChange={() => setForm(p => ({ ...p, paymentMethod: 'COD' }))} className="mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when your order arrives</p>
                    </div>
                  </label>
                  <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${form.paymentMethod === 'DEMO' ? 'border-amber-400 bg-amber-50' : 'border-stone-200'}`}>
                    <input type="radio" name="payment" value="DEMO" checked={form.paymentMethod === 'DEMO'} onChange={() => setForm(p => ({ ...p, paymentMethod: 'DEMO' }))} className="mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Demo Online Payment</p>
                      <p className="text-sm text-gray-500">Simulated checkout — for demonstration only, no real payment</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg border border-stone-200 p-6 sticky top-24">
                <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.bookId} className="flex gap-3">
                      <img src={item.coverUrl} alt={item.title} className="w-10 h-14 object-cover rounded shadow" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₹{total}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Delivery</span><span>{delivery === 0 ? 'Free' : `₹${delivery}`}</span></div>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-semibold text-lg mb-6">
                  <span>Total</span>
                  <span className="font-display">₹{grandTotal}</span>
                </div>
                <Button type="submit" disabled={submitting} className="w-full gold-bg hover:opacity-90 text-white border-0 gap-2 py-3">
                  {submitting ? 'Placing Order…' : 'Place Order'}
                </Button>
                <div className="flex items-center justify-center gap-1 mt-3 text-xs text-gray-400">
                  <Shield className="w-3 h-3" /> Secure & encrypted checkout
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
