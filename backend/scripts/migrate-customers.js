// Migration script to add createdBy field to existing customers
// Run this once after deploying the new schema

const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const User = require('../models/User');
require('dotenv').config();

const migrateCustomers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/milkr');
    console.log('Connected to MongoDB');

    // Get the first admin user to assign as creator for existing customers
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('No admin user found. Creating a default admin...');
      // Create a default admin user
      const bcrypt = require('bcryptjs');
      const defaultAdmin = new User({
        username: 'admin',
        email: 'admin@milkr.com',
        password: 'admin123', // This will be hashed by the pre-save hook
        role: 'admin',
        fullName: 'System Administrator',
        phone: '9999999999'
      });
      await defaultAdmin.save();
      console.log('Default admin created');
      
      // Update all customers to be created by this admin
      const result = await Customer.updateMany(
        { createdBy: { $exists: false } },
        { $set: { createdBy: defaultAdmin._id } }
      );
      console.log(`Updated ${result.modifiedCount} customers with createdBy field`);
    } else {
      // Update all customers to be created by the first admin
      const result = await Customer.updateMany(
        { createdBy: { $exists: false } },
        { $set: { createdBy: adminUser._id } }
      );
      console.log(`Updated ${result.modifiedCount} customers with createdBy field`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrateCustomers();
}

module.exports = migrateCustomers;
