import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const products = [
    {
      id: 1,
      name: 'MacBook Pro 16" M3 Max',
      category: "Laptops",
      price: 5499,
      stock: 15,
      status: "Active",
      image: "/arrivals/arrival_1.jpg",
      sku: "MBPRO-16-M3",
      dateAdded: "2023-12-01",
    },
    {
      id: 2,
      name: "iPhone 15 Pro Max",
      category: "Smartphones",
      price: 1199,
      stock: 25,
      status: "Active",
      image: "/arrivals/arrival_3.png",
      sku: "IPHONE-15PM",
      dateAdded: "2023-11-15",
    },
    {
      id: 3,
      name: "Samsung Galaxy S24 Ultra",
      category: "Smartphones",
      price: 999,
      stock: 0,
      status: "Out of Stock",
      image: "/arrivals/arrival_2.jpg",
      sku: "SAMSUNG-S24U",
      dateAdded: "2023-10-20",
    },
    {
      id: 4,
      name: "AirPods Pro Gen 2",
      category: "Accessories",
      price: 249,
      stock: 50,
      status: "Active",
      image: "/arrivals/arrival_4.jpg",
      sku: "AIRPODS-PRO2",
      dateAdded: "2023-09-10",
    },
  ];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage your product inventory and pricing
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
          <FaPlus size={14} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search products or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
          >
            <option value="all">All Categories</option>
            <option value="Laptops">Laptops</option>
            <option value="Smartphones">Smartphones</option>
            <option value="Accessories">Accessories</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-600">
                  Product
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-600">
                  Category
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-600">
                  Price
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-600">
                  Stock
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-11 h-11 rounded object-cover border border-gray-200"
                        />
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {product.category}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-sm text-gray-900">
                        ${product.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium text-sm ${
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock < 20
                              ? "text-orange-600"
                              : "text-gray-900"
                          }`}
                        >
                          {product.stock}
                        </span>
                        {product.stock === 0 && (
                          <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded font-medium">
                            Low
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`
                        inline-flex px-2.5 py-1 text-xs font-medium rounded
                        ${
                          product.status === "Active"
                            ? "bg-green-50 text-green-700"
                            : product.status === "Out of Stock"
                            ? "bg-red-50 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      `}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <FaEdit size={15} />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <FaTrash size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 px-6 text-center">
                    <p className="text-sm text-gray-500">
                      No products found matching your filters
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing 1 to {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg font-medium">
              1
            </button>
            <button
              className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;