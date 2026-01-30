/**
 * Checkout & Payment Data Validation Utility
 * Ensures all API responses contain required fields before proceeding
 */

/**
 * Validate checkout response contains all required fields
 * @param {object} checkoutData - Raw checkout data from API
 * @returns {object} - Normalized checkout with validation errors
 */
export const validateCheckoutResponse = (checkoutData) => {
    const errors = [];
    
    if (!checkoutData) {
        return {
            valid: false,
            errors: ['Checkout data is empty'],
            data: null
        };
    }
    
    // Validate required fields
    if (!checkoutData.id && !checkoutData.checkoutId) {
        errors.push('Missing checkout ID');
    }
    
    if (!checkoutData.status) {
        errors.push('Missing checkout status');
    }
    
    if (checkoutData.items === undefined) {
        errors.push('Missing items array');
    } else if (!Array.isArray(checkoutData.items)) {
        errors.push('Items must be an array');
    }
    
    if (checkoutData.totalAmount === undefined || checkoutData.totalAmount === null) {
        errors.push('Missing total amount');
    } else if (typeof checkoutData.totalAmount !== 'number' || checkoutData.totalAmount < 0) {
        errors.push('Invalid total amount');
    }
    
    return {
        valid: errors.length === 0,
        errors,
        data: checkoutData
    };
};

/**
 * Validate order response contains all required fields
 * @param {object} orderData - Raw order data from API
 * @returns {object} - Normalized order with validation errors
 */
export const validateOrderResponse = (orderData) => {
    const errors = [];
    
    if (!orderData) {
        return {
            valid: false,
            errors: ['Order data is empty'],
            data: null
        };
    }
    
    // Validate required fields
    const orderId = orderData.orderId || orderData.id;
    if (!orderId) {
        errors.push('Missing order ID');
    }
    
    if (!orderData.status) {
        errors.push('Missing order status');
    }
    
    if (!orderData.paymentStatus) {
        errors.push('Missing payment status');
    }
    
    if (!orderData.shipmentStatus) {
        errors.push('Missing shipment status');
    }
    
    if (orderData.totalAmount === undefined || orderData.totalAmount === null) {
        errors.push('Missing total amount');
    }
    
    if (!orderData.checkoutId) {
        console.warn('[OrderValidation] Warning: checkoutId is missing');
    }
    
    return {
        valid: errors.length === 0,
        errors,
        data: orderData,
        orderId
    };
};

/**
 * Validate payment initiation response contains all required fields
 * @param {object} paymentData - Raw payment initiation data from API
 * @returns {object} - Normalized payment with validation errors
 */
export const validatePaymentInitiationResponse = (paymentData) => {
    const errors = [];
    
    if (!paymentData) {
        return {
            valid: false,
            errors: ['Payment data is empty'],
            data: null
        };
    }
    
    // Validate required fields
    if (!paymentData.redirectUrl && !paymentData.status) {
        errors.push('Missing redirectUrl or status');
    }
    
    if (!paymentData.paymentId) {
        console.warn('[PaymentValidation] Warning: paymentId is missing');
    }
    
    if (!paymentData.status) {
        console.warn('[PaymentValidation] Warning: status is missing');
    }
    
    if (paymentData.successful === undefined) {
        console.warn('[PaymentValidation] Warning: successful flag is missing');
    }
    
    if (!paymentData.expiresAt) {
        console.warn('[PaymentValidation] Warning: expiresAt is missing');
    }
    
    // For payment initiation, we need at least redirectUrl to be present
    // (unless it's a COD or other non-redirect payment method)
    const hasMinimalData = paymentData.paymentId && (paymentData.redirectUrl || paymentData.status);
    
    return {
        valid: errors.length === 0,
        errors,
        data: paymentData,
        hasRedirectUrl: !!paymentData.redirectUrl,
        paymentId: paymentData.paymentId
    };
};

/**
 * Normalize order status response for consistent handling
 * @param {object} statusData - Raw status data from API
 * @returns {object} - Normalized status object
 */
export const normalizeOrderStatus = (statusData) => {
    return {
        orderId: statusData.id || statusData.orderId,
        status: statusData.status || 'UNKNOWN',
        paymentStatus: statusData.paymentStatus || 'UNKNOWN',
        shipmentStatus: statusData.shipmentStatus || 'UNKNOWN',
        progress: statusData.progress || statusData.status,
        updatedAt: statusData.updatedAt || new Date().toISOString(),
        isPaymentComplete: statusData.paymentStatus === 'PAID' || statusData.status === 'CONFIRMED',
        isPaymentFailed: statusData.paymentStatus === 'FAILED' || statusData.paymentStatus === 'CANCELLED',
        isCancelled: statusData.status === 'CANCELLED'
    };
};

/**
 * Check if payment session has expired
 * @param {string} expiresAt - ISO string of expiration time
 * @returns {boolean} - true if expired, false if still valid
 */
export const isPaymentSessionExpired = (expiresAt) => {
    if (!expiresAt) return false;
    
    try {
        const expirationTime = new Date(expiresAt).getTime();
        const currentTime = new Date().getTime();
        return currentTime > expirationTime;
    } catch (err) {
        console.error('[PaymentValidation] Error parsing expiration time:', err);
        return false;
    }
};

/**
 * Format error message for user display
 * @param {Error|string} error - Error object or message
 * @returns {string} - User-friendly error message
 */
export const formatErrorMessage = (error) => {
    if (typeof error === 'string') {
        return error;
    }
    
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    
    if (error.message) {
        return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
};

/**
 * Validate cart items before checkout
 * @param {array} cartItems - Array of cart items
 * @returns {object} - Validation result
 */
export const validateCartItems = (cartItems) => {
    const errors = [];
    
    if (!cartItems || !Array.isArray(cartItems)) {
        return {
            valid: false,
            errors: ['Cart items must be an array']
        };
    }
    
    if (cartItems.length === 0) {
        return {
            valid: false,
            errors: ['Cart is empty']
        };
    }
    
    cartItems.forEach((item, index) => {
        if (!item.productId) {
            errors.push(`Item ${index + 1}: Missing product ID`);
        }
        if (!item.quantity || item.quantity < 1) {
            errors.push(`Item ${index + 1}: Invalid quantity`);
        }
        if (item.price === undefined || item.price === null || item.price < 0) {
            errors.push(`Item ${index + 1}: Invalid price`);
        }
    });
    
    return {
        valid: errors.length === 0,
        errors,
        itemCount: cartItems.length,
        totalPrice: cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
    };
};

/**
 * Validate shipping address before checkout
 * @param {object} address - Shipping address object
 * @returns {object} - Validation result
 */
export const validateShippingAddress = (address) => {
    const errors = [];
    
    if (!address) {
        return {
            valid: false,
            errors: ['Address is required']
        };
    }
    
    const requiredFields = ['contactName', 'phone', 'addressLine1', 'city', 'zipCode'];
    requiredFields.forEach(field => {
        if (!address[field]) {
            errors.push(`Missing ${field}`);
        }
    });
    
    if (address.phone && !/^\d{10,}$/.test(address.phone.replace(/[^\d]/g, ''))) {
        errors.push('Invalid phone number');
    }
    
    if (address.zipCode && !/^\d{5,}$/.test(address.zipCode.replace(/[^\d]/g, ''))) {
        errors.push('Invalid zip code');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
};
