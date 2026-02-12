// routes/analytics.js
const express = require('express');
const router = express.Router();
const MilkRecord = require('../models/MilkRecord');
const Customer = require('../models/Customer');
const { authenticate, isAdminOrManager } = require('../middleware/auth');

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // This month dates
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    // Total customers
    const totalCustomers = await Customer.countDocuments({ status: 'Active' });

    // Today's deliveries
    const todayRecords = await MilkRecord.find({
      date: { $gte: today, $lt: tomorrow }
    });

    const todayDelivered = todayRecords.filter(r => r.status === 'Delivered').length;
    const todayPending = todayRecords.filter(r => r.status === 'Pending').length;

    // Monthly stats
    const monthlyRecords = await MilkRecord.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
      status: 'Delivered'
    });

    const monthlyLitres = monthlyRecords.reduce((sum, r) => sum + r.litres, 0);
    const monthlyRevenue = monthlyRecords.reduce((sum, r) => sum + r.totalAmount, 0);

    // Weekly trend (last 7 days)
    const weeklyTrend = await MilkRecord.aggregate([
      {
        $match: {
          date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          status: 'Delivered'
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfWeek: '$date' }
          },
          litres: { $sum: '$litres' },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.day': 1 } }
    ]);

    // Top customers by consumption
    const topCustomers = await MilkRecord.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
          status: 'Delivered'
        }
      },
      {
        $group: {
          _id: '$customerId',
          totalLitres: { $sum: '$litres' },
          totalAmount: { $sum: '$totalAmount' }
        }
      },
      { $sort: { totalLitres: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      {
        $project: {
          customerName: '$customer.name',
          customerPhone: '$customer.phone',
          totalLitres: 1,
          totalAmount: 1
        }
      }
    ]);

    res.json({
      overview: {
        totalCustomers,
        todayDelivered,
        todayPending,
        monthlyLitres,
        monthlyRevenue
      },
      weeklyTrend,
      topCustomers
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard analytics' });
  }
});

// @route   GET /api/analytics/monthly-comparison
// @desc    Get month-over-month comparison
// @access  Private/Admin/Manager
router.get('/monthly-comparison', authenticate, isAdminOrManager, async (req, res) => {
  try {
    const { months = 6 } = req.query;
    
    const monthlyData = await MilkRecord.aggregate([
      {
        $match: {
          date: { $gte: new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000) },
          status: 'Delivered'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          totalLitres: { $sum: '$litres' },
          totalRevenue: { $sum: '$totalAmount' },
          deliveryCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              { $toString: '$_id.month' }
            ]
          },
          totalLitres: 1,
          totalRevenue: 1,
          deliveryCount: 1
        }
      }
    ]);

    res.json({ monthlyComparison: monthlyData });
  } catch (error) {
    console.error('Monthly comparison error:', error);
    res.status(500).json({ error: 'Failed to fetch monthly comparison' });
  }
});

// @route   GET /api/analytics/area-wise
// @desc    Get area-wise analytics
// @access  Private/Admin/Manager
router.get('/area-wise', authenticate, isAdminOrManager, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateQuery = {};
    if (startDate || endDate) {
      dateQuery.date = {};
      if (startDate) dateQuery.date.$gte = new Date(startDate);
      if (endDate) dateQuery.date.$lte = new Date(endDate);
    }

    const areaStats = await Customer.aggregate([
      { $match: { status: 'Active' } },
      {
        $lookup: {
          from: 'milkrecords',
          let: { customerId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$customerId', '$customerId'] },
                status: 'Delivered',
                ...dateQuery
              }
            }
          ],
          as: 'records'
        }
      },
      {
        $group: {
          _id: '$area',
          customerCount: { $sum: 1 },
          totalLitres: { $sum: { $sum: '$records.litres' } },
          totalRevenue: { $sum: { $sum: '$records.totalAmount' } },
          deliveryCount: { $sum: { $size: '$records' } }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({ areaStats });
  } catch (error) {
    console.error('Area-wise analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch area-wise analytics' });
  }
});

