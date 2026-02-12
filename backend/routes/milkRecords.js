// routes/milkRecords.js
const express = require('express');
const router = express.Router();
const MilkRecord = require('../models/MilkRecord');
const Customer = require('../models/Customer');
const { authenticate } = require('../middleware/auth');

// @route   GET /api/milk-records
// @desc    Get all milk records
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, customerId, startDate, endDate, page = 1, limit = 50 } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (customerId) {
      query.customerId = customerId;
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    // If delivery staff, show only their records
    if (req.user.role === 'delivery') {
      query.deliveredBy = req.user._id;
    }

    const records = await MilkRecord.find(query)
      .populate('customerId', 'name phone area address')
      .populate('deliveredBy', 'fullName username')
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await MilkRecord.countDocuments(query);

    res.json({
      records,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Fetch milk records error:', error);
    res.status(500).json({ error: 'Failed to fetch milk records' });
  }
});

// @route   GET /api/milk-records/:id
// @desc    Get single milk record
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const record = await MilkRecord.findById(req.params.id)
      .populate('customerId', 'name phone area address')
      .populate('deliveredBy', 'fullName username email');

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ record });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch record' });
  }
});

// @route   POST /api/milk-records
// @desc    Create new milk record
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { customerId, date, litres, status, notes, pricePerLitre } = req.body;

    // Validate customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const record = new MilkRecord({
      customerId,
      date: date || Date.now(),
      litres: litres || customer.milkPerDay,
      status: status || 'Pending',
      pricePerLitre: pricePerLitre || customer.pricePerLitre,
      deliveredBy: req.user._id,
      notes
    });

    if (status === 'Delivered') {
      record.deliveryTime = Date.now();
    }

    await record.save();

    const populatedRecord = await MilkRecord.findById(record._id)
      .populate('customerId', 'name phone area')
      .populate('deliveredBy', 'fullName username');

    res.status(201).json({
      message: 'Milk record created successfully',
      record: populatedRecord
    });
  } catch (error) {
    console.error('Create milk record error:', error);
    res.status(400).json({ 
      error: 'Failed to create milk record',
      message: error.message 
    });
  }
});

// @route   PUT /api/milk-records/:id
// @desc    Update milk record
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { litres, status, notes, paymentStatus, signature } = req.body;

    const record = await MilkRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Update fields
    if (litres !== undefined) {
      record.litres = litres;
      record.totalAmount = litres * record.pricePerLitre;
    }
    if (status) {
      record.status = status;
      if (status === 'Delivered' && !record.deliveryTime) {
        record.deliveryTime = Date.now();
        record.deliveredBy = req.user._id;
      }
    }
    if (notes !== undefined) record.notes = notes;
    if (paymentStatus) record.paymentStatus = paymentStatus;
    if (signature) record.signature = signature;

    await record.save();

    const updatedRecord = await MilkRecord.findById(record._id)
      .populate('customerId', 'name phone area')
      .populate('deliveredBy', 'fullName username');

    res.json({
      message: 'Record updated successfully',
      record: updatedRecord
    });
  } catch (error) {
    console.error('Update milk record error:', error);
    res.status(400).json({ 
      error: 'Failed to update record',
      message: error.message 
    });
  }
});

// @route   DELETE /api/milk-records/:id
// @desc    Delete milk record
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const record = await MilkRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Only admin can delete, or delivery staff can delete their own pending records
    if (req.user.role !== 'admin' && 
        (req.user.role !== 'delivery' || record.status !== 'Pending' || 
         record.deliveredBy.toString() !== req.user._id.toString())) {
      return res.status(403).json({ error: 'Not authorized to delete this record' });
    }

    await MilkRecord.findByIdAndDelete(req.params.id);

    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

// @route   POST /api/milk-records/bulk-create
// @desc    Create bulk records for all active customers
// @access  Private
router.post('/bulk-create', authenticate, async (req, res) => {
  try {
    const { date, status } = req.body;

    const customers = await Customer.find({ status: 'Active' });

    if (customers.length === 0) {
      return res.status(404).json({ error: 'No active customers found' });
    }

    const records = customers.map(customer => ({
      customerId: customer._id,
      date: date || Date.now(),
      litres: customer.milkPerDay,
      status: status || 'Pending',
      pricePerLitre: customer.pricePerLitre,
      deliveredBy: req.user._id
    }));

    const createdRecords = await MilkRecord.insertMany(records);

    res.status(201).json({
      message: `${createdRecords.length} records created successfully`,
      count: createdRecords.length
    });
  } catch (error) {
    console.error('Bulk create error:', error);
    res.status(500).json({ 
      error: 'Failed to create bulk records',
      message: error.message 
    });
  }
});

// @route   GET /api/milk-records/customer/:customerId
// @desc    Get all records for a specific customer
// @access  Private
router.get('/customer/:customerId', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = { customerId: req.params.customerId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const records = await MilkRecord.find(query)
      .populate('deliveredBy', 'fullName username')
      .sort({ date: -1 });

    // Calculate summary
    const summary = {
      totalLitres: records.reduce((sum, r) => sum + r.litres, 0),
      totalAmount: records.reduce((sum, r) => sum + r.totalAmount, 0),
      delivered: records.filter(r => r.status === 'Delivered').length,
      pending: records.filter(r => r.status === 'Pending').length
    };

    res.json({ records, summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer records' });
  }
});

// @route   GET /api/milk-records/daily/:date
// @desc    Get all records for a specific date
// @access  Private
router.get('/daily/:date', authenticate, async (req, res) => {
  try {
    const targetDate = new Date(req.params.date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const records = await MilkRecord.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    })
      .populate('customerId', 'name phone area address')
      .populate('deliveredBy', 'fullName username')
      .sort({ 'customerId.area': 1 });

    const summary = {
      totalRecords: records.length,
      totalLitres: records.reduce((sum, r) => sum + r.litres, 0),
      totalAmount: records.reduce((sum, r) => sum + r.totalAmount, 0),
      delivered: records.filter(r => r.status === 'Delivered').length,
      pending: records.filter(r => r.status === 'Pending').length,
      cancelled: records.filter(r => r.status === 'Cancelled').length
    };

    res.json({ records, summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch daily records' });
  }
});

// @route   GET /api/milk-records/stats/summary
// @desc    Get delivery statistics
// @access  Private
router.get('/stats/summary', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let matchQuery = {};
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }

    const stats = await MilkRecord.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalLitres: { $sum: '$litres' },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;