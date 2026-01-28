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

const Dashboard = () => {
  const stats = [
    {
      title: "Total Products",
      value: "1,234",
      change: "+12%",
      changeType: "increase",
      icon: FaBox,
    },
    {
      title: "Total Orders",
      value: "567",
      change: "+8%",
      changeType: "increase",
      icon: FaShoppingCart,
    },
    {
      title: "Total Users",
      value: "890",
      change: "+23%",
      changeType: "increase",
      icon: FaUsers,
    },
    {
      title: "Revenue",
      value: "$45,678",
      change: "-3%",
      changeType: "decrease",
      icon: FaDollarSign,
    },
  ];

  const recentOrders = [
    {
      id: "#12345",
      customer: "John Doe",
      amount: "$299.99",
      status: "Completed",
      statusColor: "green",
    },
    {
      id: "#12346",
      customer: "Jane Smith",
      amount: "$599.50",
      status: "Processing",
      statusColor: "yellow",
    },
    {
      id: "#12347",
      customer: "Mike Johnson",
      amount: "$399.99",
      status: "Pending",
      statusColor: "blue",
    },
    {
      id: "#12348",
      customer: "Sarah Wilson",
      amount: "$799.00",
      status: "Completed",
      statusColor: "green",
    },
  ];

  const topProducts = [
    {
      name: "MacBook Pro M3",
      sold: 45,
      price: "$2,499",
      image: "/arrivals/arrival_1.jpg",
    },
    {
      name: "iPhone 15 Pro",
      sold: 38,
      price: "$999",
      image: "/arrivals/arrival_3.png",
    },
    {
      name: "AirPods Pro",
      sold: 32,
      price: "$249",
      image: "/arrivals/arrival_4.jpg",
    },
  ];

  const recentActivities = [
    {
      type: "order",
      message: "New order #12349 received",
      time: "2 minutes ago",
      icon: FaShoppingCart,
    },
    {
      type: "product",
      message: "New product added to inventory",
      time: "15 minutes ago",
      icon: FaBox,
    },
    {
      type: "user",
      message: "New user registered",
      time: "1 hour ago",
      icon: FaUsers,
    },
    {
      type: "order",
      message: "Order #12348 shipped",
      time: "3 hours ago",
      icon: FaShoppingCart,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Monitor your store performance and key metrics
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
          <FaDownload size={14} />
          Download Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <stat.icon className="text-lg text-gray-700" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
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
            <p className="text-gray-500 text-xs font-medium mb-2">{stat.title}</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders - 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Recent Orders
            </h2>
            <a
              href="/admin/orders"
              className="text-gray-600 hover:text-gray-900 text-xs font-medium flex items-center gap-1 transition-colors"
            >
              View All
              <FaChevronRight size={10} />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-600">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-600">
                    Customer
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm text-gray-900">
                        {order.id}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700 text-sm">
                      {order.customer}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-sm text-gray-900">
                        {order.amount}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`
                        inline-flex px-2.5 py-1 text-xs font-medium rounded
                        ${
                          order.statusColor === "green"
                            ? "bg-green-50 text-green-700"
                            : ""
                        }
                        ${
                          order.statusColor === "yellow"
                            ? "bg-yellow-50 text-yellow-700"
                            : ""
                        }
                        ${
                          order.statusColor === "blue"
                            ? "bg-blue-50 text-blue-700"
                            : ""
                        }
                      `}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products - 1 column */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Top Products
            </h2>
            <a
              href="/admin/products"
              className="text-gray-600 hover:text-gray-900 text-xs font-medium flex items-center gap-1 transition-colors"
            >
              View All
              <FaChevronRight size={10} />
            </a>
          </div>
          <div className="p-4 space-y-3">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="flex items-center gap-3 flex-1">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded object-cover border border-gray-200"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sold} sold</p>
                  </div>
                </div>
                <span className="font-semibold text-sm text-gray-900 ml-2">
                  {product.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity, index) => {
              const ActivityIcon = activity.icon;
              return (
                <div
                  key={index}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-center gap-4"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 flex-shrink-0">
                    <ActivityIcon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Performance
            </h3>
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Conversion Rate</span>
                  <span className="text-sm font-semibold text-gray-900">
                    3.24%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-gray-900 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: "32.4%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Growth Rate</span>
                  <span className="text-sm font-semibold text-gray-900">
                    8.52%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-green-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: "85.2%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Avg Order Value</span>
                  <span className="text-sm font-semibold text-gray-900">
                    $485
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Today's Sales</span>
                <span className="font-semibold text-gray-900">$2,849</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Orders</span>
                <span className="font-semibold text-gray-900">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Low Stock Items</span>
                <span className="font-semibold text-orange-600">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;