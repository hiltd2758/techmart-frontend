import React, { useState } from 'react';
import HomeNavbar from '../../Components/HomeNavbar/HomeNavbar';
import Footer from '../../Components/Footer/Footer.jsx';
import Sidebar from '../../Components/Account/Sidebar';
import OrdersSection from '../../Components/Account/sections/OrdersSection';
import PersonalInfoSection from '../../Components/Account/sections/PersonalInfoSection';
import AddressesSection from '../../Components/Account/sections/AddressesSection';

const Account = () => {
  const [activeTab, setActiveTab] = useState('orders');

  // Sample user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    joinDate: 'January 2024',
    addresses: [
      {
        id: 1,
        type: 'Home',
        name: 'John Doe',
        street: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        phone: '+1 234 567 8900',
        isDefault: true,
      },
      {
        id: 2,
        type: 'Office',
        name: 'John Doe',
        street: '456 Business Ave',
        city: 'Palo Alto',
        state: 'CA',
        phone: '+1 234 567 8900',
        isDefault: false,
      },
    ],
  };

  // Sample orders data
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 5499,
      reviewed: false,
      addressId: 1,
      items: [{ name: 'MacBook Pro 16" M3 Max', quantity: 1, price: 5499, image: '/arrivals/arrival_1.jpg' }],
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      status: 'processing',
      total: 1299,
      reviewed: false,
      addressId: 1,
      items: [{ name: 'iPhone 15 Pro', quantity: 1, price: 1299, image: '/arrivals/arrival_3.png' }],
    },
    {
      id: 'ORD-003',
      date: '2024-01-22',
      status: 'shipped',
      total: 749,
      reviewed: false,
      addressId: 2,
      items: [{ name: 'AirPods Pro Gen 2', quantity: 3, price: 249, image: '/arrivals/arrival_4.jpg' }],
    },
    {
      id: 'ORD-4',
      date: '2024-01-25',
      status: 'cancelled',
      total: 749,
      reviewed: false,
      addressId: 2,
      items: [{ name: 'AirPods Pro Gen 2', quantity: 3, price: 249, image: '/arrivals/arrival_4.jpg' }],
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrdersSection orders={orders} user={user} />;
      case 'personal':
        return <PersonalInfoSection user={user} orders={orders} />;
      case 'addresses':
        return (
          <AddressesSection
            addresses={user.addresses}
            onAddAddress={() => console.log('Add address')}
            onEditAddress={(id) => console.log('Edit address', id)}
            onDeleteAddress={(id) => console.log('Delete address', id)}
            onSetDefault={(id) => console.log('Set default', id)}
          />
        );
      default:
        return <OrdersSection orders={orders} user={user} />;
    }
  };

  return (
    <>
      <HomeNavbar />
      <div className="w-full bg-gradient-to-b from-gray-50 to-white pt-[70px] pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-3">
              <Sidebar user={user} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">{renderContent()}</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Account;
