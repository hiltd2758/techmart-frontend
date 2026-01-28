// src/utils/auth.js

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    return !!(token && refreshToken);
};

// Get current user from localStorage
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Get customer profile (if exists)
export const getCustomerProfile = () => {
    const profileStr = localStorage.getItem('customerProfile');
    return profileStr ? JSON.parse(profileStr) : null;
};

// Check if user has specific role
export const hasRole = (role) => {
    const user = getCurrentUser();
    return user?.roles?.includes(role) || false;
};

// Check if user is admin
export const isAdmin = () => {
    return hasRole('ROLE_ADMIN');
};

// Logout function
export const logout = async () => {
    try {
        const { authAPI } = await import('../api/customerAPI');
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            await authAPI.logout();
        }
    } catch (error) {
        console.error("Logout error:", error);
    } finally {
        localStorage.clear();
        window.location.href = '/login';
    }
};