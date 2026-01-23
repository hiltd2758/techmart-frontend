import React from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
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

        {/* Button */}
        <Link
          to={`/product/${product._id}`}
          className="text-base text-white font-poppins font-medium capitalize px-6 py-2.5 bg-black rounded-lg w-full flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
// =======
// import React from "react";
// import { useState, useEffect } from "react";
// const ProductCard = ({ product, setProduct, setTotal }) => {
//   let sum;
//   function handlePlusQuantity(id) {
//     setProduct(
//       product.map((item) =>
//         item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//       )
//     );
//   }
//   function handleMinusQuantity(id) {
//     setProduct(
//       product.map((item) =>
//         item.id === id && item.quantity > 1
//           ? { ...item, quantity: item.quantity - 1 }
//           : item
//       )
//     );
//   }
//   function handleRemoveItem(id) {
//     setProduct(product.filter((item) => item.id !== id));
//   }
//   useEffect(() => {
//     const total = product.reduce(
//       (sum, item) => sum + item.quantity * Number(item.price),
//       0
//     );
//     setTotal(total);
//   }, [product, setTotal]);
//   return (
//     <>
//       {product?.map((item) => (
//         <div
//           key={item.id}
//           className="w-full flex items-start gap-2 pt-4 border-t-[4px] border-b-[4px] border-[#E0E0E0]"
//         >
//           <div
//             className="w-[20px] h-[20px] flex flex-none items-center justify-center border-indigo-600 cursor-pointer"
//             onClick={() => handleRemoveItem(item.id)}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
//               <path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" />
//             </svg>
//           </div>
//           <div className="flex flex-2 flex-col gap-2">
//             <h4 className="break-words">{item.name}</h4>
//             <p>${item.price}</p>

//             <div className="flex items-center gap-2">
//               <button
//                 className="w-[20px] h-[20px] border-indigo-600 cursor-pointer"
//                 onClick={() => handleMinusQuantity(item.id)}
//               >
//                 -
//               </button>

//               <p>{item.quantity}</p>

//               <button
//                 className="w-[20px] h-[20px] border-indigo-600 cursor-pointer"
//                 onClick={() => handlePlusQuantity(item.id)}
//               >
//                 +
//               </button>
//             </div>
//           </div>

//           <div className="w-[100px] h-[100px] flex-none">
//             <img src={item.image} alt="product image" />
//           </div>
//         </div>
//       ))}
//     </>
//   );
// };

// export default ProductCard;
// >>>>>>> shopping-card
