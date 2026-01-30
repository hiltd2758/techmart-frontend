import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCardDrawer/ProductCardDrawer.jsx";
import TotalCart from "../TotalCart/TotalCart.jsx";
import { useCart } from "../../Context/CartContext";

const ShoppingCardDrawer = () => {
  // Transfer status state logic
  const [status, setStatus] = useState(true);
  const navigate = useNavigate();

  // Use CartContext
  const { cartItems, cartTotal } = useCart();

  function handleStatusDrawer() {
    setStatus(!status);
  }

  return status ? (
    <div
      onClick={handleStatusDrawer}
      className="fixed right-[6%] top-[35%] z-[100] w-[80px] h-[80px] bg-[#F3F4F4] rounded-xl flex items-center justify-center cursor-pointer transition-all duration-700 ease-in-out shadow-lg hover:shadow-xl"
    >
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 640 640">
          <path d="M320 64C326.6 64 332.9 66.7 337.4 71.5L481.4 223.5L481.9 224L560 224C577.7 224 592 238.3 592 256C592 270.5 582.4 282.7 569.2 286.7L523.1 493.9C516.6 523.2 490.6 544 460.6 544L179.3 544C149.3 544 123.3 523.2 116.8 493.9L70.8 286.7C57.6 282.8 48 270.5 48 256C48 238.3 62.3 224 80 224L158.1 224L158.6 223.5L302.6 71.5C307.1 66.7 313.4 64 320 64zM320 122.9L224.2 224L415.8 224L320 122.9zM240 328C240 314.7 229.3 304 216 304C202.7 304 192 314.7 192 328L192 440C192 453.3 202.7 464 216 464C229.3 464 240 453.3 240 440L240 328zM320 304C306.7 304 296 314.7 296 328L296 440C296 453.3 306.7 464 320 464C333.3 464 344 453.3 344 440L344 328z" />
        </svg>
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </div>
    </div>
  ) : (
    <div className="fixed z-[100] right-[6%] top-[10%] bg-[#F5F5F5] border border-gray-200 shadow-2xl rounded-lg w-[400px] h-[600px] p-6 flex flex-col transition-all duration-700 ease-in-out">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">Shopping Cart</h3>
        <button onClick={handleStatusDrawer} className="w-[30px] h-[30px] hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 640 640">
            <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
          </svg>
        </button>
      </div>

      <div className="w-full h-[1px] bg-gray-300 mb-4"></div>

      {cartItems.length === 0 ? (
        <div className="flex-1 flex items-center justify-center flex-col text-gray-500">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-green-600 mb-2 font-medium">Your order qualifies for free shipping!</p>
          <div className="grow overflow-y-auto my-2 pr-2 scrollbar-thin">
            <ProductCard
              product={cartItems}
            />
          </div>
          <TotalCart total={cartTotal} />
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-[#0F2854] text-[#ffffff] py-3 rounded-md font-bold hover:bg-[#0a1c3b] transition-colors mt-4"
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default ShoppingCardDrawer;
