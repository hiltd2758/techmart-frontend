import React from 'react';
import { FaPlus } from 'react-icons/fa';
import AddressCard from '../addresses/AddressCard';

const AddressesSection = ({ addresses, onAddAddress, onEditAddress, onDeleteAddress, onSetDefault }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl text-gray-900 font-poppins font-bold">Shipping Addresses</h2>
          <p className="text-gray-500 mt-1">Manage your delivery locations</p>
        </div>
        <button
          onClick={onAddAddress}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-poppins font-semibold rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
        >
          <FaPlus />
          Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} onSetDefault={onSetDefault} onEdit={onEditAddress} onDelete={onDeleteAddress} />
        ))}
      </div>
    </div>
  );
};

export default AddressesSection;
