import React from 'react';
import { FaMapMarkerAlt, FaCheckCircle, FaEdit, FaTrash } from 'react-icons/fa';
import ActionButton from '../common/ActionButton';

const AddressCard = ({ address, onSetDefault, onEdit, onDelete }) => (
  <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 relative hover:shadow-xl hover:border-gray-200 transition-all duration-300 group">
    {address.isDefault && (
      <span className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
        Default
      </span>
    )}
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <FaMapMarkerAlt className="text-2xl text-blue-600" />
        </div>
        <div>
          <h3 className="font-poppins font-bold text-xl text-gray-900 mb-1">{address.type}</h3>
          <p className="text-gray-600 font-semibold">{address.name}</p>
        </div>
      </div>
    </div>
    <div className="space-y-2 text-sm text-gray-600 mb-6 pl-1">
      <p className="flex items-start gap-2">
        <span className="font-semibold text-gray-500 min-w-[60px]">Street:</span> <span className="font-medium">{address.street}</span>
      </p>
      <p className="flex items-start gap-2">
        <span className="font-semibold text-gray-500 min-w-[60px]">City:</span>{' '}
        <span className="font-medium">
          {address.city}, {address.state}
        </span>
      </p>
      <p className="flex items-start gap-2">
        <span className="font-semibold text-gray-500 min-w-[60px]">Phone:</span> <span className="font-medium">{address.phone}</span>
      </p>
    </div>
    <div className="flex gap-3 pt-4 border-t-2 border-gray-100 flex-wrap">
      {!address.isDefault && (
        <ActionButton icon={FaCheckCircle} label="Set Default" colorClasses="green" onClick={() => onSetDefault?.(address.id)} />
      )}
      <ActionButton icon={FaEdit} label="Edit" colorClasses="gray" onClick={() => onEdit?.(address.id)} />
      <ActionButton icon={FaTrash} label="Delete" colorClasses="red" onClick={() => onDelete?.(address.id)} />
    </div>
  </div>
);

export default AddressCard;
