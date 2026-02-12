import React, { useState } from 'react';
import { User, Lock, ChevronRight } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        icon={User}
        iconPosition="right"
        placeholder="admin@milkr.com"
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        icon={Lock}
        iconPosition="right"
        placeholder="••••••••"
        required
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input 
            type="checkbox" 
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500" 
          />
          <span className="text-sm text-gray-600">Remember me</span>
        </label>
        <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          Forgot Password?
        </a>
      </div>

      <Button
        type="submit"
        variant="primary"
        icon={ChevronRight}
        iconPosition="right"
        loading={loading}
        fullWidth
        size="lg"
      >
        Sign In
      </Button>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">
          Demo: admin@milkr.com / any password
        </p>
      </div>
    </form>
  );
};

export default LoginForm;