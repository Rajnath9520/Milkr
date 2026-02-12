import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  const goHome = () => {
    window.location.href = '/';
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            404
          </h1>
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h2>
            <p className="text-gray-600 text-lg">
              Oops! The page you're looking for doesn't exist.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            icon={Home}
            onClick={goHome}
          >
            Go Home
          </Button>
          <Button
            variant="secondary"
            icon={ArrowLeft}
            onClick={goBack}
          >
            Go Back
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="mt-16 opacity-50">
          <svg
            className="w-64 h-64 mx-auto"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFound;