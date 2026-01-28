import React from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../../Context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white shadow-lg rounded-md hover:shadow-xl transition-shadow h-full flex flex-col">
      {/* Image container */}
      <div className="w-full h-[244px] flex items-center justify-center bg-white border border-gray-200 rounded-t-md overflow-hidden p-4">
        <img
          className="w-full h-full object-contain"
          src={product.images}
          alt={product.name}
        />
      </div>

      {/* Content container */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title and rating */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h4 className="text-xl text-[#484848] font-poppins font-medium capitalize mb-2 line-clamp-2">
              {product.name}
            </h4>
            <p className="text-sm text-[#8a8a8a] font-poppins font-normal line-clamp-2">
              {product.description}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {[...Array(Math.ceil(product.star))].map((_, index) => (
              <span key={index}>
                <FaStar size={"1.25rem"} color="#fca120" />
              </span>
            ))}
          </div>
        </div>

        {/* Spacer để đẩy content xuống dưới */}
        <div className="flex-1"></div>

        {/* Price and stock */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl text-[#484848] font-poppins font-medium">
            ${product.discountPrice}
          </p>
          {product.stock > 0 ? (
            <span className="text-sm text-[#ff4646] font-poppins capitalize font-normal">
              Stock: {product.stock}
            </span>
          ) : (
            <span className="text-sm text-[#ff4646] font-poppins capitalize font-normal">
              Almost sold out
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 text-base text-white font-poppins font-medium capitalize px-4 py-2.5 bg-[#fca120] rounded-lg flex items-center justify-center hover:bg-[#e08e1a] transition-colors"
          >
            Add to Cart
          </button>
          <Link
            to={`/product/${product._id}`}
            className="flex-1 text-base text-white font-poppins font-medium capitalize px-4 py-2.5 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
