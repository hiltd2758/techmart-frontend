import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaArrowRight, FaHome } from 'react-icons/fa';
import { orderAPI } from '../api/orderAPI';
import HomeNavbar from '../Components/HomeNavbar/HomeNavbar';
import Footer from '../Components/Footer/Footer';

const OrderSuccess = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryOrderId = searchParams.get('orderId') || orderId;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const response = await orderAPI.getOrderById(queryOrderId);
                setOrder(response.data.data);
                console.log('[OrderSuccess] Order fetched:', response.data.data);
            } catch (err) {
                console.error('[OrderSuccess] Error fetching order:', err);
                setError('Failed to load order details.');
            } finally {
                setLoading(false);
            }
        };

        if (queryOrderId) {
            fetchOrder();
        }
    }, [queryOrderId]);

    const getPaymentMethodLabel = (method) => {
        switch (method) {
            case 'COD':
                return 'Cash on Delivery';
            case 'VNPAY':
                return 'VNPay';
            case 'CREDIT_CARD':
                return 'Credit Card';
            default:
                return method;
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
            SHIPPED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Shipped' },
            DELIVERED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
            CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
        };
        const badge = badges[status] || badges.PENDING;
        return badge;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <HomeNavbar />

            <div className="flex-1 py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    {loading ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <div className="inline-flex items-center justify-center">
                                <div className="relative w-12 h-12">
                                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 border-r-blue-600 rounded-full animate-spin"></div>
                                </div>
                            </div>
                            <p className="text-gray-600 mt-4">Loading order details...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                <svg
                                    className="w-8 h-8 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2"
                            >
                                <FaHome /> Back to Home
                            </button>
                        </div>
                    ) : order ? (
                        <>
                            {/* Success Header */}
                            <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                                    <FaCheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
                                <p className="text-gray-600 mb-4">Your order has been successfully placed.</p>
                                <p className="text-sm text-gray-500">
                                    Order ID: <span className="font-semibold text-gray-900">{order.id}</span>
                                </p>
                            </div>

                            {/* Order Details */}
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {/* Status */}
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Status</p>
                                        <div
                                            className={`inline-block px-4 py-2 rounded-full font-semibold ${
                                                getStatusBadge(order.status).bg
                                            } ${getStatusBadge(order.status).text}`}
                                        >
                                            {getStatusBadge(order.status).label}
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {getPaymentMethodLabel(order.paymentMethod)}
                                        </p>
                                    </div>

                                    {/* Total Amount */}
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            ${order.totalAmount?.toFixed(2) || '0.00'}
                                        </p>
                                    </div>

                                    {/* Order Date */}
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Order Date</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <hr className="my-6" />

                                {/* Order Items */}
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Items</h3>
                                {order.items && order.items.length > 0 ? (
                                    <div className="space-y-3">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">{item.name || `Product ${item.productId}`}</p>
                                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                    <p className="text-sm text-gray-600">${item.price?.toFixed(2)} each</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">No items in order</p>
                                )}
                            </div>

                            {/* Shipping Address */}
                            {order.shippingAddress && (
                                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
                                    <div className="text-gray-700">
                                        <p className="font-semibold mb-2">{order.shippingAddress.contactName}</p>
                                        <p>{order.shippingAddress.addressLine1}</p>
                                        {order.shippingAddress.addressLine2 && (
                                            <p>{order.shippingAddress.addressLine2}</p>
                                        )}
                                        <p>
                                            {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                                        </p>
                                        <p className="mt-3 text-sm">
                                            <span className="text-gray-600">Phone: </span>
                                            {order.shippingAddress.phone}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => navigate(`/order-details/${queryOrderId}`)}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                >
                                    <FaArrowRight /> View Full Details
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
                                >
                                    <FaHome /> Continue Shopping
                                </button>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default OrderSuccess;
