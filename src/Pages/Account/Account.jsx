import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerAPI } from '../../api/customerAPI';
import { addressAPI } from '../../api/addressAPI';
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
  FaChartLine,
} from 'react-icons/fa';
import HomeNavbar from '../../Components/HomeNavbar/HomeNavbar';
import Footer from '../../Components/Footer/Footer.jsx';

const Account = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
    fetchUserAddresses();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('User not authenticated. Please login again.');
      }

      const parsedUserData = JSON.parse(userData);
      const { username } = parsedUserData;

      if (!username) {
        throw new Error('Username not found. Please login again.');
      }

      const response = await customerAPI.getMyProfile(username);

      if (!response.data || !response.data.data) {
        throw new Error('Invalid response from server');
      }

      const apiUserData = response.data.data;

      setUser({
        name: apiUserData.name,
        email: apiUserData.email,
        phone: apiUserData.phone || 'Not provided',
        joinDate: new Date(apiUserData.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        }),
        addresses: [],
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);

      let errorMessage = 'Failed to load profile';

      if (error.response?.status === 404) {
        errorMessage = 'User profile not found. Please contact support.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        localStorage.clear();
        window.location.href = '/login';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);

      setUser({
        name: 'User',
        email: 'user@example.com',
        phone: 'Not provided',
        joinDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        }),
        addresses: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const response = await addressAPI.getUserAddresses();
      const userAddresses = response.data.data;

      if (userAddresses && userAddresses.length > 0) {
        const addressIds = userAddresses.map(ua => ua.addressId);
        const addressDetailsResponse = await addressAPI.getAddressesByIds(addressIds);
        const addressDetails = addressDetailsResponse.data.data;

        const mappedAddresses = userAddresses.map(ua => {
          const detail = addressDetails.find(ad => ad.id === ua.addressId);
          return {
            id: ua.id,
            userAddressId: ua.id,
            addressId: ua.addressId,
            type: 'Home',
            name: user?.name || 'User',
            street: detail?.street || '',
            ward: detail?.ward || '',
            district: detail?.district || '',
            city: detail?.city || '',
            province: detail?.province || '',
            postalCode: detail?.postalCode || '',
            phone: user?.phone || '',
            isDefault: ua.isDefault,
          };
        });

        setAddresses(mappedAddresses);
        setUser(prev => ({ ...prev, addresses: mappedAddresses }));
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleSetDefaultAddress = async (userAddressId) => {
    try {
      await addressAPI.setDefaultAddress(userAddressId);

      setAddresses(prev =>
        prev.map(addr => ({
          ...addr,
          isDefault: addr.userAddressId === userAddressId,
        }))
      );

      setUser(prev => ({
        ...prev,
        addresses: prev.addresses.map(addr => ({
          ...addr,
          isDefault: addr.userAddressId === userAddressId,
        })),
      }));

      alert('Default address updated successfully!');
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Failed to update default address');
    }
  };

  const handleDeleteAddress = async (userAddressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      await addressAPI.deleteUserAddress(userAddressId);

      setAddresses(prev => prev.filter(addr => addr.userAddressId !== userAddressId));
      setUser(prev => ({
        ...prev,
        addresses: prev.addresses.filter(addr => addr.userAddressId !== userAddressId),
      }));

      alert('Address deleted successfully!');
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address');
    }
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
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-300',
        iconColor: 'text-green-600',
      },
      processing: {
        icon: FaBox,
        text: 'Processing',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-300',
        iconColor: 'text-blue-600',
      },
      shipped: {
        icon: FaTruck,
        text: 'Shipped',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-300',
        iconColor: 'text-purple-600',
      },
      cancelled: {
        icon: FaTimesCircle,
        text: 'Cancelled',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-300',
        iconColor: 'text-red-600',
      },
    };
    return configs[status] || configs.processing;
  };

  const [selectedOrder, setSelectedOrder] = useState(null);

  const InfoCard = ({ icon: Icon, label, value, isLoading = false }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="text-gray-400 text-lg" />
        <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</label>
      </div>
      {isLoading ? (
        <div className="h-6 bg-gray-100 rounded animate-pulse"></div>
      ) : (
        <p className="text-gray-900 font-semibold text-base">{value}</p>
      )}
    </div>
  );

  const OrderItemCard = ({ item }) => (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-12 h-12 bg-gray-50 rounded p-1.5 flex-shrink-0">
          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 font-medium text-sm truncate">{item.name}</p>
          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
        </div>
      </div>
      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">${item.price}</span>
    </div>
  );

  const AddressCard = ({ address, onSetDefault, onDelete }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
      {address.isDefault && (
        <span className="inline-block bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
          Default
        </span>
      )}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          <FaMapMarkerAlt className="text-gray-400 text-lg" />
          <h3 className="font-semibold text-base text-gray-900">{address.type}</h3>
        </div>
        <p className="text-gray-700 text-sm font-medium mb-1">{address.name}</p>
      </div>
      <div className="space-y-1.5 text-sm text-gray-600 mb-6">
        <p>{address.street}</p>
        {address.ward && <p>{address.ward}</p>}
        <p>{address.district}</p>
        <p>{address.city}, {address.province}</p>
        {address.postalCode && <p>{address.postalCode}</p>}
        <p className="text-gray-900 font-medium pt-1">{address.phone}</p>
      </div>
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address.userAddressId)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors"
          >
            <FaCheckCircle className="text-xs" />
            Set Default
          </button>
        )}
        <button
          onClick={() => onDelete(address.userAddressId)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm border border-red-200 text-red-600 font-medium rounded hover:bg-red-50 transition-colors"
        >
          <FaTrash className="text-xs" />
          Delete
        </button>
      </div>
    </div>
  );

  const OrdersSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl text-gray-900 font-semibold">My Orders</h2>
          <p className="text-gray-500 text-sm mt-1">Track and manage your orders</p>
        </div>
        <div className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-medium">
          {orders.length} Orders
        </div>
      </div>

      {orders.map((order) => {
        const statusConfig = getStatusConfig(order.status);
        const StatusIcon = statusConfig.icon;

        return (
          <div
            key={order.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="bg-gray-50 p-3 rounded">
                  <FaShoppingBag className="text-lg text-gray-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Order {order.id}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <FaCalendar className="text-xs text-gray-400" />
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
                >
                  <StatusIcon className={statusConfig.iconColor} />
                  {statusConfig.text}
                </span>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-0.5">Total</p>
                  <p className="text-lg font-semibold text-gray-900">${order.total.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3 mb-5 bg-gray-50 p-4 rounded">
              {order.items.map((item, index) => (
                <OrderItemCard key={index} item={item} />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedOrder(order)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
              >
                <FaEye className="text-xs" />
                View Details
              </button>

              {order.status === 'delivered' && order.reviewed === false && (
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors">
                  <FaStar className="text-xs" />
                  Write Review
                </button>
              )}

              {order.status === 'processing' && (
                <button className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded hover:bg-red-50 transition-colors">
                  <FaTimesCircle className="text-xs" />
                  Cancel Order
                </button>
              )}

              {(order.status === 'cancelled' || order.status === 'delivered') && (
                <button className="flex items-center gap-2 px-4 py-2 border border-green-200 text-green-600 text-sm font-medium rounded hover:bg-green-50 transition-colors">
                  <FaRedo className="text-xs" />
                  Buy Again
                </button>
              )}
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
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${getStatusConfig(selectedOrder.status).bgColor
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
                    {user?.addresses
                      ?.filter((address) => address.id === selectedOrder.addressId)
                      .map((address) => (
                        <div key={address.id}>
                          <p className="font-semibold text-gray-900 mb-1">
                            {address.name} ({address.phone}) <span className="text-gray-400 font-normal">{address.type}</span>
                          </p>
                          <p className="text-sm text-gray-500">
                            {address.street}, {address.city}, {address.state}
                          </p>
                        </div>
                      )) || <p className="text-gray-500">Address not found</p>}
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

  const PersonalInfoSection = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="h-24 bg-gray-100 rounded animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl text-gray-900 font-semibold">Personal Information</h2>
            <p className="text-gray-500 text-sm mt-1">Manage your personal details</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors">
            <FaEdit className="text-xs" />
            Edit Profile
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
          {/* Profile Header */}
          <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{user?.name || 'User'}</h3>
              <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <InfoCard icon={FaUser} label="Full Name" value={user?.name} isLoading={loading} />
            <InfoCard icon={FaEnvelope} label="Email" value={user?.email} isLoading={loading} />
            <InfoCard icon={FaCalendar} label="Member Since" value={user?.joinDate} isLoading={loading} />
          </div>

          {/* Account Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-900 mb-1">{orders.length}</p>
              <p className="text-xs text-gray-500">Total Orders</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <p className="text-2xl font-semibold text-gray-900 mb-1">{user?.addresses?.length || 0}</p>
              <p className="text-xs text-gray-500">Addresses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-900 mb-1">${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Spent</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AddressesSection = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl text-gray-900 font-semibold">Shipping Addresses</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your delivery locations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors">
          <FaPlus className="text-xs" />
          Add Address
        </button>
      </div>

      {loadingAddresses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-56 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.userAddressId}
              address={address}
              onSetDefault={handleSetDefaultAddress}
              onDelete={handleDeleteAddress}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
          <FaMapMarkerAlt className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 text-base mb-1">No addresses found</p>
          <p className="text-gray-400 text-sm">Add your first shipping address</p>
        </div>
      )}
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
      <div className="w-full bg-gray-50 pt-[70px] pb-20 min-h-screen">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-b border-red-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-red-600">⚠️</div>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-24">
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  {/* User Profile Card */}
                  <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-gray-200">
                    <div className="relative mb-3">
                      <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center">
                        <FaUser className="text-white text-lg" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      {loading ? (
                        <>
                          <div className="h-5 bg-gray-100 rounded animate-pulse mb-2 w-28"></div>
                          <div className="h-4 bg-gray-100 rounded animate-pulse w-32"></div>
                        </>
                      ) : (
                        <>
                          <h3 className="font-semibold text-base text-gray-900 mb-0.5">{user?.name || 'User'}</h3>
                          <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Navigation Menu */}
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-poppins font-semibold text-left transition-all duration-300 cursor-pointer ${activeTab === 'orders'
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
                      className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-poppins font-semibold text-left transition-all duration-300 cursor-pointer ${activeTab === 'personal'
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
                      className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-poppins font-semibold text-left transition-all duration-300  cursor-pointer ${activeTab === 'addresses'
                        ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg scale-105'
                        : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
                        }`}
                    >
                      <FaMapMarkerAlt className="text-lg" />
                      <span className="flex-1">Addresses</span>
                      {activeTab === 'addresses' && <FaChevronRight className="text-sm" />}
                    </button>

                    <div className="pt-3 mt-3 border-t border-gray-200 space-y-1">
                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <FaCog className="text-base" />
                        <span className="flex-1">Settings</span>
                      </button>

                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                        <FaSignOutAlt className="text-base" />
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
