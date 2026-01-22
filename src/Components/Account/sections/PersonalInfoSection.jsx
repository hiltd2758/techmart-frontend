import React from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaEdit } from 'react-icons/fa';
import InfoCard from '../common/InfoCard';

const PersonalInfoSection = ({ user, orders }) => {
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl text-gray-900 font-poppins font-bold">Personal Information</h2>
          <p className="text-gray-500 mt-1">Manage your personal details</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-poppins font-semibold rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer">
          <FaEdit />
          Edit Profile
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard icon={FaUser} label="Full Name" textColor="text-blue-600" colorClass="bg-blue-100" value={user.name} />
        <InfoCard icon={FaEnvelope} label="Email" textColor="text-purple-600" colorClass="bg-purple-100" value={user.email} />
        <InfoCard icon={FaPhone} label="Phone" textColor="text-green-600" colorClass="bg-green-100" value={user.phone} />
        <InfoCard icon={FaCalendar} label="Member Since" textColor="text-orange-600" colorClass="bg-orange-100" value={user.joinDate} />
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t-2 border-gray-100">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-900 mb-1">{orders.length}</p>
          <p className="text-sm text-gray-500 font-medium">Total Orders</p>
        </div>
        <div className="text-center border-x-2 border-gray-100">
          <p className="text-3xl font-bold text-gray-900 mb-1">{user.addresses.length}</p>
          <p className="text-sm text-gray-500 font-medium">Saved Addresses</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600 mb-1">${totalSpent.toLocaleString()}</p>
          <p className="text-sm text-gray-500 font-medium">Total Spent</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
