import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-xl font-bold">
          <span className="text-2xl text-purple-500">✓</span>
          <span>TaskMaster</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="text-gray-300 hover:text-white transition-colors">
              Profile
            </Link>
            {user.isAdmin && (
              <Link
                to="/admin"
                className="text-gray-300 hover:text-white transition-colors">
                Admin
              </Link>
            )}
            <div className="border-l border-gray-700 h-6 mx-2"></div>
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 text-gray-300 hover:text-white"
              >
                <span>👤</span>
                <span>{user.name}</span>
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                    <div className="flex items-center gap-2">
                      <span>⚙️</span>
                      <span>Profile</span>
                    </div>
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      <div className="flex items-center gap-2">
                        <span>👥</span>
                        <span>Admin Dashboard</span>
                      </div>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                    <div className="flex items-center gap-2">
                      <span>↪️</span>
                      <span>Logout</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
