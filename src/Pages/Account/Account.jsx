import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaCog,
  FaSignOutAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaEye,
  FaStar,
  FaChevronRight,
  FaTicketAlt,
  FaClock,
  FaCheckDouble,
  FaTimesCircle as FaTimes,
  FaBell,
  FaHeart,
  FaShieldAlt,
  FaChartLine,
  FaBoxOpen,
  FaHistory,
  FaCreditCard,
  FaMapMarked,
  FaBarcode,
  FaReceipt,
  FaDownload,
  FaPrint,
  FaExternalLinkAlt,
} from "react-icons/fa";
import HomeNavbar from "../../Components/HomeNavbar/HomeNavbar";
import Footer from "../../Components/Footer/Footer.jsx";
import { customerAPI } from "../../api/customerAPI";

const Account = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // User data state
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);

  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressesError, setAddressesError] = useState(null);

  useEffect(() => {
    // Get username from localStorage
    const username = localStorage.getItem("username");

    if (!username) {
      // Redirect to login if username not found
      navigate("/login");
      return;
    }

    // Fetch user profile from API
    customerAPI
      .getMyProfile(username)
      .then((response) => {
        const userData = response.data || response;
        // Map API response to user state
        const formattedUser = {
          name: userData.name || "",
          email: userData.email || "",
          phone: "+1 234 567 8900", // Hardcoded - backend doesn't provide
          joinDate: userData.createdAt
            ? new Date(userData.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })
            : "January 2024", // Fallback
          avatar: (userData.name || "U")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(), // Generate from name
          membershipTier: "Gold Member", // Hardcoded
        };
        setUser(formattedUser);
        setUserError(null);
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
        setUserError("Failed to load user profile");
        setUser(null);
      })
      .finally(() => setUserLoading(false));

    // Fetch addresses from API
    customerAPI
      .getAddresses()
      .then((response) => {
        const addressesData = response.data || response;
        const addressesArray = Array.isArray(addressesData)
          ? addressesData
          : [];
        setAddresses(addressesArray);
        setAddressesError(null);
      })
      .catch((err) => {
        console.error("Error fetching addresses:", err);
        setAddressesError("Failed to load addresses");
        setAddresses([]);
      })
      .finally(() => setAddressesLoading(false));
  }, [navigate]);
  // Sample orders data with complete details
  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      deliveryDate: "2024-01-18",
      status: "delivered",
      total: 5499,
      subtotal: 5499,
      shipping: 0,
      tax: 0,
      discount: 0,
      paymentMethod: "Credit Card",
      cardLast4: "4242",
      shippingAddress: {
        name: "John Doe",
        street: "123 Tech Street",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        phone: "+1 234 567 8900",
      },
      trackingNumber: "TRK123456789",
      items: [
        {
          name: 'MacBook Pro 16" M3 Max',
          quantity: 1,
          price: 5499,
          image: "/arrivals/arrival_1.jpg",
          sku: "MBP-M3-16-2024",
          specifications: "Apple M3 Max chip, 36GB RAM, 1TB SSD",
        },
      ],
      timeline: [
        {
          status: "Order Placed",
          date: "2024-01-15 10:30 AM",
          completed: true,
        },
        { status: "Processing", date: "2024-01-15 02:45 PM", completed: true },
        { status: "Shipped", date: "2024-01-16 09:20 AM", completed: true },
        {
          status: "Out for Delivery",
          date: "2024-01-18 08:00 AM",
          completed: true,
        },
        { status: "Delivered", date: "2024-01-18 03:15 PM", completed: true },
      ],
    },
    {
      id: "ORD-002",
      date: "2024-01-20",
      deliveryDate: null,
      status: "processing",
      total: 1299,
      subtotal: 1199,
      shipping: 50,
      tax: 50,
      discount: 0,
      paymentMethod: "PayPal",
      cardLast4: null,
      shippingAddress: {
        name: "John Doe",
        street: "456 Business Ave",
        city: "Palo Alto",
        state: "CA",
        zip: "94301",
        phone: "+1 234 567 8900",
      },
      trackingNumber: null,
      items: [
        {
          name: "iPhone 15 Pro",
          quantity: 1,
          price: 1199,
          image: "/arrivals/arrival_3.png",
          sku: "IP15-PRO-256",
          specifications: "256GB, Titanium Blue",
        },
      ],
      timeline: [
        {
          status: "Order Placed",
          date: "2024-01-20 11:15 AM",
          completed: true,
        },
        { status: "Processing", date: "2024-01-20 03:30 PM", completed: true },
        { status: "Shipped", date: null, completed: false },
        { status: "Out for Delivery", date: null, completed: false },
        { status: "Delivered", date: null, completed: false },
      ],
    },
    {
      id: "ORD-003",
      date: "2024-01-22",
      deliveryDate: null,
      status: "shipped",
      total: 749,
      subtotal: 747,
      shipping: 0,
      tax: 2,
      discount: 0,
      paymentMethod: "Credit Card",
      cardLast4: "8888",
      shippingAddress: {
        name: "John Doe",
        street: "123 Tech Street",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        phone: "+1 234 567 8900",
      },
      trackingNumber: "TRK987654321",
      items: [
        {
          name: "AirPods Pro Gen 2",
          quantity: 3,
          price: 249,
          image: "/arrivals/arrival_4.jpg",
          sku: "APP-GEN2-USB",
          specifications: "USB-C, Active Noise Cancellation",
        },
      ],
      timeline: [
        {
          status: "Order Placed",
          date: "2024-01-22 09:45 AM",
          completed: true,
        },
        { status: "Processing", date: "2024-01-22 01:20 PM", completed: true },
        { status: "Shipped", date: "2024-01-23 10:30 AM", completed: true },
        { status: "Out for Delivery", date: null, completed: false },
        { status: "Delivered", date: null, completed: false },
      ],
    },
  ];

  // Sample coupons data
  const coupons = [
    {
      id: "CPN-001",
      code: "SAVE20",
      title: "20% Off Electronics",
      description: "Get 20% discount on all electronic items",
      discount: "20%",
      type: "percentage",
      status: "available",
      expiryDate: "2024-02-15",
      minOrder: 100,
      maxDiscount: 50,
      usageLimit: 1,
      usedCount: 0,
      conditions: [
        "Minimum order: $100",
        "Max discount: $50",
        "Electronics only",
      ],
    },
    {
      id: "CPN-002",
      code: "FLAT10",
      title: "$10 Off Your Order",
      description: "Save $10 on any purchase above $50",
      discount: "$10",
      type: "fixed",
      status: "available",
      expiryDate: "2024-01-30",
      minOrder: 50,
      maxDiscount: 10,
      usageLimit: 1,
      usedCount: 0,
      conditions: ["Minimum order: $50", "All products"],
    },
    {
      id: "CPN-003",
      code: "WELCOME15",
      title: "Welcome Offer",
      description: "Special discount for new customers",
      discount: "15%",
      type: "percentage",
      status: "used",
      expiryDate: "2024-01-20",
      minOrder: 25,
      maxDiscount: 30,
      usageLimit: 1,
      usedCount: 1,
      conditions: ["New customers only", "Minimum order: $25"],
      usedOn: "2024-01-10",
      usedOnOrder: "ORD-002",
    },
    {
      id: "CPN-004",
      code: "EXPIRED25",
      title: "25% Off Special",
      description: "Limited time special offer",
      discount: "25%",
      type: "percentage",
      status: "expired",
      expiryDate: "2023-12-31",
      minOrder: 75,
      maxDiscount: 40,
      usageLimit: 1,
      usedCount: 0,
      conditions: ["Expired on Dec 31, 2023"],
    },
  ];

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseOrderDetails = () => {
    setShowOrderDetails(false);
    setTimeout(() => {
      setSelectedOrder(null);
      document.body.style.overflow = "unset";
    }, 300);
  };

  const getStatusConfig = (status) => {
    const configs = {
      delivered: {
        icon: FaCheckCircle,
        text: "Delivered",
        color: "emerald",
        bg: "bg-emerald-50",
        textColor: "text-emerald-700",
        border: "border-emerald-200",
        dotColor: "bg-emerald-500",
      },
      processing: {
        icon: FaBox,
        text: "Processing",
        color: "blue",
        bg: "bg-blue-50",
        textColor: "text-blue-700",
        border: "border-blue-200",
        dotColor: "bg-blue-500",
      },
      shipped: {
        icon: FaTruck,
        text: "Shipped",
        color: "purple",
        bg: "bg-purple-50",
        textColor: "text-purple-700",
        border: "border-purple-200",
        dotColor: "bg-purple-500",
      },
      cancelled: {
        icon: FaTimesCircle,
        text: "Cancelled",
        color: "red",
        bg: "bg-red-50",
        textColor: "text-red-700",
        border: "border-red-200",
        dotColor: "bg-red-500",
      },
    };
    return configs[status] || configs.processing;
  };

  // Order Details Modal Component
  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    const statusConfig = getStatusConfig(order.status);
    const StatusIcon = statusConfig.icon;
    if (loading) {
      return (
        <>
          <HomeNavbar />
          <div className="w-full bg-gray-50 pt-[100px] pb-20 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
          <Footer />
        </>
      );
    }

    if (error) {
      return (
        <>
          <HomeNavbar />
          <div className="w-full bg-gray-50 pt-[100px] pb-20 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTimesCircle className="text-3xl text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Failed to load profile
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                Retry
              </button>
            </div>
          </div>
          <Footer />
        </>
      );
    }
    return (
      <div
        className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ${showOrderDetails ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>

        {/* Modal */}
        <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6 lg:p-8">
          <div
            className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 transform transition-all duration-300 ${showOrderDetails ? "translate-y-0 scale-100" : "translate-y-4 scale-95"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 rounded-t-2xl px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <FaReceipt className="text-xl text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Order Details
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">{order.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <FaDownload size={18} />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <FaPrint size={18} />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Status Banner */}
              <div
                className={`${statusConfig.bg} border ${statusConfig.border} rounded-xl p-6`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 ${statusConfig.bg} rounded-xl flex items-center justify-center border-2 ${statusConfig.border}`}
                    >
                      <StatusIcon
                        className={`text-2xl ${statusConfig.textColor}`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          className={`text-2xl font-bold ${statusConfig.textColor}`}
                        >
                          {statusConfig.text}
                        </h3>
                        <span
                          className={`w-3 h-3 rounded-full ${statusConfig.dotColor} animate-pulse`}
                        ></span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.deliveryDate
                          ? `Delivered on ${new Date(order.deliveryDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
                          : "Estimated delivery: 3-5 business days"}
                      </p>
                    </div>
                  </div>
                  {order.trackingNumber && (
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      <FaExternalLinkAlt size={14} />
                      Track Package
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Order Items */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaBox className="text-gray-600" />
                      Order Items
                    </h3>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-20 h-20 bg-white rounded-lg border border-gray-200 p-2 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {item.specifications}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <FaBarcode />
                                SKU: {item.sku}
                              </span>
                              <span>•</span>
                              <span>Qty: {item.quantity}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              ${(item.price * item.quantity).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              ${item.price} each
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaHistory className="text-gray-600" />
                      Order Timeline
                    </h3>
                    <div className="space-y-4">
                      {order.timeline.map((event, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${event.completed ? "bg-emerald-100 border-2 border-emerald-500" : "bg-gray-100 border-2 border-gray-300"}`}
                            >
                              {event.completed ? (
                                <FaCheckCircle
                                  className="text-emerald-600"
                                  size={18}
                                />
                              ) : (
                                <FaClock className="text-gray-400" size={16} />
                              )}
                            </div>
                            {index < order.timeline.length - 1 && (
                              <div
                                className={`w-0.5 h-12 ${event.completed ? "bg-emerald-300" : "bg-gray-200"}`}
                              ></div>
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div
                              className={`font-semibold ${event.completed ? "text-gray-900" : "text-gray-400"}`}
                            >
                              {event.status}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {event.date || "Pending"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">
                      Order Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-900">
                          ${order.subtotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium text-gray-900">
                          ${order.shipping.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium text-gray-900">
                          ${order.tax.toLocaleString()}
                        </span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Discount</span>
                          <span className="font-medium text-emerald-600">
                            -${order.discount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span className="font-bold text-gray-900">Total</span>
                          <span className="font-bold text-xl text-gray-900">
                            ${order.total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaCreditCard className="text-gray-600" />
                      Payment
                    </h3>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                        <FaCreditCard className="text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {order.paymentMethod}
                        </div>
                        {order.cardLast4 && (
                          <div className="text-sm text-gray-500">
                            •••• {order.cardLast4}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaMapMarked className="text-gray-600" />
                      Shipping Address
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium text-gray-900">
                        {order.shippingAddress.name}
                      </p>
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zip}
                      </p>
                      <p className="pt-2 border-t border-gray-200 mt-2">
                        {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>

                  {/* Tracking Number */}
                  {order.trackingNumber && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FaTruck className="text-gray-600" />
                        Tracking
                      </h3>
                      <div className="bg-white border border-gray-200 border-dashed rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">
                          Tracking Number
                        </div>
                        <div className="font-mono font-bold text-gray-900 text-sm">
                          {order.trackingNumber}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {order.status === "delivered" && (
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                    <FaStar />
                    Leave a Review
                  </button>
                )}
                <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  <FaEnvelope />
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OrdersSection = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <FaBoxOpen className="text-xl text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Total</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {orders.length}
          </div>
          <div className="text-sm text-gray-500 mt-1">Orders placed</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <FaCheckCircle className="text-xl text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Completed</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {orders.filter((o) => o.status === "delivered").length}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Successfully delivered
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <FaChartLine className="text-xl text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Total Spent
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            $
            {orders
              .reduce((sum, order) => sum + order.total, 0)
              .toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-1">Lifetime value</div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all"
            >
              {/* Order Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {order.id}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {new Date(order.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.textColor} ${statusConfig.border} border`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor} animate-pulse`}
                      ></span>
                      {statusConfig.text}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      ${order.total.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6">
                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-200 p-2 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm mb-1">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Qty: {item.quantity} × ${item.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewOrderDetails(order)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <FaEye size={14} />
                    View Details
                  </button>
                  {order.status === "delivered" && (
                    <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      <FaStar size={14} />
                      Review
                    </button>
                  )}
                  {order.trackingNumber && (
                    <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      <FaTruck size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const PersonalInfoSection = () => (
    <div className="space-y-6">
      {/* Loading State */}
      {userLoading && (
        <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
          <div className="animate-pulse text-gray-600">Loading profile...</div>
        </div>
      )}

      {/* Error State */}
      {userError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-600 font-medium">{userError}</p>
        </div>
      )}

      {/* Profile Header Card */}
      {user && (
        <>
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

            <div className="relative flex items-center gap-6">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl font-bold border-2 border-white/20">
                {user.avatar}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                <p className="text-white/70 text-sm mb-3">{user.email}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-xs font-semibold border border-white/20">
                  <FaShieldAlt />
                  {user.membershipTier}
                </div>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 font-medium rounded-lg hover:bg-white/90 transition-colors">
                <FaEdit size={14} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <FaEnvelope className="text-gray-600" size={16} />
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Email
                </div>
              </div>
              <div className="font-semibold text-gray-900">{user.email}</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <FaPhone className="text-gray-600" size={16} />
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Phone
                </div>
              </div>
              <div className="font-semibold text-gray-900">{user.phone}</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <FaCalendar className="text-gray-600" size={16} />
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Member Since
                </div>
              </div>
              <div className="font-semibold text-gray-900">{user.joinDate}</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <FaShoppingBag className="text-gray-600" size={16} />
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Total Orders
                </div>
              </div>
              <div className="font-semibold text-gray-900">
                {orders.length} Orders
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-6">Account Overview</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {orders.length}
                </div>
                <div className="text-sm text-gray-500">Total Orders</div>
              </div>
              <div className="text-center border-x border-gray-200">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {addresses.length}
                </div>
                <div className="text-sm text-gray-500">Addresses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  $
                  {orders
                    .reduce((sum, order) => sum + order.total, 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Total Spent</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const AddressesSection = () => (
    <div className="space-y-6">
      {/* Loading State */}
      {addressesLoading && (
        <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
          <div className="animate-pulse text-gray-600">
            Loading addresses...
          </div>
        </div>
      )}

      {/* Error State */}
      {addressesError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-600 font-medium">{addressesError}</p>
        </div>
      )}

      {/* Content */}
      {!addressesLoading && !addressesError && (
        <>
          {/* Header with Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Saved Locations
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {addresses.length} Addresses
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
              <FaPlus size={14} />
              Add Address
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition-all"
              >
                {/* Address Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="text-gray-600" size={16} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {address.type}
                      </h3>
                      <p className="text-sm text-gray-500">{address.name}</p>
                    </div>
                  </div>
                  {address.isDefault && (
                    <div className="px-2.5 py-1 bg-gray-900 text-white text-xs font-semibold rounded-md">
                      Default
                    </div>
                  )}
                </div>

                {/* Address Details */}
                <div className="space-y-1 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.zip}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    <FaEdit size={12} />
                    Edit
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    <FaTrash size={12} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const getCouponStatusConfig = (status) => {
    const configs = {
      available: {
        icon: FaTicketAlt,
        text: "Available",
        bg: "bg-emerald-50",
        textColor: "text-emerald-700",
        border: "border-emerald-200",
        dotColor: "bg-emerald-500",
      },
      used: {
        icon: FaCheckDouble,
        text: "Used",
        bg: "bg-blue-50",
        textColor: "text-blue-700",
        border: "border-blue-200",
        dotColor: "bg-blue-500",
      },
      expired: {
        icon: FaTimes,
        text: "Expired",
        bg: "bg-gray-100",
        textColor: "text-gray-600",
        border: "border-gray-200",
        dotColor: "bg-gray-400",
      },
    };
    return configs[status] || configs.available;
  };

  const CouponsSection = () => {
    const [filter, setFilter] = useState("all");

    const filteredCoupons = coupons.filter(
      (coupon) => filter === "all" || coupon.status === filter,
    );

    const availableCount = coupons.filter(
      (c) => c.status === "available",
    ).length;
    const usedCount = coupons.filter((c) => c.status === "used").length;
    const expiredCount = coupons.filter((c) => c.status === "expired").length;

    return (
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {availableCount}
            </div>
            <div className="text-sm text-gray-500">Available</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {usedCount}
            </div>
            <div className="text-sm text-gray-500">Used</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {expiredCount}
            </div>
            <div className="text-sm text-gray-500">Expired</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 p-2">
          <div className="flex gap-1">
            {["all", "available", "used", "expired"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg capitalize transition-all ${
                  filter === filterType
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {filterType === "all" ? "All" : filterType}
              </button>
            ))}
          </div>
        </div>

        {/* Coupons List */}
        <div className="space-y-4">
          {filteredCoupons.map((coupon) => {
            const statusConfig = getCouponStatusConfig(coupon.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={coupon.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left: Coupon Info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <StatusIcon className="text-xl text-gray-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold mb-2 ${statusConfig.bg} ${statusConfig.textColor} ${statusConfig.border} border`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor} animate-pulse`}
                          ></span>
                          {statusConfig.text}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {coupon.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {coupon.description}
                        </p>
                      </div>
                    </div>

                    {/* Coupon Code */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 border-dashed mb-4">
                      <div className="text-xs text-gray-500 mb-1">
                        Coupon Code
                      </div>
                      <div className="font-mono font-bold text-gray-900">
                        {coupon.code}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Expires
                        </div>
                        <div className="font-semibold text-gray-900">
                          {new Date(coupon.expiryDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Usage</div>
                        <div className="font-semibold text-gray-900">
                          {coupon.usedCount}/{coupon.usageLimit}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Discount & Action */}
                  <div className="md:w-48 bg-gray-50 p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col justify-between">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-gray-900 mb-1">
                        {coupon.discount}
                      </div>
                      <div className="text-sm font-semibold text-gray-500">
                        OFF
                      </div>
                    </div>

                    <button
                      className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                        coupon.status === "available"
                          ? "bg-gray-900 text-white hover:bg-gray-800"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={coupon.status !== "available"}
                    >
                      {coupon.status === "available"
                        ? "Apply"
                        : coupon.status === "used"
                          ? "Used"
                          : "Expired"}
                    </button>

                    {/* Conditions */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-xs font-semibold text-gray-500 mb-2">
                        CONDITIONS
                      </div>
                      <ul className="space-y-1">
                        {coupon.conditions
                          .slice(0, 2)
                          .map((condition, index) => (
                            <li
                              key={index}
                              className="text-xs text-gray-600 flex items-start gap-1.5"
                            >
                              <span className="text-gray-400 mt-0.5">•</span>
                              <span>{condition}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCoupons.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <FaTicketAlt className="text-5xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No {filter === "all" ? "" : filter} coupons
            </h3>
            <p className="text-sm text-gray-500">
              {filter === "available" && "Check back later for new offers"}
              {filter === "used" && "You haven't used any coupons yet"}
              {filter === "expired" && "No expired coupons to show"}
              {filter === "all" && "Start shopping to earn coupons!"}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return <OrdersSection />;
      case "personal":
        return <PersonalInfoSection />;
      case "addresses":
        return <AddressesSection />;
      case "coupons":
        return <CouponsSection />;
      default:
        return <OrdersSection />;
    }
  };

  const navigationItems = [
    {
      id: "orders",
      icon: FaShoppingBag,
      label: "Orders",
      badge: orders.length,
    },
    { id: "personal", icon: FaUser, label: "Profile", badge: null },
    {
      id: "addresses",
      icon: FaMapMarkerAlt,
      label: "Addresses",
      badge: addresses.length,
    },
    {
      id: "coupons",
      icon: FaTicketAlt,
      label: "Coupons",
      badge: coupons.filter((c) => c.status === "available").length,
    },
  ];

  return (
    <>
      <HomeNavbar />
      <div className="w-full bg-gray-50 pt-[100px] pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  My Account
                </h1>
                <p className="text-gray-500">Welcome back, {user?.name}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-24">
                {/* User Profile Compact */}
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-200">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    {user?.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-sm truncate">
                      {user?.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </div>
                  </div>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-left transition-all ${
                        activeTab === item.id
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="flex-shrink-0" size={16} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge !== null && item.badge > 0 && (
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            activeTab === item.id
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}

                  <div className="pt-3 mt-3 border-t border-gray-200 space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50 transition-all">
                      <FaCog size={16} />
                      <span className="flex-1">Settings</span>
                    </button>

                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-red-600 hover:bg-red-50 transition-all">
                      <FaSignOutAlt size={16} />
                      <span className="flex-1">Sign Out</span>
                    </button>
                  </div>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">{renderContent()}</div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={handleCloseOrderDetails}
        />
      )}

      <Footer />
    </>
  );
};

export default Account;
