
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');


router.get('/overview', auth, async (req, res) => {

  try {
    const transactions = await Transaction.find({ userId: req.user.id });

    if (!transactions || transactions.length === 0) {
      return res.json({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        categorySpending: {},
        categoryPercentages: {},
        monthlyData: {},
        transactionCount: 0,
        comparison: {}
      });
    }

    // 1️⃣ Total income & expense
    const totalIncome = transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // 2️⃣ Category-wise spending
    const categorySpending = {};
    transactions
      .filter(t => t.type === 'debit')
      .forEach(t => {
        if (!categorySpending[t.category]) categorySpending[t.category] = 0;
        categorySpending[t.category] += t.amount;
      });

    // Category percentages
    const categoryPercentages = {};
    Object.keys(categorySpending).forEach(cat => {
      categoryPercentages[cat] = ((categorySpending[cat] / totalExpense) * 100).toFixed(2);
    });

    // 3️⃣ Monthly income & expense
    const monthlyData = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
      if (t.type === 'credit') monthlyData[month].income += t.amount;
      else monthlyData[month].expense += t.amount;
    });

    // 4️⃣ Comparison: spending vs income
    const comparison = {
      spentVsIncomePercent: totalIncome === 0 ? 0 : ((totalExpense / totalIncome) * 100).toFixed(2),
      remainingIncome: totalIncome - totalExpense
    };

    // Send structured analytics
    res.json({
      totalIncome,
      totalExpense,
      balance,
      categorySpending,
      categoryPercentages,
      monthlyData,
      transactionCount: transactions.length,
      comparison
    });

  } catch (err) {
    console.error('Overview error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }


});

// @route   GET /api/analytics/transactions
// @desc    Get all transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ date: -1 });
    
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/categories
// @desc    Get spending by category
router.get('/categories', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
      userId: req.user.id,
      type: 'debit'
    });

    const categories = {};
    transactions.forEach(t => {
      if (!categories[t.category]) {
        categories[t.category] = {
          total: 0,
          count: 0,
          transactions: []
        };
      }
      categories[t.category].total += t.amount;
      categories[t.category].count += 1;
      categories[t.category].transactions.push(t);
    });

    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

