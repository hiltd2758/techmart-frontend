import React from 'react';
import { FaShoppingBag, FaEye, FaStar, FaTimesCircle, FaRedo, FaCalendar, FaChevronRight } from 'react-icons/fa';
import { getStatusConfig } from '../constants/orderStatuses';
import OrderItemCard from './OrderItemCard';
import ActionButton from '../common/ActionButton';

const OrderCard = ({ order, onViewDetails }) => {
  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 lg:p-8 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-4 rounded-xl">
            <FaShoppingBag className="text-2xl text-gray-700" />
          </div>
          <div>
            <h3 className="text-xl font-poppins font-bold text-gray-900 flex items-center gap-2">
              Order {order.id}
              <FaChevronRight className="text-sm text-gray-400 group-hover:text-gray-700 transition-colors" />
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <FaCalendar className="text-xs text-gray-400" />
              <p className="text-sm text-gray-500 font-medium">{order.date}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border-2 ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
          >
            <StatusIcon className={statusConfig.iconColor} />
            {statusConfig.text}
          </span>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">${order.total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-3 mb-6 bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100">
        {order.items.map((item, index) => (
          <OrderItemCard key={index} item={item} />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onViewDetails?.(order)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-poppins font-semibold rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
        >
          <FaEye />
          View Details
        </button>

        {order.status === 'delivered' && order.reviewed === false && <ActionButton icon={FaStar} label="Write Review" colorClasses="gray" />}

        {order.status === 'processing' && <ActionButton icon={FaTimesCircle} label="Cancel Order" colorClasses="red" />}
        {(order.status === 'cancelled' || order.status === 'delivered') && <ActionButton icon={FaRedo} label="Buy Back" colorClasses="green" />}
      </div>
    </div>
  );
};

export default OrderCard;
