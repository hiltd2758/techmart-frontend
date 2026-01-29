import React, { useState, useEffect } from "react";
import ProductCard from "../../Components/ProductCard/ProductCard.jsx";
import HomeNavbar from "../../Components/HomeNavbar/HomeNavbar.jsx";
import { productAPI } from "../../api/productAPI.js";

const Product = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 12,
  });

  // Fetch products từ API
  const fetchProducts = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        size: pagination.pageSize,
      };

      // Nếu có search query, dùng search API
      if (searchQuery.trim()) {
        params.q = searchQuery.trim();
        const response = await productAPI.publicSearchProducts(params);
        const apiData = response.data;
        const pageData = apiData.data;

        // Map dữ liệu từ ProductSummaryDTO sang format của ProductCard
        const mappedProducts = pageData.content.map(product => ({
          _id: product.id,
          name: product.name,
          description: product.name,
          discountPrice: product.specialPrice || product.price,
          originalPrice: product.oldPrice || product.price,
          images: product.thumbnailUrl || '/placeholder.jpg',
          star: product.averageRating || 5,
          stock: product.stockQuantity,
          category: product.brandName || 'General',
          slug: product.slug,
          sku: product.sku || null,
        }));

        setProducts(mappedProducts);
        setPagination({
          currentPage: pageData.pageNumber,
          totalPages: pageData.totalPages,
          totalElements: pageData.totalElements,
          pageSize: pageData.pageSize,
        });
      } else {
        // Không có search query, dùng regular listing API
        params.sortBy = 'name';
        params.sortDirection = 'ASC';
        const response = await productAPI.getProducts(params);
        const apiData = response.data;
        const pageData = apiData.data;

        // Map dữ liệu từ ProductSummaryDTO sang format của ProductCard
        const mappedProducts = pageData.content.map(product => ({
          _id: product.id,
          name: product.name,
          description: product.name,
          discountPrice: product.specialPrice || product.price,
          originalPrice: product.oldPrice || product.price,
          images: product.thumbnailUrl || '/placeholder.jpg',
          star: product.averageRating || 5,
          stock: product.stockQuantity,
          category: product.brandName || 'General',
          slug: product.slug,
          sku: product.sku || null,
        }));

        setProducts(mappedProducts);
        setPagination({
          currentPage: pageData.pageNumber,
          totalPages: pageData.totalPages,
          totalElements: pageData.totalElements,
          pageSize: pageData.pageSize,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load products khi component mount hoặc search query thay đổi
  useEffect(() => {
    fetchProducts(0);
  }, [searchQuery]);


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

          {/* Search Input */}
          <div className="mb-12 flex justify-center">
            <div className="w-full max-w-md">
              <input
                type="text"
                placeholder="Search products by name, SKU, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear search
                </button>
              )}
            </div>
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
                {searchQuery
                  ? `No products found matching "${searchQuery}"`
                  : "No products found."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;