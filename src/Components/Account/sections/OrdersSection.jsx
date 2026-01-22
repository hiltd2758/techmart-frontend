import React, { useState } from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import OrderCard from '../orders/OrderCard';
import OrderDetailsModal from '../orders/OrderDetailsModal';

const OrdersSection = ({ orders, user }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl text-gray-900 font-poppins font-bold">My Orders</h2>
          <p className="text-gray-500 mt-1">Track and manage your orders</p>
        </div>
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold">
          {orders.length} Total Orders
        </div>
      </div>

      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onViewDetails={setSelectedOrder} />
      ))}

      <OrderDetailsModal selectedOrder={selectedOrder} user={user} onClose={() => setSelectedOrder(null)} />
    </div>
  );
};

export default OrdersSection;
