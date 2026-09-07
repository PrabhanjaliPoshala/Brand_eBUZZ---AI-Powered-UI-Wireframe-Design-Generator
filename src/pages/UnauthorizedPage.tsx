import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { store } from '../services/store';

export const UnauthorizedPage: React.FC = () => {
  const currentUser = store.getCurrentUser();

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 text-center font-sans">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <span className="text-3xl font-extrabold text-zinc-900 block">Access Restricted</span>
        <h1 className="text-base font-bold text-zinc-800">Admin Privileges Required</h1>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Your current profile (<strong>{currentUser.email}</strong>, role: <code>{currentUser.role}</code>) does not have authorization to view this administrative view.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center justify-center gap-2 transition"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin"
            className="w-full sm:w-auto px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Switch to Admin Session</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
