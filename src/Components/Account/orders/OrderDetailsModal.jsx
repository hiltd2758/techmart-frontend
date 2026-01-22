import React from 'react';
import { FaStar, FaTimesCircle, FaRedo } from 'react-icons/fa';
import { getStatusConfig } from '../constants/orderStatuses';
import OrderItemCard from './OrderItemCard';
import ActionButton from '../common/ActionButton';

const OrderDetailsModal = ({ selectedOrder, user, onClose, onViewDetails }) => {
  if (!selectedOrder) return null;

  const statusConfig = getStatusConfig(selectedOrder.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Order Details - {selectedOrder.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl font-bold cursor-pointer">
            &times;
          </button>
        </div>

        {/* Order Info */}
        <div className="border-b border-gray-100 py-4 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Order Date</p>
            <p className="font-semibold text-gray-900">{selectedOrder.date}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border-2`}
            >
              {React.createElement(statusConfig.icon, {
                className: statusConfig.iconColor,
              })}
              {statusConfig.text}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
            <p className="font-bold text-lg">${selectedOrder.total.toLocaleString()}</p>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="py-4 space-y-4">
          {user.addresses
            .filter((address) => address.id === selectedOrder.addressId)
            .map((address) => (
              <div key={address.id}>
                <p className="font-semibold text-gray-900 mb-1">
                  {address.name} ({address.phone}) <span className="text-gray-400 font-normal">{address.type}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {address.street}, {address.city}, {address.state}
                </p>
              </div>
            ))}
        </div>

        {/* Order Items */}
        <div className="border-t border-b border-gray-100 py-4 space-y-4">
          {selectedOrder.items.map((item, index) => (
            <OrderItemCard key={index} item={item} />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          {selectedOrder.status === 'delivered' && !selectedOrder.reviewed && <ActionButton icon={FaStar} label="Write Review" colorClasses="gray" />}

          {selectedOrder.status === 'processing' && <ActionButton icon={FaTimesCircle} label="Cancel Order" colorClasses="red" />}

          {(selectedOrder.status === 'cancelled' || selectedOrder.status === 'delivered') && (
            <ActionButton icon={FaRedo} label="Buy Back" colorClasses="green" />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
