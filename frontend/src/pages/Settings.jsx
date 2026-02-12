import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, Database, Palette, Globe } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    autoBackup: true,
    dataRetention: '90',
    language: 'en',
    currency: 'INR',
    pricePerLitre: '60'
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-600 mt-1">Configure your application preferences</p>
      </div>

      {/* Notifications */}
      <Card title="Notifications" subtitle="Manage how you receive notifications">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800">SMS Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via SMS</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={() => handleToggle('smsNotifications')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card title="Appearance" subtitle="Customize the look and feel">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center space-x-3">
              <Palette className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-semibold text-gray-800">Dark Mode</p>
                <p className="text-sm text-gray-500">Toggle dark theme</p>
              </div>
            </div>
            <Button
              variant={theme === 'dark' ? 'primary' : 'secondary'}
              onClick={toggleTheme}
              size="sm"
            >
              {theme === 'dark' ? 'Dark' : 'Light'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Data & Security */}
      <Card title="Data & Security" subtitle="Manage your data and security settings">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-gray-800">Auto Backup</p>
                <p className="text-sm text-gray-500">Automatically backup your data</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={() => handleToggle('autoBackup')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Business Settings */}
      <Card title="Business Settings" subtitle="Configure business-related settings">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Default Price per Litre
              </label>
              <input
                type="number"
                name="pricePerLitre"
                value={settings.pricePerLitre}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Currency
              </label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="primary" icon={SettingsIcon}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;