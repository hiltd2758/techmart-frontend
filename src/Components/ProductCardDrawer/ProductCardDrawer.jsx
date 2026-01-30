import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import { cartAPI } from "../../api/cartAPI";
import { checkoutAPI } from "../../api/checkoutAPI";

const ProductCardDrawer = ({ product }) => {
  const navigate = useNavigate();
  const { removeFromCart, updateQuantity } = useCart();

  const handleCheckout = async () => {
    try {
      // 1. Get current cart items
      const cartResponse = await cartAPI.getCartItems();
      const cartItems = cartResponse.data.data || [];

      if (cartItems.length === 0) {
        alert('Your cart is empty');
        return;
      }

      // 2. Transform to { productId, quantity } format
      const checkoutItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      // 3. Create checkout
      const checkoutResponse = await checkoutAPI.createCheckout({
        items: checkoutItems
      });

      const checkoutId = checkoutResponse.data.data.id || checkoutResponse.data.data.checkoutId;

      // 4. Save and navigate
      localStorage.setItem('checkoutId', checkoutId);
      navigate('/checkout');
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert(error.response?.data?.message || 'Failed to proceed to checkout');
    }
  };

  return (
    <>
      {product?.map((item) => (
        <div
          key={item.productId}
          className="w-full flex items-start gap-2 pt-4 border-t-[4px] border-b-[4px] border-[#E0E0E0]"
        >
          <div
            className="w-[20px] h-[20px] flex flex-none items-center justify-center border-indigo-600 cursor-pointer"
            onClick={() => removeFromCart(item.productId)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              <path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" />
            </svg>
          </div>
          <div className="flex flex-2 flex-col gap-2">
            <h4 className="break-words text-sm font-medium">{item.name}</h4>
            <p className="text-sm text-gray-600">${item.price}</p>

            <div className="flex items-center gap-2">
              <button
                className={`w-[20px] h-[20px] border border-gray-300 flex items-center justify-center rounded cursor-pointer hover:bg-gray-100 ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>

              <p className="text-sm w-4 text-center">{item.quantity}</p>

              <button
                className="w-[20px] h-[20px] border border-gray-300 flex items-center justify-center rounded cursor-pointer hover:bg-gray-100"
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="w-[80px] h-[80px] flex-none border border-gray-200 rounded p-1">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-contain"
              onError={(e) => e.target.src = '/placeholder.jpg'}
            />
          </div>
        </div>
      ))}

      {product && product.length > 0 && (
        <div className="w-full mt-6 px-4 pb-4">
          <button
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-[#0F2854] to-[#1a3a6e] text-white py-3 rounded-lg font-bold hover:from-[#0a1c3b] hover:to-[#0d2846] transition-all shadow-md"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </>
  );
};

export default ProductCardDrawer;
