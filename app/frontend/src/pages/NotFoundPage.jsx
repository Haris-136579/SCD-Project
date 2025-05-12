import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-900">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <span className="text-6xl text-purple-500">⚠️</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn-primary py-3 px-6 inline-block">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
