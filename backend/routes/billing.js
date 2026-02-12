// routes/billing.js
const express = require('express');
const router = express.Router();
const MilkRecord = require('../models/MilkRecord');
const Customer = require('../models/Customer');
const { authenticate, isAdminOrManager } = require('../middleware/auth');

// @route   GET /api/billing/monthly/:year/:month
// @desc    Get monthly billing for all customers
// @access  Private
router.get('/monthly/:year/:month', authenticate, async (req, res) => {
  try {
    const { year, month } = req.params;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const bills = await MilkRecord.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          status: 'Delivered'
        }
      },
      {
        $group: {
          _id: '$customerId',
          totalLitres: { $sum: '$litres' },
          totalAmount: { $sum: '$totalAmount' },
          deliveryCount: { $sum: 1 },
          records: { $push: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
        }
      },
      {
        $unwind: '$customer'
      },
      {
        $project: {
          customerId: '$_id',
          customerName: '$customer.name',
          customerPhone: '$customer.phone',
          customerArea: '$customer.area',
          totalLitres: 1,
          totalAmount: 1,
          deliveryCount: 1,
          pricePerLitre: '$customer.pricePerLitre'
        }
      },
      {
        $sort: { customerName: 1 }
      }
    ]);

    const summary = {
      totalCustomers: bills.length,
      totalLitres: bills.reduce((sum, b) => sum + b.totalLitres, 0),
      totalRevenue: bills.reduce((sum, b) => sum + b.totalAmount, 0),
      totalDeliveries: bills.reduce((sum, b) => sum + b.deliveryCount, 0)
    };

    res.json({ bills, summary, period: { year, month } });
  } catch (error) {
    console.error('Monthly billing error:', error);
    res.status(500).json({ error: 'Failed to generate monthly billing' });
  }
});

// @route   GET /api/billing/customer/:customerId
// @desc    Get billing for specific customer
// @access  Private
router.get('/customer/:customerId', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateQuery = {};
    if (startDate || endDate) {
      dateQuery.date = {};
      if (startDate) dateQuery.date.$gte = new Date(startDate);
      if (endDate) dateQuery.date.$lte = new Date(endDate);
    }

    const records = await MilkRecord.find({
      customerId: req.params.customerId,
      status: 'Delivered',
      ...dateQuery
    }).sort({ date: -1 });

    const customer = await Customer.findById(req.params.customerId);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const billing = {
      customer: {
        id: customer._id,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        area: customer.area,
        pricePerLitre: customer.pricePerLitre
      },
      records,
      summary: {
        totalLitres: records.reduce((sum, r) => sum + r.litres, 0),
        totalAmount: records.reduce((sum, r) => sum + r.totalAmount, 0),
        totalDeliveries: records.length,
        paidAmount: records.filter(r => r.paymentStatus === 'Paid')
          .reduce((sum, r) => sum + r.totalAmount, 0),
        pendingAmount: records.filter(r => r.paymentStatus === 'Pending')
          .reduce((sum, r) => sum + r.totalAmount, 0)
      }
    };

    res.json(billing);
  } catch (error) {
    console.error('Customer billing error:', error);
    res.status(500).json({ error: 'Failed to fetch customer billing' });
  }
});

