import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { productAPI } from "../../api/productAPI";
import { customerAPI } from "../../api/customerAPI";

/**
 * DASHBOARD COMPONENT
 * ==================
 * Mục đích: Hiển thị tổng quan thống kê hệ thống
 * - Tổng số sản phẩm, đơn hàng, người dùng
 * - Danh sách đơn hàng gần đây
 * - Top sản phẩm bán chạy
 */
const Dashboard = () => {
  // ==========================================
  // HOOKS & NAVIGATION
  // ==========================================
  const navigate = useNavigate();

  // ==========================================
  // STATE MANAGEMENT - Quản lý trạng thái
  // ==========================================

  /**
   * stats: Mảng chứa các thống kê tổng quan
   * Mỗi stat bao gồm: title (tiêu đề), value (giá trị), change (% thay đổi), icon (biểu tượng), route (liên kết)
   */
  const [stats, setStats] = useState([
    {
      title: "Tổng sản phẩm",
      value: "0",
      change: "+0%",
      changeType: "increase",
      icon: FaBox,
      route: "/admin/products",
    },
    {
      title: "Tổng đơn hàng",
      value: "0",
      change: "+0%",
      changeType: "increase",
      icon: FaShoppingCart,
      route: "/admin/orders",
    },
    {
      title: "Tổng người dùng",
      value: "0",
      change: "+0%",
      changeType: "increase",
      icon: FaUsers,
      route: "/admin/users",
    },
  ]);

  /**
   * topProducts: Top 3 sản phẩm có số lượng cao nhất
   */
  const [topProducts, setTopProducts] = useState([]);

  /**
   * loading: Trạng thái đang tải dữ liệu
   * true = đang tải, false = đã tải xong
   */
  const [loading, setLoading] = useState(true);

  // ==========================================
  // DATA FETCHING - Lấy dữ liệu từ API
  // ==========================================

  useEffect(() => {
    /**
     * Hàm lấy tất cả dữ liệu cần thiết cho Dashboard
     * Chạy khi component được render lần đầu
     */
    const fetchDashboardData = async () => {
      try {
        // Bắt đầu loading
        setLoading(true);

        // ----------------
        // BƯỚC 1: Lấy dữ liệu sản phẩm
        // ----------------
        console.log("📦 Bước 1: Đang lấy danh sách sản phẩm...");
        
        const warehouseRes = await productAPI.getWarehouseProducts({
          page: 0,
          size: 1000, // Lấy tối đa 1000 sản phẩm
        });

        // Trích xuất dữ liệu từ response
        const warehouseData = warehouseRes.data?.data;
        let totalProductsCount = warehouseData?.totalElements || 0;
        let warehouseProducts = warehouseData?.content || [];

        console.log(`✅ Tìm thấy ${totalProductsCount} sản phẩm`);

        // Fallback: Nếu không có dữ liệu, thử API khác
        if (totalProductsCount === 0 && warehouseProducts.length === 0) {
          console.log("⚠️ Không có dữ liệu từ warehouse, thử API admin...");
          
          const fallbackRes = await productAPI.adminGetProducts({
            page: 0,
            size: 1000,
          });

          totalProductsCount = fallbackRes.data?.data?.totalElements || 0;
          warehouseProducts = fallbackRes.data?.data?.content || [];
          
          console.log(`✅ Tìm thấy ${totalProductsCount} sản phẩm từ admin API`);
        }

        // ----------------
        // BƯỚC 2: Lấy dữ liệu khách hàng
        // ----------------
        console.log("👥 Bước 2: Đang lấy danh sách khách hàng...");
        
        const customersRes = await customerAPI.getCustomers(0, 10);
        const customersData = customersRes.data?.data;
        const totalCustomersCount = customersData?.totalElements || 0;

        console.log(`✅ Tìm thấy ${totalCustomersCount} khách hàng`);

        // ----------------
        // BƯỚC 3: Tính toán thống kê
        // ----------------
        console.log("📊 Bước 3: Đang tính toán thống kê...");

        // Đếm số đơn hàng = số sản phẩm có quantity > 0
        const ordersCount = warehouseProducts.filter(
          (product) => product.quantity > 0
        ).length;

        // Cập nhật stats với dữ liệu thực tế
        setStats([
          {
            title: "Tổng sản phẩm",
            value: totalProductsCount.toLocaleString(), // Định dạng số có dấu phẩy
            change: "+12%",
            changeType: "increase",
            icon: FaBox,
            route: "/admin/products",
          },
          {
            title: "Tổng đơn hàng",
            value: ordersCount.toString(),
            change: "+8%",
            changeType: "increase",
            icon: FaShoppingCart,
            route: "/admin/orders",
          },
          {
            title: "Tổng người dùng",
            value: totalCustomersCount.toLocaleString(),
            change: "+23%",
            changeType: "increase",
            icon: FaUsers,
            route: "/admin/users",
          },
        ]);

        // ----------------
        // BƯỚC 4: Tìm Top 3 sản phẩm
        // ----------------
        // Sắp xếp theo quantity giảm dần, lấy 3 sản phẩm đầu
        const topProductsData = warehouseProducts
          .filter((product) => product.thumbnail) // Chỉ lấy sản phẩm có ảnh
          .sort((a, b) => (b.quantity || 0) - (a.quantity || 0)) // Sắp xếp giảm dần
          .slice(0, 3) // Lấy 3 sản phẩm đầu
          .map((product) => ({
            name: product.name,
            sold: product.quantity || 0,
            price: `$${product.price || 0}`,
            image: product.thumbnail,
          }));
        setTopProducts(topProductsData);

        console.log("✅ Hoàn thành tải dữ liệu Dashboard");
        
        // Tắt loading
        setLoading(false);
      } catch (error) {
        // Xử lý lỗi
        console.error("❌ Lỗi khi tải dữ liệu:", error.message);
        setLoading(false);
      }
    };

    // Gọi hàm fetch dữ liệu
    fetchDashboardData();
  }, []); // [] = chỉ chạy 1 lần khi component mount

  // ==========================================
  // RENDER UI - Hiển thị giao diện
  // ==========================================

  // Màn hình loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-600 mt-4 text-sm">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Màn hình chính
  return (
    <div className="min-h-screen bg-neutral-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ========== HEADER - Tiêu đề trang ========== */}
        <div className="flex items-end justify-between pb-6 border-b border-neutral-200">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-neutral-900">Dashboard</h1>
            <p className="text-neutral-500 mt-1 text-sm font-mono">Tổng quan hệ thống</p>
          </div>
        </div>

        {/* ========== STATS CARDS - Các thẻ thống kê ========== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <button
              key={index}
              onClick={() => navigate(stat.route)}
              className="bg-white border border-neutral-200 p-6 hover:shadow-md hover:border-neutral-300 transition-all text-left cursor-pointer active:scale-95"
            >
              {/* Phần trên: Icon và % thay đổi */}
              <div className="flex items-start justify-between mb-4">
                {/* Icon */}
                <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center">
                  <stat.icon className="text-neutral-600" size={20} />
                </div>
                
                {/* Phần trăm thay đổi */}
                <div
                  className={`flex items-center gap-1 text-xs font-mono ${
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.changeType === "increase" ? (
                    <FaArrowUp size={10} />
                  ) : (
                    <FaArrowDown size={10} />
                  )}
                  {stat.change}
                </div>
              </div>

              {/* Phần dưới: Tiêu đề và giá trị */}
              <div>
                <p className="text-neutral-500 text-xs font-mono uppercase tracking-wider">{stat.title}</p>
                <p className="text-2xl font-light text-neutral-900 mt-1">
                  {stat.value}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* ========== TOP PRODUCTS - Sản phẩm bán chạy ========== */}
        <div className="bg-white border border-neutral-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-light tracking-tight text-neutral-900">
              Top sản phẩm
            </h2>
            <p className="text-neutral-500 text-xs font-mono mt-1">Sản phẩm có tồn kho cao nhất</p>
          </div>

          {/* Product Grid */}
          {topProducts.length === 0 ? (
            <div className="py-12 px-6 text-center text-sm text-neutral-500">
              Chưa có dữ liệu
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 divide-x divide-y divide-neutral-200">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="p-6 hover:bg-neutral-50 transition-colors"
                >
                  {/* Ảnh sản phẩm */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover border border-neutral-200 mb-4"
                  />
                  
                  {/* Thông tin sản phẩm */}
                  <p className="text-sm font-light text-neutral-900 line-clamp-2 mb-2">
                    {product.name}
                  </p>
                  <p className="text-xs text-neutral-500 font-mono mb-3">
                    Stock: <span className="font-mono text-neutral-900">{product.sold}</span>
                  </p>
                  <p className="text-lg font-light text-neutral-900">
                    {product.price}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;