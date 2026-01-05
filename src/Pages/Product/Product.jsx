import React, { useState } from "react";
import ProductCard from "../../Components/ProductCard/ProductCard.jsx";
import HomeNavbar from "../../Components/HomeNavbar/HomeNavbar.jsx";

const Product = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Products" },
    { id: "laptops", name: "Laptops" },
    { id: "smartphones", name: "Smartphones" },
    { id: "audio", name: "Audio" },
    { id: "wearables", name: "Wearables" },
    { id: "accessories", name: "Accessories" },
  ];

  const products = [
    {
      _id: "1",
      name: 'MacBook Pro 16" M3 Max',
      description: "Apple M3 Max chip, 36GB RAM, 1TB SSD",
      discountPrice: 5499,
      originalPrice: 6499,
      images: "/arrivals/arrival_1.jpg",
      star: 5,
      stock: 15,
      category: "laptops",
    },
    {
      _id: "2",
      name: "iPhone 15 Pro Max 256GB",
      description: "Titanium Blue, A17 Pro chip, 48MP camera",
      discountPrice: 1199,
      originalPrice: 1399,
      images: "/arrivals/arrival_3.png",
      star: 5,
      stock: 25,
      category: "smartphones",
    },
    {
      _id: "3",
      name: "Samsung Galaxy S24 Ultra",
      description: "512GB, AI camera, S Pen included",
      discountPrice: 999,
      originalPrice: 1199,
      images: "/arrivals/arrival_2.jpg",
      star: 4,
      stock: 30,
      category: "smartphones",
    },
    {
      _id: "4",
      name: "AirPods Pro Gen 2",
      description: "Active Noise Cancellation, USB-C charging",
      discountPrice: 249,
      originalPrice: 299,
      images: "/arrivals/arrival_4.jpg",
      star: 5,
      stock: 50,
      category: "audio",
    },
    {
      _id: "5",
      name: "Dell XPS 15",
      description: "Intel i9, RTX 4060, 32GB RAM, 1TB SSD",
      discountPrice: 2299,
      originalPrice: 2799,
      images: "/arrivals/arrival_5.jpg",
      star: 4,
      stock: 12,
      category: "laptops",
    },
    {
      _id: "6",
      name: "Apple Watch Series 9",
      description: "GPS + Cellular, 45mm, Midnight Aluminum",
      discountPrice: 499,
      originalPrice: 599,
      images: "/arrivals/arrival_6.jpg",
      star: 5,
      stock: 35,
      category: "wearables",
    },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <>
      <HomeNavbar />
      <div className="w-full bg-white pt-[150px] pb-[150px] min-h-screen">
        <div className="lg:container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <h3 className="text-5xl text-[#484848] font-normal capitalize mb-5">
              All Products
            </h3>
            <p className="text-base text-[#8a8a8a] font-poppins font-normal">
              Discover our complete collection of premium tech products
            </p>
          </div>

          {/* Categories */}
          <div className="flex items-center justify-center gap-6 mb-12 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`text-base font-poppins font-normal capitalize cursor-pointer px-6 py-2.5 rounded-md transition-colors ${
                  selectedCategory === category.id
                    ? "bg-black text-white"
                    : "text-[#8a8a8a] hover:text-black"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* No Products Found */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-[#8a8a8a] font-poppins">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
