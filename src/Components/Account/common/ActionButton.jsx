import React from 'react';

const ActionButton = ({ icon: Icon, label, colorClasses, onClick }) => {
  const colorMap = {
    green: 'border-green-200 text-green-700 hover:border-green-900 hover:bg-green-50',
    red: 'border-red-200 text-red-700 hover:border-red-900 hover:bg-red-50',
    gray: 'border-gray-200 text-gray-700 hover:border-gray-900 hover:bg-gray-50',
    blue: 'border-blue-200 text-blue-700 hover:border-blue-900 hover:bg-blue-50',
  };

  const colorClasses_ = colorMap[colorClasses] || colorMap.gray;

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-6 py-3 border-2 ${colorClasses_} font-semibold rounded-xl transition-all duration-300 cursor-pointer whitespace-nowrap`}
    >
      {Icon && <Icon />}
      {label}
    </button>
  );
};

export default ActionButton;
