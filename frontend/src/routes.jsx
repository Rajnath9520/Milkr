import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Delivery from './pages/Delivery';
import Billing from './pages/Billing';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';


const AppRoutes = () => {
const { user, loading } = useAuth();


if (loading) return null;


return (
<BrowserRouter>
<Routes>
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
<Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
<Route path="/customers" element={user ? <Customers /> : <Navigate to="/login" replace />} />
<Route path="/delivery" element={user ? <Delivery /> : <Navigate to="/login" replace />} />
<Route path="/billing" element={user ? <Billing /> : <Navigate to="/login" replace />} />
<Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/login" replace />} />
<Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
<Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" replace />} />
<Route path="*" element={<NotFound />} />
</Routes>
</BrowserRouter>
);
};


export default AppRoutes;