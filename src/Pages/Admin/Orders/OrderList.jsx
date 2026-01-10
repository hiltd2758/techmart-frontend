import { useState } from 'react'
import { FaEye, FaSearch, FaTimes, FaShippingFast, FaCreditCard, FaMapMarkerAlt, FaEnvelope, FaPhone, FaPrint, FaDownload } from 'react-icons/fa'

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

const orders = [
  { 
    id: 'ORD-20240104-001', 
    customer: 'Nguyễn Văn An', 
    date: '2024-01-04', 
    total: '$299.99', 
    status: 'Completed',
    items: 2,
    payment: 'Credit Card',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Nguyễn Trãi, P.7, Q.5, TP.HCM',
    orderItems: [
      { name: 'Wireless Mouse', quantity: 1, price: '$49.99' },
      { name: 'USB-C Cable', quantity: 2, price: '$125.00' }
    ],
    subtotal: '$274.99',
    shipping: '$15.00',
    tax: '$10.00'
  },
  { 
    id: 'ORD-20240104-002', 
    customer: 'Trần Thị Mai', 
    date: '2024-01-04', 
    total: '$599.50', 
    status: 'Processing',
    items: 1,
    payment: 'PayPal',
    email: 'jane.smith@email.com',
    phone: '+1 (555) 234-5678',
    address: '45 Lê Lợi, P.Bến Nghé, Q.1, TP.HCM',
    orderItems: [
      { name: 'Mechanical Keyboard', quantity: 1, price: '$549.50' }
    ],
    subtotal: '$549.50',
    shipping: '$35.00',
    tax: '$15.00'
  },
  { 
    id: 'ORD-20240103-001', 
    customer: 'Lê Minh Hoàng', 
    date: '2024-01-03', 
    total: '$399.99', 
    status: 'Pending',
    items: 3,
    payment: 'Credit Card',
    email: 'mike.j@email.com',
    phone: '+1 (555) 345-6789',
    address: '78 Võ Văn Tần, Q.3, TP.HCM',
    orderItems: [
      { name: 'HD Webcam', quantity: 1, price: '$149.99' },
      { name: 'Microphone', quantity: 1, price: '$129.00' },
      { name: 'Desk Lamp', quantity: 1, price: '$89.00' }
    ],
    subtotal: '$367.99',
    shipping: '$20.00',
    tax: '$12.00'
  },
  { 
    id: 'ORD-20240102-001', 
    customer: 'Phạm Thu Hà', 
    date: '2024-01-02', 
    total: '$899.99', 
    status: 'Completed',
    items: 4,
    payment: 'Credit Card',
    email: 'sarah.w@email.com',
    phone: '+1 (555) 456-7890',
    address: '210 Phan Xích Long, Q.Phú Nhuận, TP.HCM',
    orderItems: [
      { name: 'Gaming Monitor', quantity: 1, price: '$399.99' },
      { name: 'HDMI Cable', quantity: 2, price: '$60.00' },
      { name: 'Monitor Stand', quantity: 1, price: '$129.00' },
      { name: 'Cable Management', quantity: 1, price: '$49.00' }
    ],
    subtotal: '$837.99',
    shipping: '$40.00',
    tax: '$22.00'
  },
  { 
    id: 'ORD-20240101-001', 
    customer: 'Đỗ Quốc Bảo', 
    date: '2024-01-01', 
    total: '$149.99', 
    status: 'Shipped',
    items: 1,
    payment: 'PayPal',
    email: 'robert.b@email.com',
    phone: '+1 (555) 567-8901',
    address: '15 Trần Hưng Đạo, TP.Biên Hòa, Đồng Nai',
    orderItems: [
      { name: 'Phone Stand', quantity: 1, price: '$129.99' }
    ],
    subtotal: '$129.99',
    shipping: '$15.00',
    tax: '$5.00'
  },
]


  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusStyles = (status) => {
    switch(status) {
      case 'Completed':
        return 'bg-green-100 text-green-700'
      case 'Processing':
        return 'bg-blue-100 text-blue-700'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'Shipped':
        return 'bg-purple-100 text-purple-700'
      case 'Cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Shipped':
      case 'Completed':
        return <FaShippingFast className="w-5 h-5" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <input
            type="date"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-900">{order.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900 font-medium">{order.customer}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{order.date}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                        {order.items}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{order.payment}</td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-900">{order.total}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`
                        inline-flex px-3 py-1 text-xs font-medium rounded-full
                        ${getStatusStyles(order.status)}
                      `}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                        title="View details"
                      >
                        <FaEye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 px-6 text-center">
                    <p className="text-gray-600">No orders found matching your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing 1 to {filteredOrders.length} of {orders.length} orders</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Modal - Glassmorphism */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/20 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Modal Header - Glassmorphism */}
            <div 
              className="px-6 py-5 border-b border-gray-200/50 flex items-center justify-between backdrop-blur-md"
              style={{
                background: 'linear-gradient(to bottom, rgba(249, 250, 251, 0.8), rgba(243, 244, 246, 0.6))'
              }}
            >
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <p className="text-sm text-gray-500 mt-1">Order {selectedOrder.id} • {selectedOrder.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:bg-white/50 rounded-lg transition-all duration-200 backdrop-blur-sm" title="Print">
                  <FaPrint size={18} />
                </button>
                <button className="p-2 text-gray-500 hover:bg-white/50 rounded-lg transition-all duration-200 backdrop-blur-sm" title="Download">
                  <FaDownload size={18} />
                </button>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-gray-500 hover:bg-red-50/50 hover:text-red-600 rounded-lg transition-all duration-200 backdrop-blur-sm"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1">
              <div className="p-6 space-y-6">
                {/* Status & Key Info */}
                <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-gray-200/50">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium backdrop-blur-sm ${getStatusStyles(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span>{selectedOrder.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCreditCard className="text-gray-400" />
                    <span className="text-sm">{selectedOrder.payment}</span>
                  </div>
                  <div className="ml-auto">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedOrder.total}</p>
                  </div>
                </div>

                {/* Customer & Shipping Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div 
                    className="rounded-xl p-5 border backdrop-blur-sm"
                    style={{
                      background: 'rgba(249, 250, 251, 0.5)',
                      borderColor: 'rgba(229, 231, 235, 0.5)'
                    }}
                  >
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Customer Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{selectedOrder.customer}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <FaEnvelope className="text-gray-400 mt-0.5 flex-shrink-0" size={14} />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                          <p className="text-sm text-gray-700">{selectedOrder.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FaPhone className="text-gray-400 mt-0.5 flex-shrink-0" size={14} />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                          <p className="text-sm text-gray-700">{selectedOrder.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div 
                    className="rounded-xl p-5 border backdrop-blur-sm"
                    style={{
                      background: 'rgba(249, 250, 251, 0.5)',
                      borderColor: 'rgba(229, 231, 235, 0.5)'
                    }}
                  >
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Shipping Address</h3>
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-gray-400 mt-0.5 flex-shrink-0" size={14} />
                      <div>
                        <p className="text-sm text-gray-700 leading-relaxed">{selectedOrder.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Order Items</h3>
                  <div 
                    className="border rounded-xl overflow-hidden backdrop-blur-sm"
                    style={{
                      borderColor: 'rgba(229, 231, 235, 0.5)'
                    }}
                  >
                    <table className="w-full">
                      <thead 
                        className="border-b"
                        style={{
                          background: 'rgba(249, 250, 251, 0.5)',
                          borderColor: 'rgba(229, 231, 235, 0.5)'
                        }}
                      >
                        <tr>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                          <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y bg-white/30" style={{ borderColor: 'rgba(243, 244, 246, 0.5)' }}>
                        {selectedOrder.orderItems.map((item, index) => (
                          <tr key={index} className="hover:bg-white/40 transition-colors">
                            <td className="py-3 px-4">
                              <p className="font-medium text-gray-900">{item.name}</p>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100/50 text-gray-700 text-sm font-medium backdrop-blur-sm">
                                {item.quantity}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-gray-900">{item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Order Summary */}
                <div 
                  className="rounded-xl p-5 border backdrop-blur-sm"
                  style={{
                    background: 'rgba(249, 250, 251, 0.5)',
                    borderColor: 'rgba(229, 231, 235, 0.5)'
                  }}
                >
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">{selectedOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-gray-900">{selectedOrder.shipping}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium text-gray-900">{selectedOrder.tax}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-300/50">
                      <div className="flex justify-between">
                        <span className="text-base font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-gray-900">{selectedOrder.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Glassmorphism */}
            <div 
              className="px-6 py-4 border-t flex justify-end gap-3 backdrop-blur-md"
              style={{
                background: 'linear-gradient(to top, rgba(249, 250, 251, 0.8), rgba(243, 244, 246, 0.6))',
                borderColor: 'rgba(229, 231, 235, 0.5)'
              }}
            >
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 border text-gray-700 rounded-lg hover:bg-white/50 transition-all duration-200 font-medium backdrop-blur-sm"
                style={{ borderColor: 'rgba(209, 213, 219, 0.5)' }}
              >
                Close
              </button>
              <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/30">
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default OrderList