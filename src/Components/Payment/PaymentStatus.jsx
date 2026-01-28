import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

/**
 * PaymentStatus Component
 * Displays the result of the payment transaction (Success, Failed, Processing).
 * 
 * @param {string} status - 'success', 'failed', 'processing'
 * @param {function} onRetry - User retry action for failed payments.
 */
const PaymentStatus = ({ status, onRetry }) => {
    if (status === 'processing') {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="inline-block animate-spin text-blue-500 mb-6">
                    <FaSpinner className="w-16 h-16" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
                <p className="text-gray-500">Please wait while we confirm your transaction...</p>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-12 text-center">
                <div className="inline-block text-green-500 mb-6 animate-bounce">
                    <FaCheckCircle className="w-20 h-20" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Thank you for your purchase. Your order has been confirmed and is being processed.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        to="/account/order-history"
                        className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        View Order
                    </Link>
                    <Link
                        to="/"
                        className="px-6 py-3 bg-blue-600 rounded-lg font-semibold text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-red-100 p-12 text-center">
                <div className="inline-block text-red-500 mb-6">
                    <FaTimesCircle className="w-20 h-20" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    We couldn't process your payment. Please check your details or try a different payment method.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onRetry}
                        className="px-6 py-3 bg-red-600 rounded-lg font-semibold text-white hover:bg-red-700 shadow-lg hover:shadow-xl transition-all"
                    >
                        Try Again
                    </button>
                    <Link
                        to="/contact"
                        className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        );
    }

    return null;
};

export default PaymentStatus;
