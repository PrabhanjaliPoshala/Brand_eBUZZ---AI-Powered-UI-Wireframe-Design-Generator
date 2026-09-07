import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 text-center font-sans">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>
        <span className="text-4xl font-extrabold text-zinc-900 block">404</span>
        <h1 className="text-lg font-bold text-zinc-800">Page Not Found</h1>
        <p className="text-xs text-zinc-500 leading-relaxed">
          The requested wireframe screen, canvas, or resource does not exist or has been moved.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center justify-center gap-2 transition"
          >
            <Home className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Link>
          <Link
            to="/projects"
            className="w-full sm:w-auto px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View All Projects</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
