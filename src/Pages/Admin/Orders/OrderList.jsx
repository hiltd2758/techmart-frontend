import { useState } from 'react'
import { FaEye, FaSearch } from 'react-icons/fa'

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const orders = [
    { 
      id: '#12345', 
      customer: 'John Doe', 
      date: '2024-01-04', 
      total: '$299.99', 
      status: 'Completed',
      items: 2,
      payment: 'Credit Card'
    },
    { 
      id: '#12346', 
      customer: 'Jane Smith', 
      date: '2024-01-04', 
      total: '$599.50', 
      status: 'Processing',
      items: 1,
      payment: 'PayPal'
    },
    { 
      id: '#12347', 
      customer: 'Mike Johnson', 
      date: '2024-01-03', 
      total: '$399.99', 
      status: 'Pending',
      items: 3,
      payment: 'Credit Card'
    },
    { 
      id: '#12348', 
      customer: 'Sarah Wilson', 
      date: '2024-01-02', 
      total: '$899.99', 
      status: 'Completed',
      items: 4,
      payment: 'Credit Card'
    },
    { 
      id: '#12349', 
      customer: 'Robert Brown', 
      date: '2024-01-01', 
      total: '$149.99', 
      status: 'Shipped',
      items: 1,
      payment: 'PayPal'
    },
  ]

  // Filter orders
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
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View details">
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
    </div>
  )
}



export default OrderList