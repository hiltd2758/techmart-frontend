import React from 'react';
import { FaCreditCard, FaUniversity, FaMoneyBillWave } from 'react-icons/fa';

/**
 * PaymentMethod Component
 * Allows users to select a payment method.
 * 
 * @param {string} selectedMethod - The currently selected payment method ID.
 * @param {function} onSelectMethod - Callback function when a method is selected.
 * @param {boolean} disabled - Whether the selection is disabled (e.g., during processing).
 */
const PaymentMethod = ({ selectedMethod, onSelectMethod, disabled = false }) => {
    const methods = [
        {
            id: 'credit_card',
            name: 'Credit Card',
            description: 'Pay securely with Visa, Mastercard',
            icon: <FaCreditCard className="w-6 h-6" />,
            color: 'text-blue-500'
        },
        {
            id: 'bank_transfer',
            name: 'Bank Transfer',
            description: 'Direct bank transfer to our account',
            icon: <FaUniversity className="w-6 h-6" />,
            color: 'text-green-500'
        },
        {
            id: 'cod',
            name: 'Cash on Delivery',
            description: 'Pay when you receive your order',
            icon: <FaMoneyBillWave className="w-6 h-6" />,
            color: 'text-yellow-500'
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h3>
            <div className="space-y-3">
                {methods.map((method) => (
                    <div
                        key={method.id}
                        onClick={() => !disabled && onSelectMethod(method.id)}
                        className={`
              relative flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 border-2
              ${selectedMethod === method.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                    >
                        <div className={`p-3 rounded-full bg-white shadow-sm mr-4 ${method.color}`}>
                            {method.icon}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{method.name}</h4>
                            <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                        <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${selectedMethod === method.id ? 'border-blue-500' : 'border-gray-300'}
            `}>
                            {selectedMethod === method.id && (
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentMethod;
