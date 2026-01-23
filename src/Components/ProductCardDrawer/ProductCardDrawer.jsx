import React from "react";
import { useState, useEffect } from "react";
const ProductCard = ({ product, setProduct, setTotal }) => {
  let sum;
  function handlePlusQuantity(id) {
    setProduct(
      product.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }
  function handleMinusQuantity(id) {
    setProduct(
      product.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  }
  function handleRemoveItem(id) {
    setProduct(product.filter((item) => item.id !== id));
  }
  useEffect(() => {
    const total = product.reduce(
      (sum, item) => sum + item.quantity * Number(item.price),
      0,
    );
    setTotal(total);
  }, [product, setTotal]);
  return (
    <>
      {product?.map((item) => (
        <div
          key={item.id}
          className="w-full flex items-start gap-2 pt-4 border-t-[4px] border-b-[4px] border-[#E0E0E0]"
        >
          <div
            className="w-[20px] h-[20px] flex flex-none items-center justify-center border-indigo-600 cursor-pointer"
            onClick={() => handleRemoveItem(item.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              <path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" />
            </svg>
          </div>
          <div className="flex flex-2 flex-col gap-2">
            <h4 className="break-words">{item.name}</h4>
            <p>${item.price}</p>

            <div className="flex items-center gap-2">
              <button
                className="w-[20px] h-[20px] border-indigo-600 cursor-pointer"
                onClick={() => handleMinusQuantity(item.id)}
              >
                -
              </button>

              <p>{item.quantity}</p>

              <button
                className="w-[20px] h-[20px] border-indigo-600 cursor-pointer"
                onClick={() => handlePlusQuantity(item.id)}
              >
                +
              </button>
            </div>
          </div>

          <div className="w-[100px] h-[100px] flex-none">
            <img src={item.image} alt="product image" />
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductCardDrawer;
