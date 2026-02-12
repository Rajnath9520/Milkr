import React, { useState } from 'react';
import { Milk, Droplet } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data) => {
    setLoading(true);
    setTimeout(() => {
      onLogin?.(data);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-bounce-slow"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl animate-bounce-slow" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Branding */}
        <div className="hidden md:flex flex-col items-center justify-center space-y-8 animate-fade-in">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center transform rotate-6 shadow-2xl">
              <Milk className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Droplet className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-4">
              Milkr
            </h1>
            <p className="text-xl text-gray-600 font-medium">Fresh Milk, Delivered Daily</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 animate-scale-in">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
            <p className="text-gray-600">Sign in to continue to your dashboard</p>
          </div>
          <LoginForm onSubmit={handleLogin} loading={loading} />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="font-bold text-blue-600 hover:text-blue-700">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;