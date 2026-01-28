import { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { customerAPI } from '../../../api/customerAPI';

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });

  useEffect(() => {
    fetchCustomers(pagination.page);
  }, []);

  const fetchCustomers = async (page = 0) => {
    try {
      setLoading(true);
      const response = await customerAPI.getCustomers(page, pagination.size);
      const data = response.data.data;
      
      setUsers(data.content);
      setPagination({
        page: data.number || 0,
        size: data.size || 10,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setUsers([]);
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      try {
        await customerAPI.deleteCustomer(userId);
        alert('User deleted successfully!');
        
        // Refresh lại danh sách
        fetchCustomers(pagination.page);
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage user accounts and permissions
          </p>
        </div>
        <Link
          to="/admin/users/add"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          <FaPlus size={14} />
          Add User
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex">
          <div className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-sm text-gray-500">Loading users...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-sm text-gray-500">No users found</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-600">
                    Name
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-600">
                    Email
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium text-sm">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-medium text-sm text-gray-900">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">{user.email}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/admin/users/edit/${user.id}`}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <FaEdit size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <FaTrash size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {pagination.page * pagination.size + 1} to {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} users
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => fetchCustomers(pagination.page - 1)}
            className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={pagination.page === 0 || loading}
          >
            Previous
          </button>
          <span className="px-3 py-1.5 flex items-center text-sm text-gray-600">
            Page {pagination.page + 1} of {Math.max(pagination.totalPages, 1)}
          </span>
          <button
            onClick={() => fetchCustomers(pagination.page + 1)}
            className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={pagination.page >= pagination.totalPages - 1 || loading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;