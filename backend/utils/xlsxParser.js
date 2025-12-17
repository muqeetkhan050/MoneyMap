const XLSX = require('xlsx');

// Parse XLSX file and extract transactions
const parseXLSX = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    // Process transactions
    const transactions = jsonData.map((row) => {
      return processRow(row);
    }).filter(t => t !== null);
    
    return transactions;
  } catch (error) {
    throw new Error('Error parsing XLSX file: ' + error.message);
  }
};

// Process individual row - adapt this based on your bank statement format
const processRow = (row) => {
  try {
    // Common column names in bank statements
    const date = row['Date'] || row['Transaction Date'] || row['date'];
    const description = row['Description'] || row['Narration'] || row['description'];
    const debit = row['Debit'] || row['Withdrawal'] || row['debit'] || 0;
    const credit = row['Credit'] || row['Deposit'] || row['credit'] || 0;
    const balance = row['Balance'] || row['balance'];
    
    // Skip if no date
    if (!date) return null;
    
    // Determine transaction type and amount
    const amount = debit > 0 ? -Math.abs(debit) : Math.abs(credit);
    const type = amount < 0 ? 'debit' : 'credit';
    
    // Categorize transaction
    const category = categorizeTransaction(description);
    
    return {
      date: new Date(date),
      description: description || 'Unknown',
      amount: Math.abs(amount),
      type,
      category,
      balance: balance || 0
    };
  } catch (error) {
    console.error('Error processing row:', error);
    return null;
  }
};

// Simple categorization logic - you can enhance this
const categorizeTransaction = (description) => {
  if (!description) return 'Uncategorized';
  
  const desc = description.toLowerCase();
  
  // Food & Dining
  if (desc.includes('restaurant') || desc.includes('food') || 
      desc.includes('swiggy') || desc.includes('zomato') || 
      desc.includes('cafe') || desc.includes('pizza')) {
    return 'Food & Dining';
  }
  
  // Shopping
  if (desc.includes('amazon') || desc.includes('flipkart') || 
      desc.includes('shop') || desc.includes('store') || 
      desc.includes('mall')) {
    return 'Shopping';
  }
  
  // Transportation
  if (desc.includes('uber') || desc.includes('ola') || 
      desc.includes('petrol') || desc.includes('fuel') || 
      desc.includes('metro') || desc.includes('transport')) {
    return 'Transportation';
  }
  
  // Bills & Utilities
  if (desc.includes('electricity') || desc.includes('water') || 
      desc.includes('gas') || desc.includes('internet') || 
      desc.includes('mobile') || desc.includes('recharge')) {
    return 'Bills & Utilities';
  }
  
  // Entertainment
  if (desc.includes('netflix') || desc.includes('spotify') || 
      desc.includes('movie') || desc.includes('cinema') || 
      desc.includes('game')) {
    return 'Entertainment';
  }
  
  // Healthcare
  if (desc.includes('hospital') || desc.includes('doctor') || 
      desc.includes('medical') || desc.includes('pharmacy') || 
      desc.includes('medicine')) {
    return 'Healthcare';
  }
  
  // Income
  if (desc.includes('salary') || desc.includes('payment received') || 
      desc.includes('refund') || desc.includes('interest')) {
    return 'Income';
  }
  
  return 'Uncategorized';
};

module.exports = { parseXLSX };

