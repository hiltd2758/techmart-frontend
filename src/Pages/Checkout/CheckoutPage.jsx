import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPhone, FaMapMarkerAlt, FaTruck, FaCreditCard, FaTicketAlt, FaPlus } from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';
import { useCart } from '../../Context/CartContext';
import { addressAPI } from '../../api/addressAPI';
import { countryAPI } from '../../api/countryAPI';
import { checkoutAPI, PAYMENT_METHODS } from '../../api/checkoutAPI';
import { orderAPI } from '../../api/orderAPI';
import { validateCheckoutResponse, validateOrderResponse, validateCartItems, validateShippingAddress, formatErrorMessage } from '../../utils/checkoutValidation';
import HomeNavbar from '../../Components/HomeNavbar/HomeNavbar';
import Footer from '../../Components/Footer/Footer';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cartItems, cartTotal } = useCart();

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);

    const [newAddress, setNewAddress] = useState({
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

    const [shippingMethod, setShippingMethod] = useState('STANDARD');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [promoCode, setPromoCode] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const [addressError, setAddressError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [checkoutId, setCheckoutId] = useState(null);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [checkoutData, setCheckoutData] = useState(null);  // NEW: Store full checkout data

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        setEmail(user.email || '');
        loadAddresses();
        loadCountries();
        
        // Only create checkout if cart has items
        if (cartItems && cartItems.length > 0 && !checkoutId) {
            createCheckout();
        }
    }, [user, navigate, cartItems, checkoutId]);

// Line ~85-105 trong createCheckout
const createCheckout = async () => {
    // Validate cart items first
    const cartValidation = validateCartItems(cartItems);
    if (!cartValidation.valid) {
        console.error('[Checkout] Cart validation failed:', cartValidation.errors);
        alert('Invalid cart: ' + cartValidation.errors.join(', '));
        return;
    }

    try {
        setCheckoutLoading(true);
        const checkoutData = {
            items: cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }))
        };
        
        console.log('[Checkout] Creating checkout with data:', checkoutData);
        
        const response = await checkoutAPI.createCheckout(checkoutData);
        console.log('[Checkout] Full response:', response.data);
        
        // ✅ Enhanced: Extract, validate and store all checkout data
        const createdCheckout = response.data?.data;
        
        // Validate response
        const validation = validateCheckoutResponse(createdCheckout);
        if (!validation.valid) {
            console.error('[Checkout] Response validation failed:', validation.errors);
            throw new Error('Invalid checkout response: ' + validation.errors.join(', '));
        }
        
        // Store both ID and full checkout data
        setCheckoutId(createdCheckout.id);
        setCheckoutData(createdCheckout);
        
        console.log('[Checkout] Created checkout:', {
            id: createdCheckout.id,
            status: createdCheckout.status,
            totalAmount: createdCheckout.totalAmount,
            itemCount: createdCheckout.items?.length || 0
        });
    } catch (error) {
        console.error('[Checkout] Error creating checkout:', error);
        console.error('[Checkout] Error details:', error.response?.data);
        
        const errorMessage = formatErrorMessage(error);
        alert('Checkout creation failed: ' + errorMessage);
    } finally {
        setCheckoutLoading(false);
    }
};

    const loadAddresses = async () => {
        try {
            setAddressLoading(true);
            const response = await addressAPI.getUserAddresses();
            const userAddresses = response.data.data || [];
            setAddresses(userAddresses);
            if (userAddresses.length > 0) {
                setSelectedAddress(userAddresses[0].id);
            }
        } catch (error) {
            console.error('Error loading addresses:', error);
        } finally {
            setAddressLoading(false);
        }
    };

    const loadCountries = async () => {
        try {
            const response = await countryAPI.getCountries();
            setCountries(response.data.data || []);
        } catch (error) {
            console.error('Error loading countries:', error);
        }
    };

    const handleCountryChange = async (countryId) => {
        setNewAddress({ ...newAddress, countryId, stateOrProvinceId: '', districtId: '' });
        setStates([]);
        setDistricts([]);

        if (!countryId) return;

        try {
            const response = await countryAPI.getStatesByCountryId(countryId);
            setStates(response.data.data || []);
        } catch (error) {
            console.error('Error loading states:', error);
        }
    };

    const handleStateChange = async (stateOrProvinceId) => {
        setNewAddress({ ...newAddress, stateOrProvinceId, districtId: '' });
        setDistricts([]);

        if (!stateOrProvinceId) return;

        try {
            const response = await countryAPI.getDistrictsByStateOrProvinceId(stateOrProvinceId);
            setDistricts(response.data.data || []);
        } catch (error) {
            console.error('Error loading districts:', error);
        }
    };

    const handleUseTestAddress = () => {
        setNewAddress({
            contactName: 'Nguyen Van Test',
            phone: '0123456789',
            addressLine1: '123 Test Street',
            addressLine2: 'Apartment 5B',
            city: 'Test City',
            zipCode: '700000',
            countryId: '1',
            stateOrProvinceId: '1',
            districtId: '1'
        });
    };

    const handlePaymentMethodChange = async (newMethod) => {
        setPaymentMethod(newMethod);
        
        if (!checkoutId) return;

        try {
            await checkoutAPI.updatePaymentMethod(checkoutId, newMethod);
            console.log('[Checkout] Payment method updated:', newMethod);
        } catch (error) {
            console.error('[Checkout] Error updating payment method:', error);
            alert('Failed to update payment method. Please try again.');
        }
    };

    const handleShowAddAddressForm = () => {
        setNewAddress({
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
        setShowAddressForm(true);
        setAddressError(null);
        setValidationErrors({});
    };

    const handleAddNewAddress = async () => {
        setAddressError(null);
        setValidationErrors({});

        // Validate required fields
        if (!newAddress.contactName || !newAddress.phone || !newAddress.addressLine1 || 
            !newAddress.city || !newAddress.zipCode || !newAddress.countryId || 
            !newAddress.stateOrProvinceId || !newAddress.districtId) {
            setAddressError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            
            const addressData = {
                contactName: newAddress.contactName,
                phone: newAddress.phone,
                addressLine1: newAddress.addressLine1,
                addressLine2: newAddress.addressLine2 || '',
                city: newAddress.city,
                zipCode: newAddress.zipCode,
                countryId: parseInt(newAddress.countryId),
                stateOrProvinceId: parseInt(newAddress.stateOrProvinceId),
                districtId: parseInt(newAddress.districtId)
            };

            console.log('Creating address with data:', addressData);

            const response = await addressAPI.createAddress(addressData);
            const createdAddress = response.data.data;

            console.log('Address created successfully:', createdAddress);

            setAddresses(prevAddresses => [...prevAddresses, createdAddress]);
            setSelectedAddress(createdAddress.id);
            
            setShowAddressForm(false);
            setNewAddress({
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
            setAddressError(null);
            setValidationErrors({});
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to save address';
            const fieldErrors = error.response?.data?.data;

            console.error('Error creating address:', errorMessage);
            console.error('Response data:', error.response?.data);

            setAddressError(errorMessage);

            if (fieldErrors && typeof fieldErrors === 'object') {
                setValidationErrors(fieldErrors);
            }
        } finally {
            setLoading(false);
        }
    };

const handleConfirmCheckout = async () => {
    try {
        // Validate cart has items
        const cartValidation = validateCartItems(cartItems);
        if (!cartValidation.valid) {
            alert('Your cart is invalid: ' + cartValidation.errors.join(', '));
            navigate('/product');
            return;
        }

        // Validate inputs
        if (!selectedAddress) {
            alert('Please select a shipping address');
            return;
        }

        if (!email || !phone) {
            alert('Please fill in contact information');
            return;
        }

        if (!checkoutId) {
            alert('Checkout not initialized. Creating new checkout...');
            await createCheckout();
            return;
        }

        // ✅ Tìm address object từ ID
        const selectedAddressObj = addresses.find(addr => addr.id === selectedAddress);
        
        if (!selectedAddressObj) {
            alert('Selected address not found. Please select again.');
            return;
        }

        // Validate shipping address
        const addressValidation = validateShippingAddress(selectedAddressObj);
        if (!addressValidation.valid) {
            console.error('[Debug] Validation errors:', addressValidation.errors);
            alert('Address is invalid: ' + addressValidation.errors.join(', '));
            return;
        }

        setLoading(true);

        console.log('[Order] Creating order from checkout:', {
            checkoutId: checkoutId,
            checkoutStatus: checkoutData?.status,
            checkoutTotalAmount: checkoutData?.totalAmount
        });

        // Build order items from cart
        const orderItems = cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price || 0
        }));

        // Prepare order creation payload
        const orderData = {
            checkoutId: checkoutId,
            email: email,
            note: notes || '',
            promotionCode: promoCode || null,
            shippingAddressId: selectedAddressObj.id,
            items: orderItems
        };

        console.log('[Order] Order payload:', orderData);

            // Create the order (backend does not support GET by checkoutId)
            const createResp = await orderAPI.createOrder(orderData);
            console.log('[Order] Create order response:', createResp.data);

            const createdOrder = createResp.data?.data;
            const createdOrderId = Number(createdOrder?.orderId || createdOrder?.id);

            if (!createdOrderId || !Number.isFinite(createdOrderId)) {
                console.error('[Order] createOrder did not return a numeric orderId:', createdOrder);
                setLoading(false);
                alert('Order creation failed to return an order ID. Please try again or contact support.');
                return;
            }

            // Optionally poll briefly for order details if backend is eventually consistent
            let fetchedOrder = null;
            const MAX_ATTEMPTS = 6;
            for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
                try {
                    const getResp = await orderAPI.getOrderById(createdOrderId);
                    fetchedOrder = getResp.data?.data;
                    if (fetchedOrder) break;
                } catch (err) {
                    console.warn(`[Order] Attempt ${attempt + 1} to fetch order ${createdOrderId} failed:`, err);
                    // if 404, retry after wait; other errors, abort
                    if (err.response && err.response.status !== 404) {
                        break;
                    }
                }
                // small delay before retry
                await new Promise(res => setTimeout(res, 1000));
            }

            if (fetchedOrder) {
                console.log('[Order] Order ready:', fetchedOrder);
                setLoading(false);
                navigate(`/payment-confirmation/${createdOrderId}`);
                return;
            } else {
                setLoading(false);
                alert('Order created but is not available yet. Please check your orders or contact support with your checkout reference.');
                return;
            }


    } catch (error) {
        console.error('[Order] Error:', error);
        setLoading(false);
        const errorMessage = formatErrorMessage(error);
        alert(errorMessage);
    }
};

    const shippingCosts = {
        STANDARD: 5.00,
        EXPRESS: 15.00,
        SAME_DAY: 30.00
    };

    const totalAmount = cartTotal + (shippingCosts[shippingMethod] || 0);

    return (
        <>
            <HomeNavbar />
            <div className="w-full bg-gray-50 pt-[120px] pb-[100px] min-h-screen">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <FaArrowLeft className="mr-2" /> Back
                        </button>
                        <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>
                        <div className="w-[100px]"></div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contact Info */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            readOnly
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaPhone className="inline mr-2" />
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Enter your phone number"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                        <FaMapMarkerAlt className="mr-2" /> Shipping Address
                                    </h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowAddressForm(!showAddressForm)}
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            <FaPlus /> Add New
                                        </button>
                                        <button
                                            onClick={handleUseTestAddress}
                                            className="flex items-center gap-2 text-green-600 hover:text-green-800 font-medium px-3 py-1 border border-green-300 rounded-lg hover:bg-green-50"
                                            title="Fill form with test IDs (1,1,1)"
                                        >
                                            Test
                                        </button>
                                    </div>
                                </div>

                                {showAddressForm && (
                                    <div className="mb-6 p-4 bg-blue-50 rounded-lg space-y-4">
                                        {/* Error Messages */}
                                        {addressError && (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-sm text-red-700 font-medium">{addressError}</p>
                                            </div>
                                        )}

                                        {Object.keys(validationErrors).length > 0 && (
                                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <p className="text-sm text-yellow-700 font-medium mb-2">Validation Errors:</p>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {Object.entries(validationErrors).map(([field, error]) => (
                                                        <li key={field} className="text-sm text-yellow-700">
                                                            <strong>{field}:</strong> {error}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Contact Name and Phone */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Contact Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newAddress.contactName}
                                                    onChange={(e) => setNewAddress({ ...newAddress, contactName: e.target.value })}
                                                    placeholder="Full Name"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={newAddress.phone}
                                                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                    placeholder="0123456789"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Country and State */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Country *
                                                </label>
                                                <select
                                                    value={newAddress.countryId}
                                                    onChange={(e) => handleCountryChange(e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select Country</option>
                                                    {countries.map(country => (
                                                        <option key={country.id} value={country.id}>
                                                            {country.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    State/Province *
                                                </label>
                                                <select
                                                    value={newAddress.stateOrProvinceId}
                                                    onChange={(e) => handleStateChange(e.target.value)}
                                                    disabled={!newAddress.countryId}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                                >
                                                    <option value="">Select State</option>
                                                    {states.map(state => (
                                                        <option key={state.id} value={state.id}>
                                                            {state.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* District and City */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    District *
                                                </label>
                                                <select
                                                    value={newAddress.districtId}
                                                    onChange={(e) => setNewAddress({ ...newAddress, districtId: e.target.value })}
                                                    disabled={!newAddress.stateOrProvinceId}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                                >
                                                    <option value="">Select District</option>
                                                    {districts.map(district => (
                                                        <option key={district.id} value={district.id}>
                                                            {district.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                    placeholder="City"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Address Lines */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Address Line 1 *
                                            </label>
                                            <input
                                                type="text"
                                                value={newAddress.addressLine1}
                                                onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                                                placeholder="Street Address"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Address Line 2
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newAddress.addressLine2}
                                                    onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                                                    placeholder="Apartment, suite, etc."
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Zip Code *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newAddress.zipCode}
                                                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                                                    placeholder="Postal Code"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleAddNewAddress}
                                            disabled={loading}
                                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {loading ? 'Saving...' : 'Save Address'}
                                        </button>
                                    </div>
                                )}

                                {addressLoading ? (
                                    <p>Loading addresses...</p>
                                ) : addresses.length > 0 ? (
                                    <div className="space-y-3">
                                        {addresses.map(address => (
                                            <div
                                                key={address.id}
                                                className={`p-4 border-2 rounded-lg cursor-pointer transition ${selectedAddress === address.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                onClick={() => setSelectedAddress(address.id)}
                                            >
                                                <p className="font-medium text-gray-900">
                                                    {address.contactName} - {address.phone}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {address.addressLine1}
                                                    {address.addressLine2 && `, ${address.addressLine2}`}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {address.city}, {address.zipCode}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">No addresses. Add new address above.</p>
                                )}
                            </div>

                            {/* Shipping Method */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <FaTruck className="mr-2" /> Shipping Method
                                </h2>
                                <div className="space-y-3">
                                    {[
                                        { value: 'STANDARD', label: 'Standard Shipping (5-7 days)', price: '5.00' },
                                        { value: 'EXPRESS', label: 'Express Shipping (2-3 days)', price: '15.00' },
                                        { value: 'SAME_DAY', label: 'Same Day Delivery', price: '30.00' }
                                    ].map(method => (
                                        <label key={method.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                value={method.value}
                                                checked={shippingMethod === method.value}
                                                onChange={(e) => setShippingMethod(e.target.value)}
                                                className="mr-3"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{method.label}</p>
                                            </div>
                                            <p className="font-medium text-gray-900">${method.price}</p>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <FaCreditCard className="mr-2" /> Payment Method
                                </h2>
                                <div className="space-y-3">
                                    {[
                                        { value: 'COD', label: 'Cash on Delivery' },
                                        { value: 'VNPAY', label: 'VNPay' },
                                        { value: 'CREDIT_CARD', label: 'Credit Card' }
                                    ].map(method => (
                                        <label key={method.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                value={method.value}
                                                checked={paymentMethod === method.value}
                                                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                                                className="mr-3"
                                            />
                                            <p className="font-medium text-gray-900">{method.label}</p>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <FaTicketAlt className="mr-2" /> Promo Code
                                </h2>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Enter promo code"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Notes</h2>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any special requests..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>

                        {/* Right Column: Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-[120px]">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                                {/* Items */}
                                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-[300px] overflow-y-auto">
                                    {cartItems.map(item => (
                                        <div key={item.productId} className="flex justify-between text-sm">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium text-gray-900">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <p>Subtotal:</p>
                                        <p>${cartTotal.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <p>Shipping:</p>
                                        <p>${(shippingCosts[shippingMethod] || 0).toFixed(2)}</p>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg text-gray-900">
                                        <p>Total:</p>
                                        <p>${totalAmount.toFixed(2)}</p>
                                    </div>
                                </div>

                                {/* Confirm Button */}
                                <button
                                    onClick={handleConfirmCheckout}
                                    disabled={loading || !selectedAddress || checkoutLoading}
                                    className="w-full bg-gradient-to-r from-[#0F2854] to-[#1a3a6e] text-white py-3 rounded-lg font-bold hover:from-[#0a1c3b] hover:to-[#0d2846] disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    {loading || checkoutLoading ? 'Processing...' : 'Confirm Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CheckoutPage;