import React from 'react';
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaCog, FaSignOutAlt, FaChevronRight } from 'react-icons/fa';

const Sidebar = ({ user, activeTab, onTabChange }) => {
  return (
    <div className="lg:sticky lg:top-32">
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* User Profile Card */}
        <div className="flex flex-col items-center text-center mb-8 pb-8 border-b-2 border-gray-100">
          <div className="relative mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
              <FaUser className="text-white text-2xl" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
          </div>
          <div>
            <h3 className="font-poppins font-bold text-xl text-gray-900 mb-1">{user.name}</h3>
            <p className="text-sm text-gray-500 font-medium">{user.email}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          <button
            onClick={() => onTabChange('orders')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-poppins font-semibold text-left transition-all duration-300 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg scale-105'
                : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
            }`}
          >
            <FaShoppingBag className="text-lg" />
            <span className="flex-1">My Orders</span>
            {activeTab === 'orders' && <FaChevronRight className="text-sm" />}
          </button>

          <button
            onClick={() => onTabChange('personal')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-poppins font-semibold text-left transition-all duration-300 cursor-pointer ${
              activeTab === 'personal'
                ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg scale-105'
                : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
            }`}
          >
            <FaUser className="text-lg" />
            <span className="flex-1">Personal Info</span>
            {activeTab === 'personal' && <FaChevronRight className="text-sm" />}
          </button>

          <button
            onClick={() => onTabChange('addresses')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-poppins font-semibold text-left transition-all duration-300 cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg scale-105'
                : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
            }`}
          >
            <FaMapMarkerAlt className="text-lg" />
            <span className="flex-1">Addresses</span>
            {activeTab === 'addresses' && <FaChevronRight className="text-sm" />}
          </button>

          <div className="pt-4 mt-4 border-t-2 border-gray-100 space-y-2">
            <button className="w-full flex items-center gap-3 px-5 py-4 rounded-xl font-poppins font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
              <FaCog className="text-lg" />
              <span className="flex-1">Settings</span>
            </button>

            <button className="w-full flex items-center gap-3 px-5 py-4 rounded-xl font-poppins font-semibold text-red-600 hover:bg-red-50 transition-all duration-300 group cursor-pointer">
              <FaSignOutAlt className="text-lg group-hover:translate-x-1 transition-transform" />
              <span className="flex-1">Sign Out</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
