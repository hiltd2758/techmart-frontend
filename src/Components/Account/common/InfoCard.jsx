import React from 'react';

const InfoCard = ({ icon: Icon, label, textColor, colorClass, value }) => (
  <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-100 hover:border-gray-300 transition-all duration-300">
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
        <Icon className={`${textColor}`} />
      </div>
      <label className="text-sm text-gray-500 font-semibold uppercase tracking-wider">{label}</label>
    </div>
    <p className="text-gray-900 font-bold text-lg">{value}</p>
  </div>
);

export default InfoCard;
