import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const AdminRoute = () => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!user.roles || !user.roles.includes('ADMIN')) {
        // User is logged in but not an admin
        // Redirect to home or show 403 page
        return <Navigate to="/" replace />;
        // OR: return <div className="text-center mt-10">403 - Forbidden</div>;
    }

    return <Outlet />;
};

export default AdminRoute;
