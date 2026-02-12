// models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  location: {
    lat: {
      type: Number,
      // optional now: may be absent if user only provides address
      min: -90,
      max: 90
    },
    lng: {
      type: Number,
      // optional now
      min: -180,
      max: 180
    }
  },
  milkPerDay: {
    type: Number,
    required: [true, 'Daily milk requirement is required'],
    min: [0.5, 'Minimum milk per day is 0.5 litres'],
    default: 1
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: 'Please enter a valid 10-digit Indian phone number'
    }
  },
  area: {
    type: String,
    required: [true, 'Area/Locality is required'],
    trim: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
  },
  pricePerLitre: {
    type: Number,
    default: 60
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
customerSchema.index({ area: 1, status: 1 });
customerSchema.index({ phone: 1 });
customerSchema.index({ createdBy: 1 }); // Index for user isolation
// location may be optional; index presence-aware fields
customerSchema.index({ 'location.lat': 1 });
customerSchema.index({ 'location.lng': 1 });

// Virtual for monthly bill calculation
customerSchema.virtual('monthlyBill').get(function() {
  return this.milkPerDay * 30 * this.pricePerLitre;
});

// Ensure virtuals are included in JSON
customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Customer', customerSchema);