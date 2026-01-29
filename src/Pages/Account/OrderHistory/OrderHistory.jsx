import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaShoppingBag,
  FaCalendar,
  FaTruck,
  FaBox,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaStar,
  FaDownload,
  FaFilter,
  FaSearch,
  FaChevronDown,
  FaCreditCard,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";

import HomeNavbar from '../../../Components/HomeNavbar/HomeNavbar';
import Footer from '../../../Components/Footer/Footer';

const OrderHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // Enhanced sample orders data with more details  
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 5499,
      subtotal: 5499,
      shipping: 0,
      tax: 0,
      items: [
        {
          name: 'MacBook Pro 16" M3 Max',
          quantity: 1,
          price: 5499,
          image: '/arrivals/arrival_1.jpg',
          sku: 'MBP-16-M3MAX-2024',
          warranty: '1 Year'
        }
      ],
      trackingNumber: 'TRK123456789',
      estimatedDelivery: '2024-01-18',
      actualDelivery: '2024-01-18',
      paymentMethod: 'Credit Card ending in 4242',
      shippingAddress: {
        name: 'John Doe',
        street: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105'
      },
      orderNotes: 'Please deliver after 5 PM'
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      status: 'processing',
      total: 1299,
      subtotal: 1299,
      shipping: 0,
      tax: 0,
      items: [
        {
          name: 'iPhone 15 Pro',
          quantity: 1,
          price: 1299,
          image: '/arrivals/arrival_3.png',
          sku: 'IP15P-256GB-BLU',
          warranty: '1 Year'
        }
      ],
      trackingNumber: 'TRK987654321',
      estimatedDelivery: '2024-01-25',
      paymentMethod: 'PayPal',
      shippingAddress: {
        name: 'John Doe',
        street: '456 Business Ave',
        city: 'Palo Alto',
        state: 'CA',
        zip: '94301'
      }
    },
    {
      id: 'ORD-003',
      date: '2024-01-22',
      status: 'shipped',
      total: 749,
      subtotal: 747,
      shipping: 0,
      tax: 2,
      items: [
        {
          name: 'AirPods Pro Gen 2',
          quantity: 3,
          price: 249,
          image: '/arrivals/arrival_4.jpg',
          sku: 'APP-GEN2-2023',
          warranty: '1 Year'
        }
      ],
      trackingNumber: 'TRK456789123',
      estimatedDelivery: '2024-01-24',
      paymentMethod: 'Apple Pay',
      shippingAddress: {
        name: 'John Doe',
        street: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105'
      }
    }
  ];

  // Use the same status configuration from Account component for consistency  
  const getStatusConfig = (status) => {
    const configs = {
      delivered: {
        icon: FaCheckCircle,
        text: 'Delivered',
        color: 'emerald',
        bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200',
        iconColor: 'text-green-600'
      },
      processing: {
        icon: FaBox,
        text: 'Processing',
        color: 'blue',
        bgColor: 'bg-gradient-to-r from-blue-50 to-cyan-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-600'
      },
      shipped: {
        icon: FaTruck,
        text: 'Shipped',
        color: 'purple',
        bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200',
        iconColor: 'text-purple-600'
      },
      cancelled: {
        icon: FaTimesCircle,
        text: 'Cancelled',
        color: 'red',
        bgColor: 'bg-gradient-to-r from-red-50 to-orange-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        iconColor: 'text-red-600'
      }
    };
    return configs[status] || configs.processing;
  };

  // Filter and search logic  
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesDate = dateFilter === 'all' ||
        (dateFilter === '30days' && new Date(order.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
        (dateFilter === '90days' && new Date(order.date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const orderStats = {
    total: orders.length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    totalSpent: orders.reduce((sum, order) => sum + order.total, 0)
  };

  return (
    <>
      <HomeNavbar />
      <div className="min-h-screen bg-gray-50 pt-[120px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">Order History</h1>
                <p className="text-lg text-gray-600">Track and manage all your orders</p>
              </div>
              <Link
                to="/account"
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-white transition-all"
              >
                Back to Account
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaShoppingBag className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
                    <p className="text-sm text-gray-500">Total Orders</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FaCheckCircle className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{orderStats.delivered}</p>
                    <p className="text-sm text-gray-500">Delivered</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaBox className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{orderStats.processing}</p>
                    <p className="text-sm text-gray-500">Processing</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaTruck className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{orderStats.shipped}</p>
                    <p className="text-sm text-gray-500">Shipped</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FaCreditCard className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">${orderStats.totalSpent.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Total Spent</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by order ID or product name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="lg:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="delivered">Delivered</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div className="lg:w-48">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                const isExpanded = expandedOrders.has(order.id);

                return (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    {/* Order Header */}
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                            <FaShoppingBag className="text-xl text-gray-700" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">Order {order.id}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <FaCalendar className="text-sm text-gray-400" />
                              <p className="text-sm text-gray-500">
                                {new Date(order.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}>
                            <StatusIcon />
                            {statusConfig.text}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-gray-900">${order.total.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <FaBox className="text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Items</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <FaTruck className="text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Tracking</p>
                            <p className="text-sm font-semibold text-gray-900">{order.trackingNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaCreditCard className="text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Payment</p>
                            <p className="text-sm font-semibold text-gray-900">{order.paymentMethod}</p>
                          </div>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-700">Order Items</h4>
                          <button
                            onClick={() => toggleOrderExpansion(order.id)}
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {isExpanded ? 'Show Less' : 'Show Details'}
                            <FaChevronDown className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>

                        <div className="space-y-3">
                          {order.items.slice(0, isExpanded ? order.items.length : 2).map((item, index) => (<div key={index} className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 p-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.sku ? `SKU: ${item.sku} • ` : ''}Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">${item.price}</p>
                              <p className="text-xs text-gray-500">${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          </div>
                          ))}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 pt-4 space-y-4">
                          {/* Order Summary */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">${order.subtotal.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium">{order.shipping === 0 ? 'FREE' : `$${order.shipping}`}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-medium">${order.tax.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span className="text-gray-900">${order.total.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Shipping Address</h4>
                            <div className="bg-gray-50 rounded-xl p-4">
                              <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-gray-400 mt-1" />
                                <div>
                                  <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                                  <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
                                  <p className="text-sm text-gray-600">
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                                  </p>
                                  <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Notes */}
                          {order.orderNotes && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Notes</h4>
                              <div className="bg-blue-50 rounded-xl p-4">
                                <p className="text-sm text-blue-800">{order.orderNotes}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                          <FaEye />
                          View Details
                        </button>
                        {order.status === 'delivered' && (
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                            <FaStar />
                            Write Review
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button className="flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                            <FaTruck />
                            Track Package
                          </button>
                        )}
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          <FaDownload />
                          Download Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm && 'Try adjusting your search or filters'}
                  {!searchTerm && statusFilter === 'all' && dateFilter === 'all' && "You haven't placed any orders yet"}
                  {!searchTerm && (statusFilter !== 'all' || dateFilter !== 'all') && 'No orders match your current filters'}
                </p>
                <div className="flex gap-3 justify-center">
                  {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' ? (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                        setDateFilter('all');
                      }}
                      className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Clear Filters
                    </button>
                  ) : (
                    <Link
                      to="/product"
                      className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Start Shopping
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Pagination */}
            {filteredOrders.length > 0 && (
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {filteredOrders.length} of {orders.length} orders
                </p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium">
                    1
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderHistory;