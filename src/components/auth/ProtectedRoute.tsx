import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { store } from '../../services/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const isAuthenticated = store.isAuthenticated();
  const isAdmin = store.isAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-zinc-200 p-8 text-center">
          <div className="w-14 h-14 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            !
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Admin Access Required</h2>
          <p className="text-sm text-zinc-600 mb-6">
            The requested section is restricted to administrative personnel. Your current role is{' '}
            <span className="font-semibold text-zinc-800 uppercase text-xs px-2 py-0.5 bg-zinc-100 rounded">
              {store.getCurrentUser()?.role || 'user'}
            </span>
            .
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                store.login('poshalaprabhanjali@gmail.com');
                window.location.reload();
              }}
              className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold rounded-xl transition"
            >
              Switch to Demo Admin Account
            </button>
            <a
              href="/dashboard"
              className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-medium rounded-xl transition block text-center"
            >
              Return to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
