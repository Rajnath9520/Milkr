import React, { useState, useEffect } from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import authService from '../services/authService';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // quick runtime sanity check so blank pages surface a message instead
    try {
      if (!RegisterForm) throw new Error('RegisterForm component not found');
      // also ensure authService exists
      if (!authService) throw new Error('authService not available');
      console.log('Register page mounted');
    } catch (err) {
      console.error('Register mount error:', err);
      setError(err.message || 'Unknown error');
    }
  }, []);

  const handleRegister = async (data) => {
    setLoading(true);
    try {
  await authService.register(data);
  // After successful registration, navigate to login (use full redirect so it works outside Router)
  window.location.href = '/login';
    } catch (err) {
      console.error('Registration failed', err);
      setError(err?.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-slate-50 rounded-2xl shadow-2xl p-8 border border-gray-200">
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">Register page mounted — debug banner</div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Create an account</h2>

        {error ? (
          <div className="p-6 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            <strong>Error loading registration form:</strong>
            <div className="mt-2">{error}</div>
            <div className="mt-3 text-sm text-gray-600">Open browser console for more details.</div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6">
            <RegisterForm onSubmit={handleRegister} loading={loading} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
