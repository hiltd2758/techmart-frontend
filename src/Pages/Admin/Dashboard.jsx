import { useState, useEffect } from "react";
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
  FaChevronRight,
} from "react-icons/fa";
import { productAPI } from "../../api/productAPI";
import { customerAPI } from "../../api/customerAPI";

const Dashboard = () => {
  const [stats, setStats] = useState([
    {
      title: "Total Products",
      value: "0",
      change: "+0%",
      changeType: "increase",
      icon: FaBox,
    },
    {
      title: "Total Orders",
      value: "0",
      change: "+0%",
      changeType: "increase",
      icon: FaShoppingCart,
    },
    {
      title: "Total Users",
      value: "0",
      change: "+0%",
      changeType: "increase",
      icon: FaUsers,
    },
  ]);

  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const warehouseRes = await productAPI.getWarehouseProducts({
          page: 0,
          size: 1000,
        });
        
        console.log("=== WAREHOUSE API RESPONSE ===");
        console.log("Full Response:", warehouseRes);
        console.log("warehouseRes.data:", warehouseRes.data);
        console.log("warehouseRes.data.data:", warehouseRes.data?.data);
        
        console.log("Response keys:", Object.keys(warehouseRes.data?.data || {}));
        console.log("totalElements:", warehouseRes.data?.data?.totalElements);
        console.log("content:", warehouseRes.data?.data?.content);
        console.log("totalPages:", warehouseRes.data?.data?.totalPages);
        console.log("pageNumber:", warehouseRes.data?.data?.pageNumber);
        console.log("pageSize:", warehouseRes.data?.data?.pageSize);
        
        const warehouseData = warehouseRes.data?.data;
        let totalProductsCount = warehouseData?.totalElements || 0;
        let warehouseProducts = warehouseData?.content || [];
        
        console.log("totalProductsCount:", totalProductsCount);
        console.log("warehouseProducts.length:", warehouseProducts.length);
        console.log("warehouseProducts:", warehouseProducts);
        
        if (totalProductsCount === 0 && warehouseProducts.length === 0) {
          console.log("⚠️ Warehouse endpoint trả về 0, đang fallback sang adminGetProducts...");
          const fallbackRes = await productAPI.adminGetProducts({
            page: 0,
            size: 1000,
          });
          
          console.log("=== FALLBACK ADMIN PRODUCTS RESPONSE ===");
          console.log("Response keys:", Object.keys(fallbackRes.data?.data || {}));
          console.log("totalElements:", fallbackRes.data?.data?.totalElements);
          console.log("content length:", fallbackRes.data?.data?.content?.length);
          
          totalProductsCount = fallbackRes.data?.data?.totalElements || 0;
          warehouseProducts = fallbackRes.data?.data?.content || [];
          
          console.log("Fallback totalProductsCount:", totalProductsCount);
          console.log("Fallback warehouseProducts.length:", warehouseProducts.length);
        }

        const customersRes = await customerAPI.getCustomers(0, 10);
        
        console.log("=== CUSTOMERS API RESPONSE ===");
        console.log("Full Response:", customersRes);
        console.log("customersRes.data.data:", customersRes.data?.data);
        
        const customersData = customersRes.data?.data;
        const totalCustomersCount = customersData?.totalElements || 0;
        const allCustomers = customersData?.content || [];
        
        console.log("totalCustomersCount:", totalCustomersCount);
        console.log("allCustomers.length:", allCustomers.length);

        const totalRevenue = warehouseProducts.reduce(
          (sum, product) => sum + (product.price || 0),
          0
        );
        
        console.log("totalRevenue:", totalRevenue);
        console.log("=== CALCULATED STATS ===");
        console.log("Total Orders (quantity > 0):", warehouseProducts.filter((p) => p.quantity > 0).length);

        setStats([
          {
            title: "Total Products",
            value: totalProductsCount.toLocaleString(),
            change: "+12%",
            changeType: "increase",
            icon: FaBox,
          },
          {
            title: "Total Orders",
            value: warehouseProducts
              .filter((p) => p.quantity > 0)
              .length.toString(),
            change: "+8%",
            changeType: "increase",
            icon: FaShoppingCart,
          },
          {
            title: "Total Users",
            value: totalCustomersCount.toLocaleString(),
            change: "+23%",
            changeType: "increase",
            icon: FaUsers,
          },
        ]);

        const ordersData = warehouseProducts.slice(0, 4).map((product, index) => ({
          id: `#${10000 + index}`,
          customer: product.sellerName || product.name || "Store",
          amount: `$${product.price || 0}`,
          status: product.quantity > 0 ? "In Stock" : "Out of Stock",
          statusColor: product.quantity > 0 ? "green" : "red",
        }));
        setRecentOrders(ordersData);

        const topProductsData = warehouseProducts
          .filter((p) => p.thumbnail)
          .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
          .slice(0, 3)
          .map((product) => ({
            name: product.name,
            sold: product.quantity || 0,
            price: `$${product.price || 0}`,
            image: product.thumbnail || "/arrivals/arrival_1.jpg",
          }));
        setTopProducts(topProductsData);

        setLoading(false);
      } catch (error) {
        console.error("❌ Lỗi khi fetch dữ liệu Dashboard:", error);
        console.error("Error message:", error.message);
        console.error("Error response:", error.response);
        console.error("Error config:", error.config);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-500 mt-4 text-sm font-mono">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-end justify-between pb-6 border-b border-neutral-200">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-neutral-900">Dashboard</h1>
            <p className="text-neutral-500 mt-1 text-sm font-mono">Real-time metrics</p>
          </div>
          <button className="h-9 px-4 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-2">
            <FaDownload size={12} />
            Export
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white border border-neutral-200 p-6 group hover:border-neutral-900 transition-colors"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-900 transition-colors">
                  <stat.icon className="text-neutral-600 group-hover:text-white transition-colors" size={16} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-mono ${
                  stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.changeType === "increase" ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                  {stat.change}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-mono uppercase tracking-wider text-neutral-400">{stat.title}</p>
                <p className="text-3xl font-light text-neutral-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-900">Recent Orders</h2>
              <a href="/admin/orders" className="text-xs font-mono text-neutral-500 hover:text-neutral-900 flex items-center gap-1 uppercase tracking-wider">
                View All
                <FaChevronRight size={8} />
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-6 text-xs font-mono uppercase tracking-wider text-neutral-500">Order</th>
                    <th className="text-left py-3 px-6 text-xs font-mono uppercase tracking-wider text-neutral-500">Customer</th>
                    <th className="text-left py-3 px-6 text-xs font-mono uppercase tracking-wider text-neutral-500">Amount</th>
                    <th className="text-left py-3 px-6 text-xs font-mono uppercase tracking-wider text-neutral-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm text-neutral-900">{order.id}</span>
                      </td>
                      <td className="py-4 px-6 text-sm text-neutral-600">{order.customer}</td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm text-neutral-900">{order.amount}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-mono uppercase tracking-wider ${
                          order.statusColor === "green" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-900">Top Products</h2>
              <a href="/admin/products" className="text-xs font-mono text-neutral-500 hover:text-neutral-900 flex items-center gap-1 uppercase tracking-wider">
                View All
                <FaChevronRight size={8} />
              </a>
            </div>
            <div className="divide-y divide-neutral-100">
              {topProducts.map((product, index) => (
                <div key={index} className="p-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 object-cover border border-neutral-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-900 truncate font-light">{product.name}</p>
                    <p className="text-xs text-neutral-500 font-mono mt-0.5">{product.sold} units</p>
                  </div>
                  <span className="font-mono text-sm text-neutral-900 whitespace-nowrap">{product.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;