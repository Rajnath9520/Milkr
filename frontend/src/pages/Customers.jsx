import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import CustomerCard from '../components/customers/CustomerCard';
import CustomerTable from '../components/customers/CustomerTable';
import CustomerForm from '../components/customers/CustomerForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';

const Customers = ({ customers = [], onAdd, onEdit, onDelete, onToggleStatus, openOnMount = false, onFormClose }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  // Check if user can create customers (admin/manager only)
  const canCreateCustomer = user?.role === 'admin' || user?.role === 'manager';
  
  // Check if user can delete customers (admin/manager only)
  const canDeleteCustomer = user?.role === 'admin' || user?.role === 'manager';

  // Open add form when mounted if requested by parent (e.g., Quick Action)
  React.useEffect(() => {
    if (openOnMount) {
      setSelectedCustomer(null);
      setShowForm(true);
    }
  }, [openOnMount]);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (data) => {
    if (selectedCustomer) {
      onEdit?.(selectedCustomer.id, data);
    } else {
      onAdd?.(data);
    }
    setShowForm(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Customers</h2>
          <p className="text-gray-600 mt-1">Manage your customer database</p>
        </div>
        {canCreateCustomer && (
          <Button
            onClick={() => {
              setSelectedCustomer(null);
              setShowForm(true);
            }}
            variant="primary"
            icon={Plus}
          >
            Add Customer
          </Button>
        )}
      </div>

      {/* Search & View Toggle */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          icon={Search}
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'cards' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('cards')}
          >
            Cards
          </Button>
          <Button
            variant={viewMode === 'table' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('table')}
          >
            Table
          </Button>
        </div>
      </div>

      {/* Customer Display */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer, index) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onEdit={(c) => {
                setSelectedCustomer(c);
                setShowForm(true);
              }}
            />
          ))}
        </div>
      ) : (
        <CustomerTable
          customers={filteredCustomers}
          onEdit={(c) => {
            setSelectedCustomer(c);
            setShowForm(true);
          }}
          onDelete={canDeleteCustomer ? onDelete : null}
          onToggleStatus={onToggleStatus}
        />
      )}

      {/* Add/Edit Modal */}
      {canCreateCustomer && (
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedCustomer(null);
            onFormClose?.();
          }}
          title={selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
        >
          <CustomerForm
            customer={selectedCustomer}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedCustomer(null);
              onFormClose?.();
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default Customers;