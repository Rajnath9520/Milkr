// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Milk, Bell, Settings, LogOut, Menu, X, Sun, Moon, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../common/Avatar';
import ApiHealth from '../common/ApiHealth';

const Navbar = ({ onMenuToggle, currentPage, menuItems, onNavigate }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    onMenuToggle?.(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg shadow-lg">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4 group cursor-pointer">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  <Milk className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                  Milkr
                </h1>
                <p className="text-xs text-gray-500 font-medium">Fresh & Pure</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2 bg-gray-50 rounded-2xl p-2">
              {menuItems?.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate?.(item.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <ApiHealth />
              <button className="relative p-3 rounded-xl hover:bg-blue-50 transition-all duration-300 group">
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-500 transition-colors" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={() => onNavigate?.('settings')}
                className="p-3 rounded-xl hover:bg-blue-50 transition-all duration-300"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              
              <button 
                onClick={() => toggleTheme()}
                className="p-3 rounded-xl hover:bg-blue-50 transition-all duration-300"
                title={isDark ? 'Switch to light' : 'Switch to dark'}
              >
                {isDark ? 
                  <Sun className="w-5 h-5 text-gray-600" /> : 
                  <Moon className="w-5 h-5 text-gray-600" />
                }
              </button>

              <div className="w-px h-8 bg-gray-300"></div>

              <div className="flex items-center space-x-3">
                <Avatar name={user?.name || 'User'} size="md" onClick={() => onNavigate?.('profile')} />
                <div className="hidden lg:block">
                  <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </div>

              <button 
                onClick={logout}
                className="p-3 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-300"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-3 rounded-xl hover:bg-blue-50 transition-all"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? 
                <X className="w-6 h-6" /> : 
                <Menu className="w-6 h-6" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-2xl animate-slide-down">
            <div className="px-4 py-4 space-y-2">
              {menuItems?.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate?.(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    onNavigate?.('profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate?.('settings');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;