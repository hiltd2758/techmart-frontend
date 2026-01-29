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
    <div className="min-h-screen bg-neutral-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-end justify-between pb-6 border-b border-neutral-200">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-neutral-900">Users</h1>
            <p className="text-neutral-500 mt-1 text-sm font-mono">Manage accounts & permissions</p>
          </div>
          <Link
            to="/admin/users/add"
            className="h-9 px-4 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-2"
          >
            <FaPlus size={12} />
            Add User
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white border border-neutral-200 p-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={13} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-neutral-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 px-6 text-center text-sm text-neutral-500">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-6 text-xs font-mono uppercase tracking-wider text-neutral-500">Name</th>
                    <th className="text-left py-3 px-6 text-xs font-mono uppercase tracking-wider text-neutral-500">Email</th>
                    <th className="text-left py-3 px-6 text-xs font-mono uppercase tracking-wider text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center text-white font-light text-xs">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-sm font-light text-neutral-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-neutral-600 font-mono">{user.email}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/users/edit/${user.id}`}
                            className="p-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
                            title="Edit"
                          >
                            <FaEdit size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(user.id, user.name)}
                            className="p-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
                            title="Delete"
                          >
                            <FaTrash size={14} />
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
        <div className="flex items-center justify-between text-xs">
          <p className="text-neutral-600 font-mono">
            Showing {pagination.page * pagination.size + 1} to {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => fetchCustomers(pagination.page - 1)}
              disabled={pagination.page === 0 || loading}
              className="px-3 py-1.5 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono uppercase tracking-wider"
            >
              Prev
            </button>
            <span className="px-3 py-1.5 font-mono text-neutral-600">
              {pagination.page + 1} / {Math.max(pagination.totalPages, 1)}
            </span>
            <button
              onClick={() => fetchCustomers(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages - 1 || loading}
              className="px-3 py-1.5 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono uppercase tracking-wider"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;