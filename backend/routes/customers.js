// routes/customers.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { authenticate, isAdminOrManager } = require('../middleware/auth');

// @route   GET /api/customers
// @desc    Get all customers (filtered by user role and ownership)
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, area, search, page = 1, limit = 50 } = req.query;
    
    let query = {};
    
    // Customer isolation: users only see customers they created
    query.createdBy = req.user._id;
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter by area
    if (area) {
      query.area = new RegExp(area, 'i');
    }
    
    // Search by name or phone
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
        { address: new RegExp(search, 'i') }
      ];
    }
    
    // If delivery staff, show only assigned customers (by assignedTo) or those in their assignedAreas
    if (req.user.role === 'delivery') {
      const allowed = [];
      // customers explicitly assigned to this user
      allowed.push({ assignedTo: req.user._id });
      // or customers in their assigned areas
      if (Array.isArray(req.user.assignedAreas) && req.user.assignedAreas.length > 0) {
        allowed.push({ area: { $in: req.user.assignedAreas } });
      }

      // Combine user isolation with delivery restrictions
      if (Object.keys(query).length > 1) { // More than just createdBy
        query = { $and: [ query, { $or: allowed } ] };
      } else {
        query = { $or: allowed };
      }
    }

    const customers = await Customer.find(query)
      .populate('assignedTo', 'fullName username')
      .populate('createdBy', 'fullName username')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Customer.countDocuments(query);

    res.json({
      customers,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Fetch customers error:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// @route   GET /api/customers/:id
// @desc    Get single customer (only if user created it or is assigned to it)
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('assignedTo', 'fullName username email phone')
      .populate('createdBy', 'fullName username');

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Check if user can access this customer
    const canAccess = customer.createdBy._id.toString() === req.user._id.toString() ||
                      (req.user.role === 'delivery' && customer.assignedTo && 
                       customer.assignedTo._id.toString() === req.user._id.toString());

    if (!canAccess) {
      return res.status(403).json({ error: 'Access denied. You can only view customers you created or are assigned to.' });
    }

    res.json({ customer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// @route   POST /api/customers
// @desc    Create new customer (only admin/manager can create)
// @access  Private/Admin/Manager
router.post('/', authenticate, isAdminOrManager, async (req, res) => {
  try {
    // Accept either nested location or top-level lat/lng
    const { name, address, location, lat, lng, milkPerDay, phone, area, pricePerLitre, notes } = req.body;

    // Map lat/lng into location if provided
    let finalLocation = location;
    if ((lat !== undefined || lng !== undefined) && !finalLocation) {
      finalLocation = {
        lat: lat !== undefined ? Number(lat) : undefined,
        lng: lng !== undefined ? Number(lng) : undefined,
      };
    }

    // Check if customer with same phone exists (within same dairy/createdBy)
    const existingCustomer = await Customer.findOne({ 
      phone, 
      createdBy: req.user._id 
    });
    if (existingCustomer) {
      return res.status(400).json({ error: 'Customer with this phone number already exists in your dairy' });
    }

    const customer = new Customer({
      name,
      address,
      location: finalLocation,
      milkPerDay,
      phone,
      area,
      pricePerLitre: pricePerLitre || 60,
      notes,
      createdBy: req.user._id, // Track who created this customer
      assignedTo: req.user.role === 'delivery' ? req.user._id : null
    });

    await customer.save();

    res.status(201).json({
      message: 'Customer created successfully',
      customer
    });
  } catch (error) {
    console.error('Create customer error:', error);
    // Send validation details if present
    if (error.name === 'ValidationError' && error.errors) {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ error: 'Validation failed', messages: errors, details: error.errors });
    }
    res.status(400).json({ 
      error: 'Failed to create customer',
      message: error.message 
    });
  }
});

// @route   PUT /api/customers/:id
// @desc    Update customer (only if user created it or is assigned to it)
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, address, location, lat, lng, milkPerDay, phone, area, status, pricePerLitre, notes, assignedTo } = req.body;

    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Check if user can modify this customer
    const canModify = customer.createdBy.toString() === req.user._id.toString() ||
                      (req.user.role === 'delivery' && customer.assignedTo && 
                       customer.assignedTo.toString() === req.user._id.toString());

    if (!canModify) {
      return res.status(403).json({ error: 'Access denied. You can only modify customers you created or are assigned to.' });
    }

    // Update fields
    if (name) customer.name = name;
    if (address) customer.address = address;
    // If lat/lng provided, map into location, otherwise accept nested location
    if ((lat !== undefined || lng !== undefined)) {
      customer.location = {
        lat: lat !== undefined ? Number(lat) : customer.location?.lat,
        lng: lng !== undefined ? Number(lng) : customer.location?.lng,
      };
    } else if (location) {
      customer.location = location;
    }
    if (milkPerDay !== undefined) customer.milkPerDay = milkPerDay;
    if (phone) customer.phone = phone;
    if (area) customer.area = area;
    if (status) customer.status = status;
    if (pricePerLitre) customer.pricePerLitre = pricePerLitre;
    if (notes !== undefined) customer.notes = notes;
    if (assignedTo && (req.user.role === 'admin' || req.user.role === 'manager')) {
      customer.assignedTo = assignedTo;
    }

    await customer.save();

    res.json({
      message: 'Customer updated successfully',
      customer
    });
  } catch (error) {
    console.error('Update customer error:', error);
    if (error.name === 'ValidationError' && error.errors) {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ error: 'Validation failed', messages: errors, details: error.errors });
    }
    res.status(400).json({ 
      error: 'Failed to update customer',
      message: error.message 
    });
  }
});

// @route   DELETE /api/customers/:id
// @desc    Delete customer (only admin/manager who created it)
// @access  Private/Admin/Manager
router.delete('/:id', authenticate, isAdminOrManager, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Only allow deletion by the user who created the customer
    if (customer.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied. You can only delete customers you created.' });
    }

    // Soft delete - mark as inactive instead of deleting
    customer.status = 'Inactive';
    customer.endDate = Date.now();
    await customer.save();

    res.json({ 
      message: 'Customer deactivated successfully',
      customer 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// @route   GET /api/customers/area/:area
// @desc    Get customers by area (only customers created by user)
// @access  Private
router.get('/area/:area', authenticate, async (req, res) => {
  try {
    const customers = await Customer.find({ 
      area: new RegExp(req.params.area, 'i'),
      status: 'Active',
      createdBy: req.user._id // Only customers created by this user
    }).sort({ name: 1 });

    res.json({ customers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers by area' });
  }
});

// @route   GET /api/customers/stats/summary
// @desc    Get customer statistics (only for customers created by user)
// @access  Private
router.get('/stats/summary', authenticate, async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments({ 
      status: 'Active',
      createdBy: req.user._id 
    });
    const totalMilkPerDay = await Customer.aggregate([
      { $match: { status: 'Active', createdBy: req.user._id } },
      { $group: { _id: null, total: { $sum: '$milkPerDay' } } }
    ]);
    
    const customersByArea = await Customer.aggregate([
      { $match: { status: 'Active', createdBy: req.user._id } },
      { $group: { _id: '$area', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalCustomers,
      totalMilkPerDay: totalMilkPerDay[0]?.total || 0,
      customersByArea
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer statistics' });
  }
});

module.exports = router;