// scripts/seed.js - Seed sample user and customers
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Customer = require('../models/Customer');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/milkr';

async function connectDb() {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function seed() {
  try {
    await connectDb();
    console.log('Connected to DB');

    // Ensure a user exists (delivery role) - change email if you want a different user
    const userEmail = 'delivery1@example.com';
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = new User({
        username: 'delivery1',
        email: userEmail,
        password: 'password123',
        role: 'delivery',
        fullName: 'Delivery One',
        phone: '9876543210',
        assignedAreas: ['Area A', 'Area B']
      });
      await user.save();
      console.log('Created user:', user.email);
    } else {
      console.log('User already exists:', user.email);
    }

    // Create some customers assigned to this user
    const customersData = [
      {
        name: 'Ravi Kumar',
        address: '12 Oak Street, Area A',
        location: { lat: 28.7041, lng: 77.1025 },
        milkPerDay: 1,
        phone: '9123456789',
        area: 'Area A',
        assignedTo: user._id,
      },
      {
        name: 'Sita Sharma',
        address: '34 Pine Lane, Area B',
        location: { lat: 28.7060, lng: 77.1010 },
        milkPerDay: 2,
        phone: '9234567890',
        area: 'Area B',
        assignedTo: user._id,
      },
      {
        name: 'Aman Verma',
        address: '56 Cedar Road, Area A',
        location: { lat: 28.7050, lng: 77.1030 },
        milkPerDay: 1.5,
        phone: '9345678901',
        area: 'Area A',
        assignedTo: user._id,
      }
    ];

    for (const c of customersData) {
      // avoid duplicates by phone
      const exists = await Customer.findOne({ phone: c.phone });
      if (!exists) {
        const cust = new Customer(c);
        await cust.save();
        console.log('Created customer:', cust.name);
      } else {
        console.log('Customer exists, skipping:', exists.name);
      }
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
}

seed();
