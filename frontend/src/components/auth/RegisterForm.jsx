import React, { useState } from 'react';
import { User, Mail, Lock, Phone, ChevronRight } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

const RegisterForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    role: 'delivery'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit?.(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          icon={User}
          placeholder="John Doe"
          error={errors.fullName}
          required
        />
        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          icon={User}
          placeholder="johndoe"
          error={errors.username}
          required
        />
      </div>

      <Input
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        icon={Mail}
        placeholder="john@example.com"
        error={errors.email}
        required
      />

      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        icon={Phone}
        placeholder="9876543210"
        error={errors.phone}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          icon={Lock}
          placeholder="••••••••"
          error={errors.password}
          required
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={Lock}
          placeholder="••••••••"
          error={errors.confirmPassword}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
        >
          <option value="delivery">Delivery Staff</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
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
        Create Account
      </Button>

      <div className="text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-bold text-blue-600 hover:text-blue-700">
            Sign In
          </a>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;