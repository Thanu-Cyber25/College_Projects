export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'

export default function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    Pending: 'status-pending',
    Confirmed: 'status-confirmed',
    Processing: 'status-processing',
    Shipped: 'status-shipped',
    Delivered: 'status-delivered',
    Cancelled: 'status-cancelled',
  }
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}
