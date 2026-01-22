import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUser,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaCog,
  FaSignOutAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaEye,
  FaStar,
  FaChevronRight,
  FaRedo,
} from 'react-icons/fa';
import HomeNavbar from '../../Components/HomeNavbar/HomeNavbar';
import Footer from '../../Components/Footer/Footer.jsx';

const Account = () => {
  const [activeTab, setActiveTab] = useState('orders');

  // Sample user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    joinDate: 'January 2024',
    addresses: [
      {
        id: 1,
        type: 'Home',
        name: 'John Doe',
        street: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        phone: '+1 234 567 8900',
        isDefault: true,
      },
      {
        id: 2,
        type: 'Office',
        name: 'John Doe',
        street: '456 Business Ave',
        city: 'Palo Alto',
        state: 'CA',
        phone: '+1 234 567 8900',
        isDefault: false,
      },
    ],
  };

  // Sample orders data
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 5499,
      reviewed: false,
      addressId: 1,
      items: [{ name: 'MacBook Pro 16" M3 Max', quantity: 1, price: 5499, image: '/arrivals/arrival_1.jpg' }],
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      status: 'processing',
      total: 1299,
      reviewed: false,
      addressId: 1,
      items: [{ name: 'iPhone 15 Pro', quantity: 1, price: 1299, image: '/arrivals/arrival_3.png' }],
    },
    {
      id: 'ORD-003',
      date: '2024-01-22',
      status: 'shipped',
      total: 749,
      reviewed: false,
      addressId: 2,
      items: [{ name: 'AirPods Pro Gen 2', quantity: 3, price: 249, image: '/arrivals/arrival_4.jpg' }],
    },
    {
      id: 'ORD-4',
      date: '2024-01-25',
      status: 'cancelled',
      total: 749,
      reviewed: false,
      addressId: 2,
      items: [{ name: 'AirPods Pro Gen 2', quantity: 3, price: 249, image: '/arrivals/arrival_4.jpg' }],
    },
  ];

  const getStatusConfig = (status) => {
    const configs = {
      delivered: {
        icon: FaCheckCircle,
        text: 'Delivered',
        bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200',
        iconColor: 'text-green-600',
      },
      processing: {
        icon: FaBox,
        text: 'Processing',
        bgColor: 'bg-gradient-to-r from-blue-50 to-cyan-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-600',
      },
      shipped: {
        icon: FaTruck,
        text: 'Shipped',
        bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200',
        iconColor: 'text-purple-600',
      },
      cancelled: {
        icon: FaTimesCircle,
        text: 'Cancelled',
        bgColor: 'bg-gradient-to-r from-red-50 to-orange-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        iconColor: 'text-red-600',
      },
    };
    return configs[status] || configs.processing;
  };

  const [selectedOrder, setSelectedOrder] = useState(null);

  const InfoCard = ({ icon: Icon, label, textColor, colorClass, value }) => (
    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-100 hover:border-gray-300 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
          <Icon className={`${textColor}`} />
        </div>
        <label className="text-sm text-gray-500 font-semibold uppercase tracking-wider">{label}</label>
      </div>
      <p className="text-gray-900 font-bold text-lg">{value}</p>
    </div>
  );

  const OrderItemCard = ({ item }) => (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-16 h-16 bg-white rounded-lg border-2 border-gray-100 p-2 flex-shrink-0">
          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 font-semibold truncate">{item.name}</p>
          <p className="text-sm text-gray-500">x{item.quantity}</p>
        </div>
      </div>
      <span className="text-lg font-bold text-gray-900 whitespace-nowrap">${item.price}</span>
    </div>
  );

  const ActionButton = ({ icon: Icon, label, colorClasses, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-6 py-3 border-2 border-${colorClasses}-200 text-${colorClasses}-700 font-semibold rounded-xl hover:border-${colorClasses}-900 hover:bg-${colorClasses}-50 transition-all duration-300 cursor-pointer whitespace-nowrap`}
    >
      {Icon && <Icon />}
      {label}
    </button>
  );

  const AddressCard = ({ address, onSetDefault }) => (
    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 relative hover:shadow-xl hover:border-gray-200 transition-all duration-300 group">
      {address.isDefault && (
        <span className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
          Default
        </span>
      )}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <FaMapMarkerAlt className="text-2xl text-blue-600" />
          </div>
          <div>
            <h3 className="font-poppins font-bold text-xl text-gray-900 mb-1">{address.type}</h3>
            <p className="text-gray-600 font-semibold">{address.name}</p>
          </div>
        </div>
      </div>
      <div className="space-y-2 text-sm text-gray-600 mb-6 pl-1">
        <p className="flex items-start gap-2">
          <span className="font-semibold text-gray-500 min-w-[60px]">Street:</span> <span className="font-medium">{address.street}</span>
        </p>
        <p className="flex items-start gap-2">
          <span className="font-semibold text-gray-500 min-w-[60px]">City:</span>{' '}
          <span className="font-medium">
            {address.city}, {address.state}
          </span>
        </p>
        <p className="flex items-start gap-2">
          <span className="font-semibold text-gray-500 min-w-[60px]">Phone:</span> <span className="font-medium">{address.phone}</span>
        </p>
      </div>
      <div className="flex gap-3 pt-4 border-t-2 border-gray-100">
        {!address.isDefault && (
          <ActionButton icon={FaCheckCircle} label="Set Default" colorClasses="green" onClick={() => onSetDefault(address.id)} />
        )}
        <ActionButton icon={FaEdit} label="Edit" colorClasses="gray" />
        <ActionButton icon={FaTrash} label="Delete" colorClasses="red" />
      </div>
    </div>
  );

  const OrdersSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl text-gray-900 font-poppins font-bold">My Orders</h2>
          <p className="text-gray-500 mt-1">Track and manage your orders</p>
        </div>
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold">
          {orders.length} Total Orders
        </div>
      </div>

      {orders.map((order) => {
        const statusConfig = getStatusConfig(order.status);
        const StatusIcon = statusConfig.icon;

        return (
          <div
            key={order.id}
            className="bg-white border-2 border-gray-100 rounded-2xl p-6 lg:p-8 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-4 rounded-xl">
                  <FaShoppingBag className="text-2xl text-gray-700" />
                </div>
                <div>
                  <h3 className="text-xl font-poppins font-bold text-gray-900 flex items-center gap-2">
                    Order {order.id}
                    <FaChevronRight className="text-sm text-gray-400 group-hover:text-gray-700 transition-colors" />
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <FaCalendar className="text-xs text-gray-400" />
                    <p className="text-sm text-gray-500 font-medium">{order.date}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border-2 ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
                >
                  <StatusIcon className={statusConfig.iconColor} />
                  {statusConfig.text}
                </span>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">${order.total.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3 mb-6 bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100">
              {order.items.map((item, index) => (
                <OrderItemCard key={index} item={item} />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedOrder(order)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-poppins font-semibold rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
              >
                <FaEye />
                View Details
              </button>

              {order.status === 'delivered' && order.reviewed === false && <ActionButton icon={FaStar} label="Write Review" colorClasses="gray" />}

              {order.status === 'processing' && <ActionButton icon={FaTimesCircle} label="Cancel Order" colorClasses="red" />}
              {(order.status === 'cancelled' || order.status === 'delivered') && <ActionButton icon={FaRedo} label="Buy Back" colorClasses="green" />}
            </div>

            {selectedOrder && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
                <div
                  className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg p-6 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Order Details - {selectedOrder.id}</h2>
                    <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-700 text-3xl font-bold cursor-pointer">
                      &times;
                    </button>
                  </div>

                  {/* Order Info */}
                  <div className="border-b border-gray-100 py-4 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Order Date</p>
                      <p className="font-semibold text-gray-900">{selectedOrder.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${
                          getStatusConfig(selectedOrder.status).bgColor
                        } ${getStatusConfig(selectedOrder.status).textColor} ${getStatusConfig(selectedOrder.status).borderColor} border-2`}
                      >
                        {React.createElement(getStatusConfig(selectedOrder.status).icon, {
                          className: getStatusConfig(selectedOrder.status).iconColor,
                        })}
                        {getStatusConfig(selectedOrder.status).text}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                      <p className="font-bold text-lg">${selectedOrder.total.toLocaleString()}</p>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="py-4 space-y-4">
                    {user.addresses
                      .filter((address) => address.id === selectedOrder.addressId)
                      .map((address) => (
                        <div key={address.id}>
                          <p className="font-semibold text-gray-900 mb-1">
                            {address.name} ({address.phone}) <span className="text-gray-400 font-normal">{address.type}</span>
                          </p>
                          <p className="text-sm text-gray-500">
                            {address.street}, {address.city}, {address.state}
                          </p>
                        </div>
                      ))}
                  </div>
                  {/* Order Items */}
                  <div className="border-t border-b border-gray-100 py-4 space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <OrderItemCard key={index} item={item} />
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    {/* Write Review */}
                    {selectedOrder.status === 'delivered' && !selectedOrder.reviewed && (
                      <ActionButton icon={FaStar} label="Write Review" colorClasses="gray" />
                    )}

                    {/* Cancel Order */}
                    {selectedOrder.status === 'processing' && <ActionButton icon={FaTimesCircle} label="Cancel Order" colorClasses="red" />}

                    {/* Buy Back */}
                    {(selectedOrder.status === 'cancelled' || selectedOrder.status === 'delivered') && (
                      <ActionButton icon={FaRedo} label="Buy Back" colorClasses="green" />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const PersonalInfoSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl text-gray-900 font-poppins font-bold">Personal Information</h2>
          <p className="text-gray-500 mt-1">Manage your personal details</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-poppins font-semibold rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer">
          <FaEdit />
          Edit Profile
        </button>
      </div>

      <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:border-gray-200 transition-all duration-300">
        {/* Profile Header */}
        <div className="flex items-center gap-6 pb-8 mb-8 border-b-2 border-gray-100">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
              <FaUser className="text-white text-3xl" />
            </div>
            <span className="text-sm font-medium text-gray-500">Completed</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {orders.filter((o) => o.status === "delivered").length}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Successfully delivered
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <FaChartLine className="text-xl text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Total Spent
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            $
            {orders
              .reduce((sum, order) => sum + order.total, 0)
              .toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-1">Lifetime value</div>
        </div>
      </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard icon={FaUser} label="Full Name" textColor="text-blue-600" colorClass="bg-blue-100" value={user.name} />
          <InfoCard icon={FaEnvelope} label="Email" textColor="text-purple-600" colorClass=" bg-purple-100" value={user.email} />
          <InfoCard icon={FaPhone} label="Phone" textColor="text-green-600" colorClass=" bg-green-100" value={user.phone} />
          <InfoCard icon={FaCalendar} label="Member Since" textColor="text-orange-600" colorClass=" bg-orange-100" value={user.joinDate} />
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t-2 border-gray-100">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 mb-1">{orders.length}</p>
            <p className="text-sm text-gray-500 font-medium">Total Orders</p>
          </div>
          <div className="text-center border-x-2 border-gray-100">
            <p className="text-3xl font-bold text-gray-900 mb-1">{user.addresses.length}</p>
            <p className="text-sm text-gray-500 font-medium">Saved Addresses</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 mb-1">${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}</p>
            <p className="text-sm text-gray-500 font-medium">Total Spent</p>
          </div>
        </div>
      </div>
    </div>
  );

  const AddressesSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl text-gray-900 font-poppins font-bold">Shipping Addresses</h2>
          <p className="text-gray-500 mt-1">Manage your delivery locations</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-poppins font-semibold rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer">
          <FaPlus />
          Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.addresses.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrdersSection />;
      case 'personal':
        return <PersonalInfoSection />;
      case 'addresses':
        return <AddressesSection />;
      default:
        return <OrdersSection />;
    }
  };

  return (
    <>
      <HomeNavbar />
      <div className="w-full bg-gradient-to-b from-gray-50 to-white pt-[70px] pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-32">
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* User Profile Card */}
                  <div className="flex flex-col items-center text-center mb-8 pb-8 border-b-2 border-gray-100">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
                        <FaUser className="text-white text-2xl" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                    </div>
                    <div>
                      <h3 className="font-poppins font-bold text-xl text-gray-900 mb-1">{user.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">{user.email}</p>
                    </div>
                  </div>

                  {/* Navigation Menu */}
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-poppins font-semibold text-left transition-all duration-300 cursor-pointer ${
                        activeTab === 'orders'
                          ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg scale-105'
                          : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
                      }`}
                    >
                      <FaShoppingBag className="text-lg" />
                      <span className="flex-1">My Orders</span>
                      {activeTab === 'orders' && <FaChevronRight className="text-sm" />}
                    </button>

                    <button
                      onClick={() => setActiveTab('personal')}
                      className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-poppins font-semibold text-left transition-all duration-300 cursor-pointer ${
                        activeTab === 'personal'
                          ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg scale-105'
                          : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
                      }`}
                    >
                      <FaUser className="text-lg" />
                      <span className="flex-1">Personal Info</span>
                      {activeTab === 'personal' && <FaChevronRight className="text-sm" />}
                    </button>

                    <button
                      onClick={() => setActiveTab('addresses')}
                      className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-poppins font-semibold text-left transition-all duration-300  cursor-pointer ${
                        activeTab === 'addresses'
                          ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg scale-105'
                          : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
                      }`}
                    >
                      <FaMapMarkerAlt className="text-lg" />
                      <span className="flex-1">Addresses</span>
                      {activeTab === 'addresses' && <FaChevronRight className="text-sm" />}
                    </button>

                    <div className="pt-4 mt-4 border-t-2 border-gray-100 space-y-2">
                      <button className="w-full flex items-center gap-3 px-5 py-4 rounded-xl font-poppins font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
                        <FaCog className="text-lg" />
                        <span className="flex-1">Settings</span>
                      </button>

                      <button className="w-full flex items-center gap-3 px-5 py-4 rounded-xl font-poppins font-semibold text-red-600 hover:bg-red-50 transition-all duration-300 group cursor-pointer">
                        <FaSignOutAlt className="text-lg group-hover:translate-x-1 transition-transform" />
                        <span className="flex-1">Sign Out</span>
                      </button>
                    </div>
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">{renderContent()}</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Account;
