import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { productAPI } from "../../api/productAPI";

const NewArrival = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const newArrivalsCategories = [
    {
      id: 1,
      name: "Gaming Laptops",
      category: "laptops",
    },
    {
      id: 2,
      name: "Flagship Phones",
      category: "smartphones",
    },
    {
      id: 3,
      name: "Wireless Earbuds",
      category: "audio",
    },
    {
      id: 4,
      name: "Smartwatches",
      category: "wearables",
    },
    {
      id: 5,
      name: "Accessories",
      category: "accessories",
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getFeaturedProducts(6);
        setProducts(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full bg-white pt-[150px] pb-[150px]">
      <div className="lg:container mx-auto">
        {/* header title */}
        <div className="text-center mb-10">
          <h3 className="text-3xl text-[#484848] font-normal capitalize mb-5">
            new arrivals
          </h3>
          <p className="text-base text-[#8a8a8a] font-poppins font-normal">
            Discover the latest tech products with cutting-edge features and
            unbeatable prices.
          </p>
        </div>

        {/* categories */}
        <div className="flex items-center justify-center gap-10 mb-10">
          {newArrivalsCategories.map((category) => (
            <button
              className={`text-base font-poppins font-normal capitalize cursor-pointer ${category.id === 2
                  ? "px-6 py-2.5 bg-black rounded-sm text-white"
                  : "text-[#8a8a8a]"
                }`}
              key={category.id}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        )}

        {/* products grid */}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-8">
            {products.map((product) => {
              // Get the first image from the product
              const imageUrl = product.imageUrl || product.images?.[0] || "/placeholder.jpg";
              const rating = product.averageRating || product.star || 0;
              const stockQuantity = product.stockQuantity || product.stock || 0;
              const price = product.discountPrice || product.price || 0;

              return (
                <div
                  key={product.id || product._id}
                  className="bg-white shadow-lg p-5 rounded-md cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => (window.location.href = `/product/${product.id || product._id}`)}
                >
                  {/* Container ảnh với padding và border */}
                  <div className="w-full h-[244px] mb-2.5 flex items-center justify-center bg-white border border-gray-200 rounded-md overflow-hidden p-4">
                    <img
                      className="w-full h-full object-contain"
                      src={imageUrl}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-8">
                      <div>
                        <h4 className="text-xl text-[#484848] font-poppins font-medium capitalize mb-2">
                          {product.name}
                        </h4>
                        <p className="text-base text-[#8a8a8a] font-poppins font-normal line-clamp-2">
                          {product.description || product.shortDescription || ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(Math.ceil(rating))].map((_, index) => (
                          <span key={index}>
                            <FaStar size={"1.5rem"} color="#fca120" />
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-5">
                      <p className="text-2xl text-[#484848] font-poppins font-medium">
                        ${price.toLocaleString()}
                      </p>
                      {stockQuantity > 0 ? (
                        <span className="text-base text-[#ff4646] font-poppins capitalize font-normal">
                          stock: {stockQuantity}
                        </span>
                      ) : (
                        <span className="text-base text-[#ff4646] font-poppins capitalize font-normal">
                          almost sold out
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* view more button */}
        {!loading && !error && (
          <div className="mt-10 flex items-center justify-center">
            <Link
              to="/product"
              className="text-base text-white font-poppins font-normal capitalize px-8 py-2.5 bg-black rounded-md cursor-pointer hover:bg-gray-800 transition-colors inline-block"
            >
              view more
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrival;