// @route   POST /api/billing/customer/:customerId/payment
// @desc    Record payment for customer
// @access  Private
router.post('/customer/:customerId/payment', authenticate, async (req, res) => {
  try {
    const { amount, paymentMethod, recordIds, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required' });
    }

    const customer = await Customer.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Update payment status for specified records
    let updatedRecords = [];
    if (recordIds && recordIds.length > 0) {
      await MilkRecord.updateMany(
        { _id: { $in: recordIds }, customerId: req.params.customerId },
        { $set: { paymentStatus: 'Paid' } }
      );
      updatedRecords = await MilkRecord.find({ _id: { $in: recordIds } });
    }

    res.json({
      message: 'Payment recorded successfully',
      payment: {
        customerId: req.params.customerId,
        customerName: customer.name,
        amount,
        paymentMethod,
        recordsUpdated: updatedRecords.length,
        paidAt: Date.now(),
        notes
      }
    });
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

// @route   GET /api/billing/pending
// @desc    Get all pending payments
// @access  Private/Admin/Manager
router.get('/pending', authenticate, isAdminOrManager, async (req, res) => {
  try {
    const pendingPayments = await MilkRecord.aggregate([
      {
        $match: {
          status: 'Delivered',
          paymentStatus: 'Pending'
        }
      },
      {
        $group: {
          _id: '$customerId',
          totalAmount: { $sum: '$totalAmount' },
          recordCount: { $sum: 1 },
          oldestRecord: { $min: '$date' }
        }
      },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
        }
      },
      {
        $unwind: '$customer'
      },
      {
        $project: {
          customerId: '$_id',
          customerName: '$customer.name',
          customerPhone: '$customer.phone',
          customerArea: '$customer.area',
          totalAmount: 1,
          recordCount: 1,
          oldestRecord: 1
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);

    const summary = {
      totalCustomers: pendingPayments.length,
      totalPendingAmount: pendingPayments.reduce((sum, p) => sum + p.totalAmount, 0),
      totalPendingRecords: pendingPayments.reduce((sum, p) => sum + p.recordCount, 0)
    };

    res.json({ pendingPayments, summary });
  } catch (error) {
    console.error('Pending payments error:', error);
    res.status(500).json({ error: 'Failed to fetch pending payments' });
  }
});

// @route   GET /api/billing/area/:area
// @desc    Get billing summary by area
// @access  Private
router.get('/area/:area', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateQuery = {};
    if (startDate || endDate) {
      dateQuery.date = {};
      if (startDate) dateQuery.date.$gte = new Date(startDate);
      if (endDate) dateQuery.date.$lte = new Date(endDate);
    }

    const customers = await Customer.find({ 
      area: new RegExp(req.params.area, 'i'),
      status: 'Active'
    });

    const customerIds = customers.map(c => c._id);

    const records = await MilkRecord.find({
      customerId: { $in: customerIds },
      status: 'Delivered',
      ...dateQuery
    });

    const billing = {
      area: req.params.area,
      totalCustomers: customers.length,
      totalLitres: records.reduce((sum, r) => sum + r.litres, 0),
      totalRevenue: records.reduce((sum, r) => sum + r.totalAmount, 0),
      totalDeliveries: records.length,
      paidAmount: records.filter(r => r.paymentStatus === 'Paid')
        .reduce((sum, r) => sum + r.totalAmount, 0),
      pendingAmount: records.filter(r => r.paymentStatus === 'Pending')
        .reduce((sum, r) => sum + r.totalAmount, 0)
    };

    res.json(billing);
  } catch (error) {
    console.error('Area billing error:', error);
    res.status(500).json({ error: 'Failed to fetch area billing' });
  }
});

// @route   GET /api/billing/revenue/daily
// @desc    Get daily revenue for date range
// @access  Private/Admin/Manager
router.get('/revenue/daily', authenticate, isAdminOrManager, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let matchQuery = { status: 'Delivered' };
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }

    const dailyRevenue = await MilkRecord.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          totalLitres: { $sum: '$litres' },
          totalRevenue: { $sum: '$totalAmount' },
          deliveryCount: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          totalLitres: 1,
          totalRevenue: 1,
          deliveryCount: 1
        }
      }
    ]);

    res.json({ dailyRevenue });
  } catch (error) {
    console.error('Daily revenue error:', error);
    res.status(500).json({ error: 'Failed to fetch daily revenue' });
  }
});

// @route   GET /api/billing/invoice/:customerId/:year/:month
// @desc    Generate invoice for customer
// @access  Private
router.get('/invoice/:customerId/:year/:month', authenticate, async (req, res) => {
  try {
    const { customerId, year, month } = req.params;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const records = await MilkRecord.find({
      customerId,
      date: { $gte: startDate, $lte: endDate },
      status: 'Delivered'
    }).sort({ date: 1 });

    const invoice = {
      invoiceNumber: `INV-${year}${String(month).padStart(2, '0')}-${customerId.slice(-6)}`,
      date: Date.now(),
      customer: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        area: customer.area
      },
      billingPeriod: {
        start: startDate,
        end: endDate,
        month: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
        year
      },
      records: records.map(r => ({
        date: r.date,
        litres: r.litres,
        pricePerLitre: r.pricePerLitre,
        amount: r.totalAmount
      })),
      summary: {
        totalLitres: records.reduce((sum, r) => sum + r.litres, 0),
        totalAmount: records.reduce((sum, r) => sum + r.totalAmount, 0),
        deliveryCount: records.length,
        pricePerLitre: customer.pricePerLitre
      }
    };

    res.json({ invoice });
  } catch (error) {
    console.error('Invoice generation error:', error);
    res.status(500).json({ error: 'Failed to generate invoice' });
  }
});

module.exports = router;