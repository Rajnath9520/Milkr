import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const DashboardLayout = ({ children, currentPage, menuItems, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar 
        currentPage={currentPage}
        menuItems={menuItems}
        onNavigate={onNavigate}
      />
      
      <main className="w-full max-w-screen-2xl mx-auto px-8 lg:px-20 py-8 mt-20">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default DashboardLayout;