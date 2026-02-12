// models/MilkRecord.js
const mongoose = require('mongoose');

const milkRecordSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer ID is required']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  litres: {
    type: Number,
    required: [true, 'Litres delivered is required'],
    min: [0, 'Litres cannot be negative']
  },
  status: {
    type: String,
    enum: ['Delivered', 'Pending', 'Cancelled', 'Skipped'],
    default: 'Pending'
  },
  deliveredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deliveryTime: {
    type: Date
  },
  pricePerLitre: {
    type: Number,
    required: true,
    default: 60
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Partial'],
    default: 'Pending'
  },
  notes: {
    type: String,
    default: ''
  },
  signature: {
    type: String, // Base64 encoded signature image
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
milkRecordSchema.index({ customerId: 1, date: -1 });
milkRecordSchema.index({ status: 1, date: -1 });
milkRecordSchema.index({ deliveredBy: 1, date: -1 });

// Pre-save middleware to calculate total amount
milkRecordSchema.pre('save', function(next) {
  this.totalAmount = this.litres * this.pricePerLitre;
  next();
});

// Static method to get delivery summary for a date range
milkRecordSchema.statics.getDeliverySummary = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        status: 'Delivered'
      }
    },
    {
      $group: {
        _id: null,
        totalLitres: { $sum: '$litres' },
        totalAmount: { $sum: '$totalAmount' },
        totalDeliveries: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('MilkRecord', milkRecordSchema);