import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { productAPI } from "../../../api/productAPI";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  });

  // Fetch products from API
  const fetchProducts = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        size: pagination.pageSize,
      };

      // Add keyword search
      if (searchTerm) {
        params.keyword = searchTerm;
      }

      const response = await productAPI.adminGetProducts(params);

      // Backend response: { status, message, data: { content, pageNumber, ... } }
      const pageData = response.data.data;

      if (pageData) {
        setProducts(pageData.content || []);
        setPagination({
          currentPage: pageData.pageNumber || 0,
          totalPages: pageData.totalPages || 0,
          totalElements: pageData.totalElements || 0,
          pageSize: pageData.pageSize || 10,
        });
      } else {
        setError(response.data.message || "Failed to load products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      const response = await productAPI.adminDeleteProduct(productId);

      // Backend response: { status, message, data }
      if (response.data.status === 200 || response.data.data) {
        // Refresh the product list
        fetchProducts(pagination.currentPage);
        alert("Product deleted successfully!");
      } else {
        alert(response.data.message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  // Load products on component mount and when search changes
  useEffect(() => {
    fetchProducts(0);
  }, [searchTerm]);

  // Map backend data to display format
  const mapProductData = (product) => ({
    id: product.id,
    name: product.name,
    category: product.categories?.[0]?.name || "Uncategorized",
    price: product.price || 0,
    stock: product.stockQuantity || 0,
    status: product.isPublished ? "Active" : "Inactive", // ✅ ĐỔI từ published → isPublished
    image: product.thumbnailUrl || product.images?.[0]?.imageUrl || "/placeholder.jpg", // ✅ ĐỔI imageUrl
    sku: product.sku || null,
    dateAdded: product.createdAt || new Date().toISOString(),
  });

  return (
    <div className="min-h-screen bg-neutral-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-end justify-between pb-6 border-b border-neutral-200">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-neutral-900">Products</h1>
            <p className="text-neutral-500 mt-1 text-sm font-mono">Manage inventory & pricing</p>
          </div>
          <button
            onClick={() => navigate("/admin/products/add")}
            className="h-9 px-4 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-2"
          >
            <FaPlus size={12} />
            Add Product
          </button>
        </div>

        {/* Search */}
        <div className="bg-white border border-neutral-200 p-4">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={13} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20 bg-white border border-neutral-200">
            <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Products Table */}
        {!loading && (
          <div className="bg-white border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-6 text-xs font-mono uppercase tracking-wider text-neutral-500">Product</th>
                    <th className="text-left py-3 px-6 text-xs font-mono uppercase tracking-wider text-neutral-500">Category</th>
                    <th className="text-left py-3 px-6 text-xs font-mono uppercase tracking-wider text-neutral-500">Price</th>
                    <th className="text-left py-3 px-6 text-xs font-mono uppercase tracking-wider text-neutral-500">Stock</th>
                    <th className="text-left py-3 px-6 text-xs font-mono uppercase tracking-wider text-neutral-500">Status</th>
                    <th className="text-left py-3 px-6 text-xs font-mono uppercase tracking-wider text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => {
                      const mappedProduct = mapProductData(product);
                      return (
                        <tr key={mappedProduct.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={mappedProduct.image}
                                alt={mappedProduct.name}
                                className="w-12 h-12 object-cover border border-neutral-200"
                                onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                              />
                              <div>
                                <p className="text-sm font-light text-neutral-900">{mappedProduct.name}</p>
                                {mappedProduct.sku && (
                                  <p className="text-xs text-neutral-500 font-mono mt-0.5">{mappedProduct.sku}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-neutral-600">{mappedProduct.category}</td>
                          <td className="py-4 px-6 text-sm font-mono text-neutral-900">${mappedProduct.price.toLocaleString()}</td>
                          <td className="py-4 px-6 text-sm">
                            <span className={`font-mono ${mappedProduct.stock === 0 ? 'text-red-600' : mappedProduct.stock < 20 ? 'text-orange-600' : 'text-neutral-900'}`}>
                              {mappedProduct.stock}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex px-2 py-0.5 text-xs font-mono uppercase tracking-wider ${
                              mappedProduct.status === 'Active' ? 'bg-green-100 text-green-700' : 
                              mappedProduct.status === 'Out of Stock' ? 'bg-red-100 text-red-700' : 
                              'bg-neutral-100 text-neutral-700'
                            }`}>
                              {mappedProduct.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate(`/admin/products/edit/${mappedProduct.id}`)}
                                className="p-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
                                title="Edit"
                              >
                                <FaEdit size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(mappedProduct.id, mappedProduct.name)}
                                className="p-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
                                title="Delete"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-12 px-6 text-center text-sm text-neutral-500">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between text-xs">
              <p className="text-neutral-600 font-mono">
                Showing {pagination.currentPage * pagination.pageSize + 1} to{" "}
                {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)}{" "}
                of {pagination.totalElements}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => fetchProducts(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 0 || loading}
                  className="px-3 py-1.5 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono uppercase tracking-wider"
                >
                  Prev
                </button>
                {[...Array(pagination.totalPages)].map((_, index) => {
                  if (index === 0 || index === pagination.totalPages - 1 || 
                      (index >= pagination.currentPage - 1 && index <= pagination.currentPage + 1)) {
                    return (
                      <button
                        key={index}
                        onClick={() => fetchProducts(index)}
                        disabled={loading}
                        className={`px-3 py-1.5 border font-mono uppercase tracking-wider transition-colors ${
                          pagination.currentPage === index
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  }
                  return null;
                })}
                <button
                  onClick={() => fetchProducts(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages - 1 || loading}
                  className="px-3 py-1.5 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono uppercase tracking-wider"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;