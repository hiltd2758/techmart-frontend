import React from 'react';

const OrderItemCard = ({ item }) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-4 flex-1">
      <div className="w-16 h-16 bg-white rounded-lg border-2 border-gray-100 p-2 flex-shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-900 font-semibold truncate">{item.name}</p>
        <p className="text-sm text-gray-500">x{item.quantity}</p>
      </div>
    </div>
    <span className="text-lg font-bold text-gray-900 whitespace-nowrap">${item.price}</span>
  </div>
);

export default OrderItemCard;
