// const Budget = require('../models/Budget');
// const Transaction = require('../models/Transaction');

// exports.getBudgetStatus = async (req, res) => {
//   const { budgetId } = req.params;

//   const budget = await Budget.findById(budgetId);

//   const spent = await Transaction.aggregate([
//     {
//       $match: {
//         userId: budget.userId,
//         category: budget.category,
//         type: 'debit',
//         date: {
//           $gte: budget.startDate,
//           $lte: budget.endDate
//         }
//       }
//     },
//     {
//       $group: {
//         _id: null,
//         total: { $sum: '$amount' }
//       }
//     }
//   ]);

//   res.json({
//     budgetLimit: budget.limit,
//     spent: spent[0]?.total || 0,
//     remaining: budget.limit - (spent[0]?.total || 0)
//   });
// };


const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @route   GET /api/budgets/:budgetId/status
// @desc    Get budget status (aggregation version)
router.get('/mybudget', auth, async (req, res) => {
  try {
    const { budgetId } = req.params;

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    const spent = await Transaction.aggregate([
      {
        $match: {
          userId: budget.userId,
          category: budget.category,
          type: 'debit',
          date: {
            $gte: budget.startDate,
            $lte: budget.endDate
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totalSpent = spent[0]?.total || 0;

    res.json({
      budgetLimit: budget.limit,
      spent: totalSpent,
      remaining: budget.limit - totalSpent
    });

  } catch (err) {
    console.error('Budget status error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

