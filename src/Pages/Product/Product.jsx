import React, { useState, useEffect } from "react";
import ProductCard from "../../Components/ProductCard/ProductCard.jsx";
import HomeNavbar from "../../Components/HomeNavbar/HomeNavbar.jsx";
import { productAPI } from "../../api/productAPI.js";

const Product = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 12,
  });

  // Categories - cập nhật với IDs thực từ backend nếu cần
  const categories = [
    { id: "all", name: "All Products" },
    { id: "1", name: "Laptops" },
    { id: "2", name: "Smartphones" },
    { id: "3", name: "Audio" },
    { id: "4", name: "Wearables" },
    { id: "5", name: "Accessories" },
  ];

  // Fetch products từ API
  const fetchProducts = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        size: pagination.pageSize,
        sortBy: 'name',
        sortDirection: 'ASC',
      };

      // Thêm filter category nếu không phải "all"
      if (selectedCategory !== "all") {
        params.categoryIds = selectedCategory;
      }

      const response = await productAPI.getProducts(params);

      // Response structure: { status, message, timestamp, data }
      const apiData = response.data;
      const pageData = apiData.data;

      // Map dữ liệu từ ProductSummaryDTO sang format của ProductCard
      const mappedProducts = pageData.content.map(product => ({
        _id: product.id,
        name: product.name,
        description: product.name, // Fallback nếu không có description
        discountPrice: product.specialPrice || product.price,
        originalPrice: product.oldPrice || product.price,
        images: product.thumbnailUrl || '/placeholder.jpg',
        star: product.averageRating || 5,
        stock: product.stockQuantity,
        category: product.brandName || 'General',
        slug: product.slug,
        sku: product.sku,
      }));

      setProducts(mappedProducts);
      setPagination({
        currentPage: pageData.pageNumber,
        totalPages: pageData.totalPages,
        totalElements: pageData.totalElements,
        pageSize: pageData.pageSize,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load products khi component mount hoặc category thay đổi
  useEffect(() => {
    fetchProducts(0);
  }, [selectedCategory]);


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
            {pagination.totalElements > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {pagination.totalElements} products available
              </p>
            )}
          </div>

          {/* Categories */}
          <div className="flex items-center justify-center gap-6 mb-12 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`text-base font-poppins font-normal capitalize cursor-pointer px-6 py-2.5 rounded-md transition-colors ${selectedCategory === category.id
                  ? "bg-black text-white"
                  : "text-[#8a8a8a] hover:text-black"
                  }`}
                disabled={loading}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 text-center">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && products.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          )}

          {/* Products Grid */}
          {!loading || products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  <button
                    onClick={() => {
                      const newPage = Math.max(0, pagination.currentPage - 1);
                      fetchProducts(newPage);
                      window.scrollTo(0, 0);
                    }}
                    disabled={pagination.currentPage === 0 || loading}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {[...Array(pagination.totalPages)].map((_, index) => {
                    // Simple pagination logic: show first, last, current, and neighbors
                    if (
                      index === 0 ||
                      index === pagination.totalPages - 1 ||
                      (index >= pagination.currentPage - 1 && index <= pagination.currentPage + 1)
                    ) {
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            fetchProducts(index);
                            window.scrollTo(0, 0);
                          }}
                          disabled={loading}
                          className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${pagination.currentPage === index
                            ? "bg-black text-white"
                            : "border border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                          {index + 1}
                        </button>
                      );
                    } else if (
                      (index === pagination.currentPage - 2 && index > 0) ||
                      (index === pagination.currentPage + 2 && index < pagination.totalPages - 1)
                    ) {
                      return <span key={index} className="flex items-end px-1">...</span>;
                    }
                    return null;
                  })}

                  <button
                    onClick={() => {
                      const newPage = Math.min(pagination.totalPages - 1, pagination.currentPage + 1);
                      fetchProducts(newPage);
                      window.scrollTo(0, 0);
                    }}
                    disabled={pagination.currentPage === pagination.totalPages - 1 || loading}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : null}

          {/* No Products Found */}
          {!loading && products.length === 0 && (
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