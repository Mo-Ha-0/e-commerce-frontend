import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import LoadingSpinner from '../ui/LoadingSpinner';

interface Props {
    requiredRole?: UserRole;
}

export default function ProtectedRoute({ requiredRole }: Props) {
    const { user, isLoading } = useAuth();

    if (isLoading) return <LoadingSpinner />;

    if (!user) return <Navigate to="/login" replace />;

    if (
        requiredRole &&
        user.role !== requiredRole &&
        user.role !== UserRole.SuperAdmin
    ) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
