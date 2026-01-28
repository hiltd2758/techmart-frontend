import React, { useState, useEffect } from 'react';
import PaymentMethod from '../../Components/Payment/PaymentMethod';
import PaymentSummary from '../../Components/Payment/PaymentSummary';
import PaymentStatus from '../../Components/Payment/PaymentStatus';
import { FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { countryAPI } from '../../api/countryAPI';
import { addressAPI } from '../../api/addressAPI';

/**
 * Payment Page
 * Integrates PaymentMethod, PaymentSummary, and PaymentStatus components.
 * Manages the payment flow state.
 */
const Payment = () => {
    // State: 'pending', 'processing', 'success', 'failed'
    const [status, setStatus] = useState('pending');
    const [selectedMethod, setSelectedMethod] = useState('');

    // Address & Country State
    const [countries, setCountries] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [processingAddress, setProcessingAddress] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [addressForm, setAddressForm] = useState({
        contactName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        zipCode: '',
        countryId: '',
        stateOrProvinceId: '',
        districtId: ''
    });

    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);

    // Fetch Countries on mount
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setLoadingCountries(true);
                const response = await countryAPI.getCountries();
                // Assuming response format matches common patterns, adjust if needed based on API
                const data = response.data.data || response.data;
                setCountries(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to load countries", error);
            } finally {
                setLoadingCountries(false);
            }
        };
        fetchCountries();
    }, []);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCountryChange = async (e) => {
        const countryId = e.target.value;
        setAddressForm(prev => ({ ...prev, countryId, stateOrProvinceId: '', districtId: '' }));
        setStates([]);
        setDistricts([]);

        if (countryId) {
            try {
                const response = await countryAPI.getStatesByCountryId(countryId);
                setStates(response.data.data || []);
            } catch (error) {
                console.error("Failed to load states", error);
            }
        }
    };

    const handleStateChange = async (e) => {
        const stateId = e.target.value;
        setAddressForm(prev => ({ ...prev, stateOrProvinceId: stateId, districtId: '' }));
        setDistricts([]);

        if (stateId) {
            try {
                const response = await countryAPI.getDistrictsByStateOrProvinceId(stateId);
                setDistricts(response.data.data || []);
            } catch (error) {
                console.error("Failed to load districts", error);
            }
        }
    };

    const handleDistrictChange = (e) => {
        setAddressForm(prev => ({ ...prev, districtId: e.target.value }));
    };

    const handleSaveAddress = async () => {
        try {
            setProcessingAddress(true);
            const response = await addressAPI.createAddress(addressForm);
            const newAddress = response.data.data || response.data;
            setCurrentAddress(newAddress); // Select the newly created address
            setShowAddressForm(false);
        } catch (error) {
            console.error("Failed to save address", error);
            alert("Failed to save address. Please try again.");
        } finally {
            setProcessingAddress(false);
        }
    };

    // Mock Order Data
    const orderData = {
        items: [
            { name: 'Wireless Headphones', quantity: 1, price: 129.99 },
            { name: 'Smart Watch Series 5', quantity: 1, price: 249.50 },
            { name: 'Premium Case', quantity: 2, price: 29.99 }
        ],
        subtotal: 439.47,
        shipping: 15.00,
        tax: 43.95,
        total: 498.42
    };

    const handlePayment = () => {
        if (!selectedMethod) return;

        setStatus('processing');

        // Simulate API call
        setTimeout(() => {
            // Random success/fail for demonstration (80% success)
            const isSuccess = Math.random() > 0.2;
            setStatus(isSuccess ? 'success' : 'failed');
        }, 2000);
    };

    const handleRetry = () => {
        setStatus('pending');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    {status === 'pending' && (
                        <Link to="/cart" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                            <FaArrowLeft className="mr-2" /> Back to Cart
                        </Link>
                    )}
                    <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>
                    <div className="flex items-center text-green-600 text-sm font-medium">
                        <FaShieldAlt className="mr-2" /> Secure Checkout
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Payment Methods / Status */}
                    <div className="lg:col-span-2 space-y-6">
                        {status === 'pending' ? (
                            <>
                                {/* Address Management Section */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Shipping Information</h3>

                                    {!showAddressForm ? (
                                        <div className="space-y-4">
                                            {/* Saved Addresses List (Address Selector) */}
                                            {/* Note: In a real app we would fetch saved addresses here. 
                                                For now we allow creating a new one or showing the current one. */}

                                            {currentAddress ? (
                                                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between border border-blue-200">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{currentAddress.contactName}</p>
                                                        <p className="text-gray-700">{currentAddress.addressLine1}</p>
                                                        <p className="text-gray-600 text-sm">{currentAddress.city}, {currentAddress.zipCode}</p>
                                                        <p className="text-gray-600 text-sm">{currentAddress.phone}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setShowAddressForm(true)}
                                                        className="text-blue-600 text-sm font-semibold hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                                    <p className="text-gray-500 mb-3">No address selected</p>
                                                    <button
                                                        onClick={() => setShowAddressForm(true)}
                                                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                                                    >
                                                        Add New Address
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        /* Address Form */
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                    <input
                                                        type="text"
                                                        name="contactName"
                                                        value={addressForm.contactName}
                                                        onChange={handleAddressChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                                    <input
                                                        type="text"
                                                        name="phone"
                                                        value={addressForm.phone}
                                                        onChange={handleAddressChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                                        placeholder="0123456789"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                                                    <input
                                                        type="text"
                                                        name="addressLine1"
                                                        value={addressForm.addressLine1}
                                                        onChange={handleAddressChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                                        placeholder="123 Main St"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                                                    <input
                                                        type="text"
                                                        name="addressLine2"
                                                        value={addressForm.addressLine2}
                                                        onChange={handleAddressChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                                        placeholder="Apt 4B"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={addressForm.city}
                                                        onChange={handleAddressChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                                        placeholder="Ho Chi Minh City"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                                                    <input
                                                        type="text"
                                                        name="zipCode"
                                                        value={addressForm.zipCode}
                                                        onChange={handleAddressChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                                        placeholder="700000"
                                                    />
                                                </div>
                                                {/* Country Selector */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                                    <select
                                                        name="countryId"
                                                        value={addressForm.countryId}
                                                        onChange={handleCountryChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                                        disabled={loadingCountries}
                                                    >
                                                        <option value="">Select Country</option>
                                                        {countries.map(country => (
                                                            <option key={country.id} value={country.id}>
                                                                {country.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* State Selector */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                                                    <select
                                                        name="stateOrProvinceId"
                                                        value={addressForm.stateOrProvinceId}
                                                        onChange={handleStateChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                                        disabled={!addressForm.countryId}
                                                    >
                                                        <option value="">Select State/Province</option>
                                                        {states.map(state => (
                                                            <option key={state.id} value={state.id}>
                                                                {state.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* District Selector */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                                    <select
                                                        name="districtId"
                                                        value={addressForm.districtId}
                                                        onChange={handleDistrictChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                                        disabled={!addressForm.stateOrProvinceId}
                                                    >
                                                        <option value="">Select District</option>
                                                        {districts.map(district => (
                                                            <option key={district.id} value={district.id}>
                                                                {district.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-3 pt-4">
                                                <button
                                                    onClick={() => setShowAddressForm(false)}
                                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSaveAddress}
                                                    disabled={processingAddress}
                                                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
                                                >
                                                    {processingAddress ? 'Saving...' : 'Save Address'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <PaymentMethod
                                    selectedMethod={selectedMethod}
                                    onSelectMethod={setSelectedMethod}
                                />

                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={handlePayment}
                                        disabled={!selectedMethod || !currentAddress}
                                        className={`
                      px-8 py-4 rounded-lg font-bold text-lg shadow-lg transform transition-all duration-200
                      ${selectedMethod
                                                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                    `}
                                    >
                                        Pay ${orderData.total.toFixed(2)}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <PaymentStatus status={status} onRetry={handleRetry} />
                        )}
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <PaymentSummary orderData={orderData} />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Payment;
