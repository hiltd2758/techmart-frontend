import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser,
  FaChevronDown,
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { authAPI } from "../../api/customerAPI";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  
  useEffect(() => {
    document.title = 'TechMart Admin Dashboard';
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await authAPI.logout();

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      navigate('/login');
    } catch (error) {
      console.error('Logout API failed:', error);

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    { path: "/admin", icon: FaTachometerAlt, label: "Dashboard", exact: true },
    { path: "/admin/products", icon: FaBox, label: "Products" },
    { path: "/admin/orders", icon: FaShoppingCart, label: "Orders" },
    { path: "/admin/users", icon: FaUsers, label: "Users" },
    { path: "/admin/countries", icon: FaBox, label: "Countries" },
    { path: "/admin/settings", icon: FaCog, label: "Settings" },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-200">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-900 flex items-center justify-center">
              <span className="text-white font-mono text-sm font-bold">T</span>
            </div>
            <span className="text-sm font-mono uppercase tracking-widest text-neutral-900">
              TechMart
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-4 py-3 text-xs font-mono uppercase tracking-wider
                transition-all duration-200 border-l-2
                ${isActive(item.path, item.exact)
                  ? "bg-neutral-100 text-neutral-900 border-neutral-900"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 border-transparent"
                }
              `}
            >
              <item.icon
                className={`mr-3 ${isActive(item.path, item.exact)
                    ? "text-neutral-900"
                    : "text-neutral-400"
                  }`}
                size={14}
              />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-neutral-200">
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center w-full px-4 py-3 text-xs font-mono uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-l-2 border-transparent hover:border-red-600"
          >
            <FaSignOutAlt className="mr-3" size={14} />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <FaBars size={18} />
          </button>

          <div className="flex items-center gap-4 flex-1 justify-center lg:justify-start">
            <div className="hidden md:flex items-center px-4 py-2.5 bg-neutral-50 border border-neutral-200 w-96">
              <input
                type="text"
                placeholder="Search products, orders..."
                className="bg-transparent border-none outline-none text-sm font-mono w-full placeholder-neutral-400 text-neutral-900"
              />
            </div>
          </div>

          {/* Avatar Dropdown */}
          <div className="relative ml-auto" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 transition-colors duration-200 border border-transparent hover:border-neutral-200"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-mono text-neutral-900">Admin User</p>
                <p className="text-xs font-mono text-neutral-400">admin@techmart.com</p>
              </div>

              <div className="w-9 h-9 bg-neutral-900 flex items-center justify-center text-white font-mono text-xs">
                A
              </div>

              <FaChevronDown
                className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 py-1 z-50 shadow-sm">
                <div className="sm:hidden px-4 py-3 border-b border-neutral-100">
                  <p className="text-xs font-mono text-neutral-900">Admin User</p>
                  <p className="text-xs font-mono text-neutral-400 mt-1">admin@techmart.com</p>
                </div>

                {/* Menu Items */}
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors duration-150">
                  <FaUser className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors duration-150">
                  <FaCog className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </button>

                <div className="border-t border-neutral-100 my-1"></div>

                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSignOutAlt className="w-3.5 h-3.5" />
                  <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-neutral-50">
          <Outlet />
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;