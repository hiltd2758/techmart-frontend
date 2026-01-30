import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { orderAPI } from '../../api/orderAPI';
import { paymentAPI } from '../../api/paymentAPI';
import HomeNavbar from '../../Components/HomeNavbar/HomeNavbar';
import Footer from '../../Components/Footer/Footer';

const PaymentConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get data from navigation state
    const { checkoutId, email, totalAmount } = location.state || {};
    
    // State management
    const [orderId, setOrderId] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [orderStatus, setOrderStatus] = useState('PENDING');
    const [paymentStatus, setPaymentStatus] = useState('PENDING');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pollingCount, setPollingCount] = useState(0);
    const [statusMessage, setStatusMessage] = useState('Processing your order...');

    // ============ STEP 1: POLLING FOR ORDER CREATION ============
    useEffect(() => {
        if (!checkoutId) {
            setError('No checkout information found');
            setLoading(false);
            return;
        }

        let pollingInterval;
        let pollCount = 0;
        const MAX_POLLS = 60; // 60 lần * 5 giây = 5 phút

        const pollForOrder = async () => {
            try {
                console.log(`[Polling] Checking order creation... Attempt ${pollCount + 1}/${MAX_POLLS}`);
                setStatusMessage(`Checking order status... (${pollCount + 1}/${MAX_POLLS})`);
                
                // ✅ GET order by checkoutId
                const response = await orderAPI.getOrderByCheckoutId(checkoutId);
                const order = response.data?.data;

                if (order && order.orderId) {
                    console.log('[Polling] Order found:', order);
                    
                    setOrderId(order.orderId);
                    setOrderData(order);
                    setOrderStatus(order.status);
                    setPaymentStatus(order.paymentStatus);
                    setLoading(false);
                    
                    // ✅ Stop polling khi đã có orderId
                    clearInterval(pollingInterval);
                    
                    // ✅ Nếu payment method là VNPAY và chưa thanh toán, init payment
                    if (order.paymentMethodId === 'VNPAY' && order.paymentStatus === 'PENDING') {
                        setStatusMessage('Initializing payment...');
                        initPayment(order.orderId);
                    } else if (order.paymentMethodId === 'COD') {
                        setStatusMessage('Order confirmed! Cash on delivery.');
                        // Redirect to success page after 2 seconds
                        setTimeout(() => {
                            navigate(`/order-success/${order.orderId}`);
                        }, 2000);
                    }
                } else {
                    pollCount++;
                    setPollingCount(pollCount);
                    
                    if (pollCount >= MAX_POLLS) {
                        clearInterval(pollingInterval);
                        setError('Order creation timeout. Please check your orders or contact support.');
                        setLoading(false);
                    }
                }
            } catch (err) {
                console.error('[Polling] Error:', err);
                
                // Nếu 404 (order chưa tạo xong), tiếp tục polling
                if (err.response?.status === 404) {
                    pollCount++;
                    setPollingCount(pollCount);
                    
                    if (pollCount >= MAX_POLLS) {
                        clearInterval(pollingInterval);
                        setError('Order not found after timeout. Please contact support with your checkout ID.');
                        setLoading(false);
                    }
                } else {
                    // Lỗi khác (network, auth, etc.), dừng polling
                    clearInterval(pollingInterval);
                    setError(`Error checking order status: ${err.response?.data?.message || err.message}`);
                    setLoading(false);
                }
            }
        };

        // ✅ Poll ngay lập tức lần đầu
        pollForOrder();
        
        // ✅ Poll mỗi 5 giây
        pollingInterval = setInterval(pollForOrder, 5000);

        // Cleanup on unmount
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [checkoutId, navigate]);

    // ============ STEP 2: INIT PAYMENT WITH VNPAY ============
    const initPayment = async (orderId) => {
        try {
            console.log('[Payment] Initializing payment for order:', orderId);
            setStatusMessage('Redirecting to payment gateway...');
            
            const response = await paymentAPI.initiatePayment(orderId);
            const paymentData = response.data?.data;

            if (paymentData && paymentData.redirectUrl) {
                console.log('[Payment] Redirecting to VNPay:', paymentData.redirectUrl);
                
                // ✅ Save payment info to localStorage để check khi quay lại
                localStorage.setItem('pendingPayment', JSON.stringify({
                    orderId: orderId,
                    paymentId: paymentData.paymentId,
                    initiatedAt: new Date().toISOString()
                }));
                
                // ✅ Redirect to VNPay
                window.location.href = paymentData.redirectUrl;
            } else {
                setError('Payment initialization failed - no redirect URL');
                setLoading(false);
            }
        } catch (err) {
            console.error('[Payment] Error:', err);
            setError(`Failed to initialize payment: ${err.response?.data?.message || err.message}`);
            setLoading(false);
        }
    };

    // ============ STEP 3: POLLING ORDER STATUS (after user returns from VNPay) ============
    useEffect(() => {
        if (!orderId) return;

        // Check if we're returning from VNPay
        const urlParams = new URLSearchParams(window.location.search);
        const vnpResponseCode = urlParams.get('vnp_ResponseCode');
        
        if (vnpResponseCode) {
            console.log('[VNPay] Return from VNPay with response code:', vnpResponseCode);
            
            // Clear pending payment
            localStorage.removeItem('pendingPayment');
            
            // Start polling order status
            let statusPollingInterval;
            let pollCount = 0;
            const MAX_STATUS_POLLS = 60;

            const pollOrderStatus = async () => {
                try {
                    console.log(`[Status Polling] Checking payment status... Attempt ${pollCount + 1}`);
                    setStatusMessage(`Confirming payment... (${pollCount + 1})`);
                    
                    const response = await orderAPI.getOrderById(orderId);
                    const order = response.data?.data;

                    if (order) {
                        setOrderData(order);
                        setOrderStatus(order.status);
                        setPaymentStatus(order.paymentStatus);

                        // ✅ Payment thành công
                        if (order.paymentStatus === 'PAID' || order.paymentStatus === 'SUCCESS') {
                            console.log('[Status Polling] Payment confirmed!');
                            clearInterval(statusPollingInterval);
                            setStatusMessage('Payment successful!');
                            setLoading(false);
                            
                            // Navigate to success page
                            setTimeout(() => {
                                navigate(`/order-success/${orderId}`);
                            }, 2000);
                            return;
                        }
                        
                        // ✅ Payment thất bại
                        if (order.paymentStatus === 'FAILED' || order.paymentStatus === 'CANCELLED') {
                            console.log('[Status Polling] Payment failed');
                            clearInterval(statusPollingInterval);
                            setError('Payment failed or cancelled. Please try again.');
                            setLoading(false);
                            return;
                        }
                    }

                    pollCount++;
                    if (pollCount >= MAX_STATUS_POLLS) {
                        clearInterval(statusPollingInterval);
                        setError('Payment confirmation timeout. Please check your order status.');
                        setLoading(false);
                    }
                } catch (err) {
                    console.error('[Status Polling] Error:', err);
                    pollCount++;
                    
                    if (pollCount >= MAX_STATUS_POLLS) {
                        clearInterval(statusPollingInterval);
                        setError('Error confirming payment. Please check your order status.');
                        setLoading(false);
                    }
                }
            };

            // Poll immediately then every 5 seconds
            pollOrderStatus();
            statusPollingInterval = setInterval(pollOrderStatus, 5000);

            return () => {
                if (statusPollingInterval) {
                    clearInterval(statusPollingInterval);
                }
            };
        }
    }, [orderId, navigate]);

    // ============ RENDER LOADING STATE ============
    if (loading) {
        return (
            <>
                <HomeNavbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-[120px] pb-[100px]">
                    <div className="text-center max-w-md mx-auto p-8">
                        <div className="relative mb-6">
                            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="text-blue-600 font-bold text-xl">{pollingCount}</div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {statusMessage}
                        </h2>
                        <p className="text-gray-600 mb-4">Please wait, this may take a moment...</p>
                        {checkoutId && (
                            <p className="text-xs text-gray-400 font-mono">Checkout: {checkoutId}</p>
                        )}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                                ⏳ Do not close this window. We're processing your order.
                            </p>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // ============ RENDER ERROR STATE ============
    if (error) {
        return (
            <>
                <HomeNavbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-[120px] pb-[100px]">
                    <div className="text-center max-w-md mx-auto p-8">
                        <div className="text-red-600 mb-6">
                            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Processing Error</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        {checkoutId && (
                            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                                <p className="text-sm text-gray-700 mb-1">Reference Information:</p>
                                <p className="text-xs text-gray-500 font-mono break-all">
                                    Checkout ID: {checkoutId}
                                </p>
                                {orderId && (
                                    <p className="text-xs text-gray-500 font-mono mt-1">
                                        Order ID: {orderId}
                                    </p>
                                )}
                            </div>
                        )}
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/orders')}
                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                            >
                                View My Orders
                            </button>
                            <button
                                onClick={() => navigate('/product')}
                                className="w-full bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // ============ RENDER SUCCESS STATE (Order created, waiting for payment) ============
    return (
        <>
            <HomeNavbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-[120px] pb-[100px]">
                <div className="text-center max-w-2xl mx-auto p-8">
                    <div className="text-green-600 mb-6">
                        <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Created Successfully!</h2>
                    
                    {orderId && (
                        <div className="mb-6">
                            <p className="text-lg text-gray-600 mb-2">Order Number</p>
                            <p className="text-2xl font-bold text-blue-600">#{orderId}</p>
                        </div>
                    )}

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Details</h3>
                        <div className="space-y-3 text-left">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Email:</span>
                                <span className="font-medium">{orderData?.email || email}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Order Status:</span>
                                <span className="font-medium text-blue-600">{orderStatus}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Payment Status:</span>
                                <span className={`font-medium ${
                                    paymentStatus === 'PAID' || paymentStatus === 'SUCCESS' 
                                        ? 'text-green-600' 
                                        : paymentStatus === 'FAILED' 
                                        ? 'text-red-600' 
                                        : 'text-yellow-600'
                                }`}>
                                    {paymentStatus}
                                </span>
                            </div>
                            {orderData?.totalAmount && (
                                <div className="flex justify-between pt-2">
                                    <span className="text-gray-600 font-bold">Total Amount:</span>
                                    <span className="font-bold text-xl">${orderData.totalAmount.toFixed(2)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {paymentStatus === 'PENDING' && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                ⏳ Waiting for payment confirmation. If you've already paid, please wait a moment...
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        {orderId && (
                            <button
                                onClick={() => navigate(`/orders/${orderId}`)}
                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                            >
                                View Order Details
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/product')}
                            className="w-full bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PaymentConfirmation;