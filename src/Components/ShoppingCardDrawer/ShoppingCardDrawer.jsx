import React from "react";
import ProductCard from "../ProductCard/ProductCard.jsx";
import TotalCart from "../TotalCart/TotalCart.jsx";
import { useState, useEffect } from "react";

const ShoppingCardDrawer = () => {
  // chuyển trạng thái icon và giỏ hàng
  const statusDrawer = React.useState(true);
  const status = statusDrawer[0];
  const setStatus = statusDrawer[1];
  // luu trạng thái giá trị tổng tiền
  const totalArray = React.useState(0);
  const total = totalArray[0];
  const setTotal = totalArray[1];
  // lưu trạng thái giỏ hàng
  const productArray = React.useState([
    {
      id: 1,
      image: "/arrivals/arrival_1.jpg",
      name: "Product Name",
      price: 99.99,
      quantity: 1,
    },
    {
      id: 2,
      image: "/arrivals/arrival_2.jpg",
      name: "Product Name",
      price: 99.99,
      quantity: 1,
    },
    {
      id: 3,
      image: "/arrivals/arrival_5.jpg",
      name: "Product Name",
      price: 99.99,
      quantity: 1,
    },
    {
      id: 4,
      image: "/arrivals/arrival_4.jpg",
      name: "Product Name",
      price: 99.99,
      quantity: 1,
    },
  ]);
  const product = productArray[0];
  const setProduct = productArray[1];
  function handleStatusDrawer() {
    setStatus(!status);
  }
  return status ? (
    <div
      onClick={handleStatusDrawer}
      className="fixed right-[6%] top-[35%] z-[1] w-[80px] h-[80px] bg-[#F3F4F4] rounded-xl flex items-center justify-center cursor-pointer transition-all duration-700 ease-in-out"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
        <path d="M320 64C326.6 64 332.9 66.7 337.4 71.5L481.4 223.5L481.9 224L560 224C577.7 224 592 238.3 592 256C592 270.5 582.4 282.7 569.2 286.7L523.1 493.9C516.6 523.2 490.6 544 460.6 544L179.3 544C149.3 544 123.3 523.2 116.8 493.9L70.8 286.7C57.6 282.8 48 270.5 48 256C48 238.3 62.3 224 80 224L158.1 224L158.6 223.5L302.6 71.5C307.1 66.7 313.4 64 320 64zM320 122.9L224.2 224L415.8 224L320 122.9zM240 328C240 314.7 229.3 304 216 304C202.7 304 192 314.7 192 328L192 440C192 453.3 202.7 464 216 464C229.3 464 240 453.3 240 440L240 328zM320 304C306.7 304 296 314.7 296 328L296 440C296 453.3 306.7 464 320 464C333.3 464 344 453.3 344 440L344 328C344 314.7 333.3 304 320 304zM448 328C448 314.7 437.3 304 424 304C410.7 304 400 314.7 400 328L400 440C400 453.3 410.7 464 424 464C437.3 464 448 453.3 448 440L448 328z" />
      </svg>
    </div>
  ) : (
    <div className="fixed z-[1] right-[6%] top-[10%] bg-[#F5F5F5] border-indigo-600 w-[500px] h-[600px] p-6 flex flex-col transition-all duration-700 ease-in-out">
      <div className="flex items-center justify-between mb-2">
        <h3>Shopping Cart</h3>
        <button onClick={handleStatusDrawer} className="w-[25px] h-[25px]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
          </svg>
        </button>
      </div>
      <div className="w-[90%] h-[4px] bg-[#000000] mb-2"></div>
      <p>Your order qualifies for free shipping!</p>
      <div className="grow overflow-y-auto my-4 border-l-[2px] border-r-[2px] border-[#E0E0E0]">
        <ProductCard
          product={product}
          setProduct={setProduct}
          setTotal={setTotal}
        />
      </div>
      <TotalCart total={total} />
      <button className="w-full bg-[#0F2854] text-[#ffffff] py-2 rounded-md">
        Checkout
      </button>
    </div>
  );
};

export default ShoppingCardDrawer;
