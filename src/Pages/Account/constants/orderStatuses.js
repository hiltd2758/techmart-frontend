import { FaCheckCircle, FaBox, FaTruck, FaTimesCircle } from 'react-icons/fa';

export const getStatusConfig = (status) => {
  const configs = {
    delivered: {
      icon: FaCheckCircle,
      text: 'Delivered',
      bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
    },
    processing: {
      icon: FaBox,
      text: 'Processing',
      bgColor: 'bg-gradient-to-r from-blue-50 to-cyan-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
    },
    shipped: {
      icon: FaTruck,
      text: 'Shipped',
      bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
    },
    cancelled: {
      icon: FaTimesCircle,
      text: 'Cancelled',
      bgColor: 'bg-gradient-to-r from-red-50 to-orange-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
    },
  };
  return configs[status] || configs.processing;
};
