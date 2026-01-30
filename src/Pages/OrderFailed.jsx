import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaExclamationCircle, FaHome, FaRedo } from 'react-icons/fa';
import { orderAPI } from '../api/orderAPI';
import HomeNavbar from '../Components/HomeNavbar/HomeNavbar';
import Footer from '../Components/Footer/Footer';

const OrderFailed = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const orderId = searchParams.get('orderId');
    const reason = searchParams.get('reason') || 'unknown';
    const message = searchParams.get('message');

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await orderAPI.getOrderById(orderId);
                setOrder(response.data.data);
                console.log('[OrderFailed] Order fetched:', response.data.data);
            } catch (err) {
                console.error('[OrderFailed] Error fetching order:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const getReasonMessage = () => {
        switch (reason) {
            case 'timeout':
                return 'Payment verification timeout. Please check your order status or try again.';
            case 'payment_failed':
                return message || 'Payment failed. Please try again or use a different payment method.';
            case 'cancelled':
                return message || 'Payment was cancelled. Please try again.';
            default:
                return message || 'Something went wrong with your payment. Please try again.';
        }
    };

    const getReasonTitle = () => {
        switch (reason) {
            case 'timeout':
                return 'Payment Verification Timeout';
            case 'payment_failed':
                return 'Payment Failed';
            case 'cancelled':
                return 'Payment Cancelled';
            default:
                return 'Payment Error';
        }
    };

    const handleRetryPayment = () => {
        if (orderId) {
            navigate(`/payment-confirmation/${orderId}`);
        } else {
            navigate('/checkout');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <HomeNavbar />

            <div className="flex-1 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    {loading ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <div className="inline-flex items-center justify-center">
                                <div className="relative w-12 h-12">
                                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-transparent border-t-red-600 border-r-red-600 rounded-full animate-spin"></div>
                                </div>
                            </div>
                            <p className="text-gray-600 mt-4">Loading order details...</p>
                        </div>
                    ) : (
                        <>
                            {/* Error Header */}
                            <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                                    <FaExclamationCircle className="w-10 h-10 text-red-600" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{getReasonTitle()}</h1>
                                <p className="text-gray-600 mb-4">{getReasonMessage()}</p>

                                {orderId && (
                                    <p className="text-sm text-gray-500">
                                        Order ID: <span className="font-semibold text-gray-900">{orderId}</span>
                                    </p>
                                )}
                            </div>

                            {/* Order Details (if available) */}
                            {order && (
                                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Order Information</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Status */}
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Status</p>
                                            <p className="text-lg font-semibold text-gray-900">{order.status}</p>
                                        </div>

                                        {/* Payment Status */}
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                                            <p className="text-lg font-semibold text-red-600">{order.paymentStatus}</p>
                                        </div>

                                        {/* Total Amount */}
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                                            <p className="text-2xl font-bold text-gray-900">
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
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Error Details */}
                                    {(order.rejectReason || order.lastError) && (
                                        <>
                                            <hr className="my-6" />
                                            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                                <p className="text-sm font-semibold text-red-800 mb-2">Error Details:</p>
                                                <p className="text-sm text-red-700">
                                                    {order.rejectReason || order.lastError}
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    {/* Order Items */}
                                    {order.items && order.items.length > 0 && (
                                        <>
                                            <hr className="my-6" />
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">Items</h3>
                                            <div className="space-y-3">
                                                {order.items.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                                                    >
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-900">
                                                                {item.name || `Product ${item.productId}`}
                                                            </p>
                                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-gray-900">
                                                                ${(item.price * item.quantity).toFixed(2)}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                ${item.price?.toFixed(2)} each
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Information Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                                <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
                                <ul className="text-sm text-blue-800 space-y-2">
                                    <li>• Your order is still saved in the system</li>
                                    <li>• You can retry the payment to complete the transaction</li>
                                    <li>• If the problem persists, please contact our support team</li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 flex-col sm:flex-row">
                                <button
                                    onClick={handleRetryPayment}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                >
                                    <FaRedo /> Try Again
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
                                >
                                    <FaHome /> Back to Home
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default OrderFailed;
