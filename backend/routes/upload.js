

// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const auth = require('../middleware/auth');
// const Transaction = require('../models/Transaction');
// const { parseXLSX } = require('../utils/xlsxParser');

// // Configure multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = 'uploads/';
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (ext !== '.xlsx' && ext !== '.xls') return cb(new Error('Only Excel files are allowed'));
//     cb(null, true);
//   }
// });

// router.post('/', auth, upload.single('file'), async (req, res) => {
//   if (!req.file) return res.status(400).json({ message: 'Please upload a file' });

//   const filePath = req.file.path;
//   let transactions = [];

//   try {
//     // Parse XLSX safely
//     const parsedData = parseXLSX(filePath);

//     if (!parsedData || !Array.isArray(parsedData.transactions) || parsedData.transactions.length === 0) {
//       fs.unlinkSync(filePath);
//       return res.status(400).json({ message: 'No valid transactions found in file' });
//     }

//     transactions = parsedData.transactions;

//     // Add userId to each transaction
//     const transactionsWithUser = transactions.map(t => ({
//       ...t,
//       userId: req.user.id
//     }));

//     // Save all to DB
//     await Transaction.insertMany(transactionsWithUser);

//     // Clean up uploaded file
//     fs.unlinkSync(filePath);

//     return res.json({
//       message: 'File uploaded successfully',
//       count: transactions.length,
//       summary: parsedData.summary,
//       categorySpending: parsedData.categorySpending,
//       transactions: transactionsWithUser
//     });

//   } catch (err) {
//     console.error('Upload error:', err);
//     if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//     return res.status(500).json({ message: 'Error processing file: ' + err.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const { parseXLSX } = require('../utils/xlsxParser');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.xlsx' && ext !== '.xls') return cb(new Error('Only Excel files are allowed'));
    cb(null, true);
  }
});

router.post('/', auth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Please upload a file' });

  try {
    const parsedData = parseXLSX(req.file.path);
    if (!parsedData.transactions.length) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'No valid transactions found' });
    }

    // Attach userId
    const transactionsWithUser = parsedData.transactions.map(t => ({ ...t, userId: req.user.id }));

    // Insert in batches (for large files)
    const batchSize = 1000;
    for (let i = 0; i < transactionsWithUser.length; i += batchSize) {
      await Transaction.insertMany(transactionsWithUser.slice(i, i + batchSize));
    }

    fs.unlinkSync(req.file.path);

    res.json({
      message: 'File uploaded successfully',
      count: transactionsWithUser.length,
      summary: parsedData.summary,
      categorySpending: parsedData.categorySpending
    });
  } catch (err) {
    console.error('Upload error:', err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Error processing file: ' + err.message });
  }
});

module.exports = router;