// @route   GET /api/analytics/delivery-performance
// @desc    Get delivery staff performance
// @access  Private/Admin/Manager
router.get('/delivery-performance', authenticate, isAdminOrManager, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let matchQuery = { status: 'Delivered' };
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }

    const performance = await MilkRecord.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$deliveredBy',
          totalDeliveries: { $sum: 1 },
          totalLitres: { $sum: '$litres' },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'staff'
        }
      },
      { $unwind: '$staff' },
      {
        $project: {
          staffName: '$staff.fullName',
          staffUsername: '$staff.username',
          totalDeliveries: 1,
          totalLitres: 1,
          totalRevenue: 1,
          avgLitresPerDelivery: { $divide: ['$totalLitres', '$totalDeliveries'] }
        }
      },
      { $sort: { totalDeliveries: -1 } }
    ]);

    res.json({ performance });
  } catch (error) {
    console.error('Delivery performance error:', error);
    res.status(500).json({ error: 'Failed to fetch delivery performance' });
  }
});

// @route   GET /api/analytics/customer-retention
// @desc    Get customer retention analytics
// @access  Private/Admin/Manager
router.get('/customer-retention', authenticate, isAdminOrManager, async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Active customers
    const activeCustomers = await Customer.countDocuments({ status: 'Active' });

    // New customers (joined in last 30 days)
    const newCustomers = await Customer.countDocuments({
      status: 'Active',
      startDate: { $gte: thirtyDaysAgo }
    });

    // Churned customers (no delivery in last 30 days)
    const recentlyActiveCustomers = await MilkRecord.distinct('customerId', {
      date: { $gte: thirtyDaysAgo },
      status: 'Delivered'
    });

    const previouslyActiveCustomers = await MilkRecord.distinct('customerId', {
      date: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
      status: 'Delivered'
    });

    const churnedCount = previouslyActiveCustomers.filter(
      id => !recentlyActiveCustomers.includes(id)
    ).length;

    const retentionRate = previouslyActiveCustomers.length > 0
      ? ((previouslyActiveCustomers.length - churnedCount) / previouslyActiveCustomers.length) * 100
      : 100;

    res.json({
      activeCustomers,
      newCustomers,
      churnedCustomers: churnedCount,
      retentionRate: retentionRate.toFixed(2)
    });
  } catch (error) {
    console.error('Customer retention error:', error);
    res.status(500).json({ error: 'Failed to fetch customer retention analytics' });
  }
});

// @route   GET /api/analytics/payment-trends
// @desc    Get payment collection trends
// @access  Private/Admin/Manager
router.get('/payment-trends', authenticate, isAdminOrManager, async (req, res) => {
  try {
    const paymentStats = await MilkRecord.aggregate([
      {
        $match: { status: 'Delivered' }
      },
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Monthly payment collection trend
    const monthlyPayments = await MilkRecord.aggregate([
      {
        $match: {
          status: 'Delivered',
          paymentStatus: 'Paid'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          collectedAmount: { $sum: '$totalAmount' },
          paymentCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.json({ paymentStats, monthlyPayments });
  } catch (error) {
    console.error('Payment trends error:', error);
    res.status(500).json({ error: 'Failed to fetch payment trends' });
  }
});

// @route   GET /api/analytics/forecast
// @desc    Get revenue forecast based on historical data
// @access  Private/Admin/Manager
router.get('/forecast', authenticate, isAdminOrManager, async (req, res) => {
  try {
    const { months = 3 } = req.query;

    // Get last 6 months data for forecasting
    const historicalData = await MilkRecord.aggregate([
      {
        $match: {
          date: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) },
          status: 'Delivered'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          totalRevenue: { $sum: '$totalAmount' },
          totalLitres: { $sum: '$litres' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Simple average-based forecast
    const avgRevenue = historicalData.reduce((sum, d) => sum + d.totalRevenue, 0) / historicalData.length;
    const avgLitres = historicalData.reduce((sum, d) => sum + d.totalLitres, 0) / historicalData.length;

    const forecast = Array.from({ length: parseInt(months) }, (_, i) => {
      const forecastDate = new Date();
      forecastDate.setMonth(forecastDate.getMonth() + i + 1);
      
      return {
        year: forecastDate.getFullYear(),
        month: forecastDate.getMonth() + 1,
        forecastRevenue: Math.round(avgRevenue),
        forecastLitres: Math.round(avgLitres)
      };
    });

    res.json({
      historical: historicalData,
      forecast,
      summary: {
        avgMonthlyRevenue: Math.round(avgRevenue),
        avgMonthlyLitres: Math.round(avgLitres)
      }
    });
  } catch (error) {
    console.error('Forecast error:', error);
    res.status(500).json({ error: 'Failed to generate forecast' });
  }
});

module.exports = router;