# Quick Reference: API Response Data Extraction

## 1. GET /api/v1/payments/{id}/initiate
**When:** After order created, before payment provider redirect

**What FE Gets:**
```javascript
response.data.data = {
  redirectUrl: "https://vnpay.com/pay?token=...",  // URL to redirect to
  paymentId: "PAY-123456",                          // Track this payment
  expiresAt: "2026-01-30T14:00:00Z",               // Session expiration
  status: "success",                                // Payment status
  successful: true                                  // Success flag
}
```

**FE Usage:**
```javascript
const { redirectUrl, paymentId, expiresAt, status, successful } = response.data.data;
setPaymentId(paymentId);
setPaymentMetadata(response.data.data);
window.open(redirectUrl, '_blank');  // Redirect user to payment gateway
```

---

## 2. POST /api/v1/public/orders
**When:** User confirms checkout

**FE Sends:**
```javascript
{
  checkoutId: "uuid-string",
  email: "user@example.com",
  note: "Optional order note",
  promotionCode: "PROMO123" || null,
  shippingAddress: {
    contactName: "John Doe",
    phone: "+84912345678",
    addressLine1: "123 Main St",
    addressLine2: "Apt 4B",
    city: "Ho Chi Minh City",
    zipCode: "70000",
    districtId: 1,
    stateOrProvinceId: 1,
    countryId: 1
  },
  items: [
    { productId: 1, quantity: 2, price: 50.00 },
    { productId: 2, quantity: 1, price: 100.00 }
  ]
}
```

**What FE Gets Back:**
```javascript
response.data.data = {
  orderId: 12345,                    // ← CRITICAL: Use this for next step
  // OR id: 12345 (depends on backend)
  status: "PENDING",                 // PENDING, CONFIRMED, DELIVERED
  paymentStatus: "PENDING",          // PENDING, PAID, FAILED, CANCELLED
  shipmentStatus: "PENDING",         // PENDING, SHIPPED, DELIVERED
  progress: "CREATED",               // CREATED, PROCESSING, COMPLETED
  checkoutId: "uuid-string",         // Link back to checkout
  totalAmount: 200.00,               // Order total
  email: "user@example.com",         // Confirmation email
  note: "Order note",                // Saved note
  createdAt: "2026-01-30T10:00:00Z", // Creation timestamp
  updatedAt: "2026-01-30T10:00:00Z"  // Last update
}
```

**FE Usage:**
```javascript
const orderId = response.data.data.orderId || response.data.data.id;
// Validate
if (!orderId) throw new Error('Missing orderId');
// Navigate to payment
navigate(`/payment-confirmation/${orderId}`);
```

---

## 3. POST /api/v1/public/checkouts
**When:** User enters checkout page with cart items

**FE Sends:**
```javascript
{
  items: [
    { productId: 1, quantity: 2 },
    { productId: 2, quantity: 1 }
  ]
}
```

**What FE Gets Back:**
```javascript
response.data.data = {
  id: "uuid-string",                 // ← Checkout ID (UUID)
  checkoutId: "uuid-string",         // Same as id
  status: "PENDING",                 // PENDING
  progress: "CREATED",               // CREATED, CONFIRMED, COMPLETED
  totalAmount: 200.00,               // Total for cart items
  paymentMethodId: null,             // Set when user selects payment method
  shipmentMethodId: null,            // Set when user selects shipping
  items: [
    {
      productId: 1,
      quantity: 2,
      price: 50.00,
      name: "Product Name",
      image: "url"
    }
  ],
  createdAt: "2026-01-30T10:00:00Z", // Creation timestamp
  updatedAt: "2026-01-30T10:00:00Z"  // Last update
}
```

**FE Usage:**
```javascript
const checkoutId = response.data.data.id;
setCheckoutId(checkoutId);
setCheckoutData(response.data.data);  // Store full data
```

---

## Flow Sequence

