import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";
import HomeNavbar from "../HomeNavbar/HomeNavbar.jsx";
import Footer from "../Footer/Footer.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState("");

  // Product database with creative sample data
  const productsDatabase = {
    1: {
      _id: "1",
      name: 'MacBook Pro 16" M3 Max',
      description: "Apple M3 Max chip, 36GB RAM, 1TB SSD",
      fullDescription:
        "Experience unprecedented performance with Apple's M3 Max chip. Featuring 36GB unified memory, 1TB SSD storage, and stunning 16-inch Liquid Retina XDR display. Perfect for professionals and creators who demand the best.",
      discountPrice: 5499,
      originalPrice: 6499,
      images: "/arrivals/arrival_1.jpg",
      star: 5,
      stock: 15,
      category: "laptops",
      specifications: {
        Processor: "Apple M3 Max (12-core)",
        Memory: "36GB Unified RAM",
        Storage: "1TB SSD",
        Display: "16-inch Liquid Retina XDR",
        Graphics: "18-core GPU",
        Battery: "Up to 18 hours",
        Weight: "2.2 kg",
      },
      options: [
        { name: "Space Gray", value: "space-gray" },
        { name: "Silver", value: "silver" },
      ],
    },
    2: {
      _id: "2",
      name: "iPhone 15 Pro Max 256GB",
      description: "Titanium Blue, A17 Pro chip, 48MP camera",
      fullDescription:
        "The ultimate iPhone. Featuring the powerful A17 Pro chip, stunning titanium design, and an advanced camera system. Capture stunning photos and videos with the 48MP main camera and innovative features.",
      discountPrice: 1199,
      originalPrice: 1399,
      images: "/arrivals/arrival_3.png",
      star: 5,
      stock: 25,
      category: "smartphones",
      specifications: {
        Processor: "A17 Pro chip",
        Memory: "8GB RAM",
        Storage: "256GB",
        Display: "6.7-inch Super Retina XDR",
        Camera: "48MP main + 12MP ultrawide + 12MP telephoto",
        Battery: "Up to 29 hours",
        OS: "iOS 17",
        Colors: "Titanium Blue, Black, Silver, Gold",
      },
      options: [
        { name: "Titanium Blue", value: "titanium-blue" },
        { name: "Titanium Black", value: "titanium-black" },
        { name: "Titanium Silver", value: "titanium-silver" },
      ],
    },
    3: {
      _id: "3",
      name: "Samsung Galaxy S24 Ultra",
      description: "512GB, AI camera, S Pen included",
      fullDescription:
        "Experience the future of smartphones. The Galaxy S24 Ultra comes with cutting-edge AI features, a premium titanium build, and the world's brightest display. Includes the versatile S Pen stylus.",
      discountPrice: 999,
      originalPrice: 1199,
      images: "/arrivals/arrival_2.jpg",
      star: 4,
      stock: 30,
      category: "smartphones",
      specifications: {
        Processor: "Snapdragon 8 Gen 3 Leading Version",
        Memory: "12GB RAM",
        Storage: "512GB",
        Display: "6.8-inch Dynamic AMOLED 2X",
        Camera: "200MP main + 50MP ultrawide + 10MP + 50MP telephoto",
        Battery: "5000mAh",
        OS: "Android 14",
        Features: "S Pen, IP68 rating",
      },
      options: [
        { name: "Phantom Black", value: "phantom-black" },
        { name: "Gray", value: "gray" },
        { name: "Gold", value: "gold" },
      ],
    },
    4: {
      _id: "4",
      name: "AirPods Pro Gen 2",
      description: "Active Noise Cancellation, USB-C charging",
      fullDescription:
        "Premium wireless earbuds with advanced noise cancellation technology. Experience crystal-clear audio with adaptive transparency mode and personalized sound.",
      discountPrice: 249,
      originalPrice: 299,
      images: "/arrivals/arrival_4.jpg",
      star: 5,
      stock: 50,
      category: "audio",
      specifications: {
        "Noise Cancellation": "Active Noise Cancellation",
        Sound: "Adaptive Audio with Transparency",
        "Battery Life": "6 hours (single charge), 30 hours (with case)",
        Charging: "USB-C, 15 minutes = 1 hour",
        Bluetooth: "Bluetooth 5.3",
        Colors: "White, Midnight, Starlight",
        "Water Resistance": "IP54",
      },
      options: [
        { name: "White", value: "white" },
        { name: "Midnight", value: "midnight" },
      ],
    },
    5: {
      _id: "5",
      name: "Dell XPS 15",
      description: "Intel i9, RTX 4060, 32GB RAM, 1TB SSD",
      fullDescription:
        "The ultimate Windows laptop for creators and professionals. Powerful Intel i9 processor, NVIDIA RTX 4060 graphics, and a stunning OLED display. Perfect for video editing, 3D modeling, and more.",
      discountPrice: 2299,
      originalPrice: 2799,
      images: "/arrivals/arrival_5.jpg",
      star: 4,
      stock: 12,
      category: "laptops",
      specifications: {
        Processor: "Intel Core i9-13900HX",
        Memory: "32GB DDR5 RAM",
        Storage: "1TB NVMe SSD",
        Display: "15.6-inch 3.5K OLED",
        Graphics: "NVIDIA RTX 4060",
        Battery: "Up to 13 hours",
        Weight: "1.95 kg",
        Ports: "Thunderbolt 4, USB-C, HDMI",
      },
      options: [
        { name: "Silver", value: "silver" },
        { name: "Graphite", value: "graphite" },
      ],
    },
    6: {
      _id: "6",
      name: "Apple Watch Series 9",
      description: "GPS + Cellular, 45mm, Midnight Aluminum",
      fullDescription:
        "The ultimate smartwatch. Stay connected with cellular capability, track your fitness with advanced sensors, and enjoy a bright, responsive display. All day battery life.",
      discountPrice: 499,
      originalPrice: 599,
      images: "/arrivals/arrival_6.jpg",
      star: 5,
      stock: 35,
      category: "wearables",
      specifications: {
        Size: "45mm",
        Material: "Aluminum",
        Display: "Retina LTPO OLED",
        "Always-On": "Yes",
        Connectivity: "GPS + Cellular",
        "Water Resistance": "50 meters",
        "Battery Life": "Up to 18 hours",
        Features: "ECG, Blood Oxygen, Temperature Sensing",
      },
      options: [
        { name: "45mm GPS", value: "45-gps" },
        { name: "45mm GPS + Cellular", value: "45-cellular" },
      ],
    },
  };

  // Get product from database based on ID
  const product = productsDatabase[id] || productsDatabase["1"];

  const handleQuantityChange = (type) => {
    if (type === "increase" && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log(`Added ${quantity} x ${product.name} to cart`);
  };

  const getRelatedProducts = () => {
    return Object.values(productsDatabase)
      .filter(p => p.category === product.category && p._id !== product._id)
      .slice(0, 4);
  };

  return (
    <>
      <HomeNavbar />

      <div className="w-full bg-white pt-[150px] pb-[100px] min-h-screen">
        <div className="lg:container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link to="/" className="text-[#8a8a8a] hover:text-black">
                  Home
                </Link>
              </li>
              <li className="text-[#8a8a8a]">/</li>
              <li>
                <Link to="/product" className="text-[#8a8a8a] hover:text-black">
                  Products
                </Link>
              </li>
              <li className="text-[#8a8a8a]">/</li>
              <li className="text-[#484848] capitalize">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="flex flex-col gap-4">
              <div className="w-full h-[500px] bg-white border border-gray-200 rounded-lg overflow-hidden p-8 flex items-center justify-center">
                <img
                  className="w-full h-full object-contain"
                  src={product.images}
                  alt={product.name}
                />
              </div>
              {/* Thumbnail images */}
              <div className="flex gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-20 h-20 border border-gray-200 rounded-lg overflow-hidden p-2 cursor-pointer hover:border-black transition-colors"
                  >
                    <img
                      className="w-full h-full object-contain"
                      src={product.images}
                      alt={`${product.name} view ${i}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6">
              {/* Title and Rating */}
              <div>
                <h1 className="text-3xl text-[#484848] font-poppins font-medium capitalize mb-3">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(Math.ceil(product.star))].map((_, index) => (
                      <FaStar key={index} size="1rem" color="#fca120" />
                    ))}
                  </div>
                  <span className="text-sm text-[#8a8a8a]">
                    ({product.star}.0) • {product.stock} in stock
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl text-[#484848] font-poppins font-semibold">
                  ${product.discountPrice}
                </span>
                <span className="text-xl text-[#8a8a8a] line-through">
                  ${product.originalPrice}
                </span>
                <span className="text-sm text-red-600 font-medium">
                  Save ${product.originalPrice - product.discountPrice}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg text-[#484848] font-poppins font-medium mb-2">
                  Description
                </h3>
                <p className="text-base text-[#8a8a8a] font-poppins font-normal leading-relaxed">
                  {product.fullDescription}
                </p>
              </div>

              {/* Options */}
              {product.options && product.options.length > 0 && (
                <div>
                  <h3 className="text-lg text-[#484848] font-poppins font-medium mb-3">
                    Color
                  </h3>
                  <div className="flex gap-3">
                    {product.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedOption(option.value)}
                        className={`px-4 py-2 border rounded-lg font-poppins text-sm capitalize transition-colors ${
                          selectedOption === option.value
                            ? "border-black bg-black text-white"
                            : "border-gray-300 text-[#484848] hover:border-gray-400"
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <h3 className="text-lg text-[#484848] font-poppins font-medium mb-3">
                  Quantity
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      className="p-3 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <FaMinus size="0.8rem" />
                    </button>
                    <span className="px-6 py-3 text-[#484848] font-poppins font-medium min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange("increase")}
                      className="p-3 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      <FaPlus size="0.8rem" />
                    </button>
                  </div>
                  <span className="text-sm text-[#8a8a8a]">
                    {product.stock} available
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-3 w-full py-4 bg-black text-white font-poppins font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                <FaShoppingCart size="1.2rem" />
                Add to Cart
              </button>

              {/* Specifications */}
              <div className="border-t pt-6">
                <h3 className="text-lg text-[#484848] font-poppins font-medium mb-4">
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between gap-x-9 py-2 border-b border-gray-100"
                      >
                        <span className="text-sm text-[#8a8a8a] font-poppins">
                          {key}
                        </span>
                        <span className="text-sm text-[#484848] font-poppins font-medium">
                          {value}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {getRelatedProducts().length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h2 className="text-2xl text-[#484848] font-poppins font-medium mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {getRelatedProducts().map((relatedProduct) => (
                  <Link
                    key={relatedProduct._id}
                    to={`/product/${relatedProduct._id}`}
                    className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-black transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="aspect-square bg-gray-50 p-4 flex items-center justify-center">
                      <img
                        src={relatedProduct.images}
                        alt={relatedProduct.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm text-[#484848] font-poppins font-medium mb-2 line-clamp-2 group-hover:text-black transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(Math.ceil(relatedProduct.star))].map((_, index) => (
                          <FaStar key={index} size="0.75rem" color="#fca120" />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg text-[#484848] font-poppins font-semibold">
                          ${relatedProduct.discountPrice}
                        </span>
                        <span className="text-sm text-[#8a8a8a] line-through">
                          ${relatedProduct.originalPrice}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;