import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  role?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Restoring your session...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={`/login?role=${role || 'farmer'}`} replace state={{ from: location.pathname }} />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to={`/${currentUser.role}/dashboard`} replace />;
  }

  return <Outlet />;
};