```
1. POST /checkouts
   ↓ Get checkoutId
   ↓
2. POST /orders (with checkoutId)
   ↓ Get orderId
   ↓
3. GET /payments/{orderId}/initiate
   ↓ Get redirectUrl + paymentId + expiresAt
   ↓
4. User redirects to payment provider
   ↓
5. User returns & FE polls GET /orders/{orderId}/status
   ↓
6. Check paymentStatus === 'PAID' → Success
   Or check paymentStatus === 'FAILED' → Failure
```

---

## Key Field Mappings

| API | Field | Type | Usage |
|-----|-------|------|-------|
| Checkout | `id` | string (UUID) | Sent to create order |
| Order | `orderId`/`id` | number (Long) | Used for payment initiation |
| Order | `paymentStatus` | string | Check if payment successful |
| Order | `status` | string | Check if order confirmed |
| Payment | `redirectUrl` | string | Open in new tab |
| Payment | `paymentId` | string | Reference for payment |
| Payment | `expiresAt` | ISO string | Check expiration |

---

## Error Scenarios

### Missing Field in Response
```javascript
// Before
if (!response.data.data.orderId) throw Error('Missing orderId');

// After
const validation = validateOrderResponse(response.data.data);
if (!validation.valid) throw Error('Invalid order: ' + validation.errors.join(', '));
```

### Payment Redirect Missing
```javascript
// Before
if (!redirectUrl) console.warn('No redirect');

// After
const validation = validatePaymentInitiationResponse(paymentData);
if (!validation.hasRedirectUrl) {
  // Fallback: COD or other non-redirect method
}
```

### Order ID Type Mismatch
```javascript
// Before
const orderId = response.data.data.id;  // Could be string or number

// After
const orderId = response.data.data.orderId || response.data.data.id;
// Guaranteed to extract correctly regardless of field name
```

---

## Validation Examples

```javascript
// Validate checkout before proceeding
const checkout = validateCheckoutResponse(response.data.data);
if (!checkout.valid) {
  alert('Invalid checkout: ' + checkout.errors.join(', '));
  return;
}

// Validate order before payment
const order = validateOrderResponse(response.data.data);
if (!order.valid) {
  alert('Invalid order: ' + order.errors.join(', '));
  return;
}
const { orderId } = order;  // Correctly extracted orderId

// Validate payment initiation
const payment = validatePaymentInitiationResponse(response.data.data);
if (!payment.valid) {
  alert('Invalid payment: ' + payment.errors.join(', '));
  return;
}
if (payment.hasRedirectUrl) {
  window.open(payment.data.redirectUrl, '_blank');
}
```

---

## State Management Pattern

```javascript
// Store full checkout data
const [checkoutId, setCheckoutId] = useState(null);
const [checkoutData, setCheckoutData] = useState(null);

// Store full order data
const [order, setOrder] = useState(null);

// Store payment data
const [paymentMetadata, setPaymentMetadata] = useState(null);
const [paymentId, setPaymentId] = useState(null);

// Usage:
setCheckoutId(createdCheckout.id);
setCheckoutData(createdCheckout);
// Now both ID and full data available for subsequent operations
```

---

## Console Logging for Debugging

```javascript
// Checkout creation
console.log('[Checkout] Created checkout:', {
  id: createdCheckout.id,
  status: createdCheckout.status,
  totalAmount: createdCheckout.totalAmount,
  itemCount: createdCheckout.items?.length || 0
});

// Order creation
console.log('[Order] Created order:', {
  orderId: orderId,
  status: createdOrder.status,
  paymentStatus: createdOrder.paymentStatus,
  totalAmount: createdOrder.totalAmount,
  checkoutId: createdOrder.checkoutId
});

// Payment initiation
console.log('[Payment] Initiated payment:', {
  paymentId: initiatedPayment.paymentId,
  status: initiatedPayment.status,
  expiresAt: initiatedPayment.expiresAt
});

// Order status
console.log('[Order] Status update:', {
  orderId: statusData.orderId || statusData.id,
  paymentStatus: statusData.paymentStatus,
  status: statusData.status
});
```

This provides complete traceability for debugging production issues!
