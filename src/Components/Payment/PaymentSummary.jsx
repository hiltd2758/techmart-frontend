import React from 'react';

/**
 * PaymentSummary Component
 * Displays the order summary (subtotal, tax, total).
 * 
 * @param {object} orderData - Object containing subtotal, tax, shipping, and total.
 */
const PaymentSummary = ({ orderData }) => {
    const { subtotal, tax, shipping, total, items = [] } = orderData;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-24">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>

            {/* Items List (Collapsed/Simplified) */}
            <div className="mb-6 space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 truncate flex-1 mr-2">
                            <span className="font-medium text-gray-800">{item.quantity}x</span> {item.name}
                        </span>
                        <span className="text-gray-900 font-medium">${item.price.toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                    Secure breakdown of your payment
                </p>
            </div>
        </div>
    );
};

export default PaymentSummary;
