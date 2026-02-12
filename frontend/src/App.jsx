import React, { useState } from 'react';
import { Home, Users, Package, CreditCard, BarChart3 } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useToast } from './hooks/useToast';
import DashboardLayout from './components/Layout/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Delivery from './pages/Delivery';
import Billing from './pages/Billing';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Loader from './components/common/Loader';
import { Toast } from './components/common/Toast';
import { useCustomers } from './context/CustomerContext';

const App = () => {
  const { user, loading, login, logout } = useAuth();
  const { toasts, removeToast } = useToast();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { customers, loading: customersLoading, addCustomer, updateCustomer, deleteCustomer, fetchCustomers } = useCustomers();
  const [openCustomerForm, setOpenCustomerForm] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'customers', icon: Users, label: 'Customers' },
    { id: 'delivery', icon: Package, label: 'Delivery' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  ];

  if (loading) {
    return <Loader fullScreen text="Loading Milkr..." />;
  }

  if (!user) {
    // If user is not logged in and the path is /register, show the register page
    if (typeof window !== 'undefined' && window.location.pathname === '/register') {
      return <Register />;
    }
    return <Login onLogin={login} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard customers={customers} onQuickAction={(action) => {
          if (action === 'add-customer') {
            // Only allow if user is admin/manager
            if (user?.role === 'admin' || user?.role === 'manager') {
              setCurrentPage('customers');
              // open modal when Customers mounts
              setOpenCustomerForm(true);
            }
          } else if (action === 'new-delivery') {
            setCurrentPage('delivery');
          } else if (action === 'record-payment') {
            setCurrentPage('billing');
          } else if (action === 'view-analytics') {
            setCurrentPage('analytics');
          }
        }} />;
      case 'customers':
        // Normalize customers so UI components can rely on `id` field
        const normalized = (customers || []).map(c => ({ ...c, id: c.id || c._id }));
        const handleAdd = async (data) => {
          await addCustomer(data);
        };
        const handleEdit = async (id, data) => {
          // id may be `_id` or `id`
          await updateCustomer(id, data);
        };
        const handleDelete = async (id) => {
          await deleteCustomer(id);
        };
        const handleToggleStatus = async (id) => {
          const c = (customers || []).find(x => x._id === id || x.id === id);
          if (!c) return;
          const newStatus = c.status === 'Active' ? 'Inactive' : 'Active';
          await updateCustomer(id, { status: newStatus });
        };

        return (
          <Customers
            customers={normalized}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            openOnMount={openCustomerForm}
            onFormClose={() => setOpenCustomerForm(false)}
          />
        );
      case 'delivery':
        return <Delivery customers={customers} />;
      case 'billing':
        return <Billing customers={customers} />;
      case 'analytics':
        return <Analytics customers={customers} />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard customers={customers} />;
    }
  };

  return (
    <>
      <DashboardLayout
        currentPage={currentPage}
        menuItems={menuItems}
        onNavigate={setCurrentPage}
      >
        {renderPage()}
      </DashboardLayout>

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </>
  );
};

export default App;
