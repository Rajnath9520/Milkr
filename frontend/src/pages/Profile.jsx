import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Camera } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Admin',
    email: user?.email || 'admin@milkr.com',
    phone: '9876543210',
    address: '123 Main Street, Raipur',
    role: user?.role || 'admin'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
        <p className="text-gray-600 mt-1">Manage your account information</p>
      </div>

      {/* Profile Header */}
      <Card>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <Avatar name={formData.name} size="xl" />
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-all">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-800">{formData.name}</h3>
            <p className="text-gray-600">{formData.email}</p>
            <span className="inline-block mt-2 px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              {formData.role.toUpperCase()}
            </span>
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <Card title="Personal Information">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="name"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              icon={Phone}
              value={formData.phone}
              onChange={handleChange}
            />
            <Input
              label="Role"
              name="role"
              value={formData.role}
              disabled
            />
          </div>

          <Input
            label="Address"
            name="address"
            icon={MapPin}
            value={formData.address}
            onChange={handleChange}
          />

          <div className="flex justify-end">
            <Button type="submit" variant="primary" icon={Save}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Change Password */}
      <Card title="Change Password">
        <form className="space-y-6">
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            placeholder="Enter current password"
          />
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="Enter new password"
          />
          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
          />
          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;