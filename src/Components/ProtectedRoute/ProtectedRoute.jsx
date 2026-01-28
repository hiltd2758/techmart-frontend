// src/Components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../../utils/auth';

const ProtectedRoute = ({ children, requiredRole }) => {
    // Check authentication
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // Check role if required
    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;