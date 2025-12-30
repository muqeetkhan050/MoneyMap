


// // const XLSX = require("xlsx");
// // const fs = require("fs");

// // const CATEGORY_RULES = [
// //   { name: "Food & Dining", keywords: ["food", "restaurant", "grocery", "cafe", "meal"] },
// //   { name: "Transportation", keywords: ["uber", "taxi", "fuel", "bus", "train", "metro"] },
// //   { name: "Entertainment", keywords: ["movie", "netflix", "spotify", "cinema", "game"] },
// //   { name: "Health", keywords: ["hospital", "doctor", "pharmacy", "medicine", "clinic"] },
// //   { name: "Education", keywords: ["school", "college", "course", "udemy", "fees"] },
// //   { name: "Shopping", keywords: ["amazon", "flipkart", "mall", "store"] },
// //   { name: "Income", keywords: ["salary", "income", "bonus", "credit"] }
// // ];

// // const detectCategory = (description) => {
// //   const desc = description.toLowerCase();
// //   for (const rule of CATEGORY_RULES) {
// //     if (rule.keywords.some(k => desc.includes(k))) {
// //       return rule.name;
// //     }
// //   }
// //   return "Miscellaneous";
// // };

// // const parseAmount = (value) => {
// //   if (!value) return null;
// //   let str = value.toString().trim();
// //   let isNegative = false;
// //   if (str.startsWith("(") && str.endsWith(")")) {
// //     isNegative = true;
// //     str = str.slice(1, -1);
// //   }
// //   str = str.replace(/[^0-9.]+/g, "");
// //   const num = parseFloat(str);
// //   if (isNaN(num)) return null;
// //   return isNegative ? -num : num;
// // };

// // const parseXLSX = (filePath, openingBalance = 0) => {
// //   if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

// //   const workbook = XLSX.readFile(filePath);
// //   const sheet = workbook.Sheets[workbook.SheetNames[0]];
// //   const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
// //   if (!rows || rows.length < 2) return { summary: {}, categorySpending: {}, transactions: [] };

// //   const headerIndex = rows.findIndex(r => r?.some(c => c));
// //   const headers = rows[headerIndex];

// //   let balance = openingBalance;
// //   const transactions = [];
// //   const categorySummary = {};
// //   let totalIncome = 0;
// //   let totalExpense = 0;

// //   for (let i = headerIndex + 1; i < rows.length; i++) {
// //     const row = rows[i];
// //     if (!row || row.every(c => !c)) continue;

// //     let date = null;
// //     let description = "";
// //     let amount = null;

// //     for (let c = 0; c < row.length; c++) {
// //       const value = row[c];
// //       if (!value) continue;

// //       // Date
// //       if (!date) {
// //         const d = new Date(value);
// //         if (!isNaN(d)) date = d;
// //       }

// //       // Amount
// //       if (amount === null) {
// //         const num = parseAmount(value);
// //         if (num !== null) amount = num;
// //       }

// //       // Description
// //       if (!description && typeof value === "string" && value.length > 3) description = value;
// //     }

// //     if (amount === null) continue;

// //     const type = amount < 0 ? "debit" : "credit";
// //     const absAmount = Math.abs(amount);
// //     const category = detectCategory(description);

// //     balance += type === "credit" ? absAmount : -absAmount;

// //     if (type === "credit") totalIncome += absAmount;
// //     else totalExpense += absAmount;

// //     if (type === "debit") {
// //       if (!categorySummary[category]) categorySummary[category] = 0;
// //       categorySummary[category] += absAmount;
// //     }

// //     transactions.push({
// //       date: date || new Date(),
// //       description: description || `Transaction ${i}`,
// //       amount: absAmount,
// //       type,
// //       category,
// //       balanceAfter: balance
// //     });
// //   }

// //   return {
// //     summary: {
// //       openingBalance,
// //       totalIncome,
// //       totalExpense,
// //       closingBalance: balance
// //     },
// //     categorySpending: categorySummary,
// //     transactions
// //   };
// // };

// // module.exports = { parseXLSX };





// const XLSX = require("xlsx");
// const fs = require("fs");

// const CATEGORY_RULES = [
//   { name: "Food & Dining", keywords: ["food", "restaurant", "grocery", "cafe", "meal"] },
//   { name: "Transportation", keywords: ["uber", "taxi", "fuel", "bus", "train", "metro"] },
//   { name: "Entertainment", keywords: ["movie", "netflix", "spotify", "cinema", "game"] },
//   { name: "Health", keywords: ["hospital", "doctor", "pharmacy", "medicine", "clinic"] },
//   { name: "Education", keywords: ["school", "college", "course", "udemy", "fees"] },
//   { name: "Shopping", keywords: ["amazon", "flipkart", "mall", "store"] },
//   { name: "Income", keywords: ["salary", "income", "bonus", "credit"] }
// ];

// const detectCategory = (description) => {
//   const desc = description.toLowerCase();
//   for (const rule of CATEGORY_RULES) {
//     if (rule.keywords.some(k => desc.includes(k))) {
//       return rule.name;
//     }
//   }
//   return "Miscellaneous";
// };

// const parseAmount = (value) => {
//   if (!value) return null;
//   let str = value.toString().trim();
//   let isNegative = false;
//   if (str.startsWith("(") && str.endsWith(")")) {
//     isNegative = true;
//     str = str.slice(1, -1);
//   }
//   str = str.replace(/[^0-9.]+/g, "");
//   const num = parseFloat(str);
//   if (isNaN(num)) return null;
//   return isNegative ? -num : num;
// };

// const parseXLSX = (filePath, openingBalance = 0) => {
//   if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

//   const workbook = XLSX.readFile(filePath);
//   const sheet = workbook.Sheets[workbook.SheetNames[0]];
//   const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//   if (!rows || rows.length < 2) return { summary: {}, categorySpending: {}, transactions: [] };

//   const headerIndex = rows.findIndex(r => r?.some(c => c));
//   const headers = rows[headerIndex];

//   let balance = openingBalance;
//   const transactions = [];
//   const categorySummary = {};
//   let totalIncome = 0;
//   let totalExpense = 0;

//   for (let i = headerIndex + 1; i < rows.length; i++) {
//     const row = rows[i];
//     if (!row || row.every(c => !c)) continue;

//     let date = null;
//     let description = "";
//     let amount = null;

//     for (let c = 0; c < row.length; c++) {
//       const value = row[c];
//       if (!value) continue;

//       // Date
//       if (!date) {
//         const d = new Date(value);
//         if (!isNaN(d)) date = d;
//       }

//       // Amount
//       if (amount === null) {
//         const num = parseAmount(value);
//         if (num !== null) amount = num;
//       }

//       // Description
//       if (!description && typeof value === "string" && value.length > 3) description = value;
//     }

//     if (amount === null) continue;

//     const type = amount < 0 ? "debit" : "credit";
//     const absAmount = Math.abs(amount);
//     const category = detectCategory(description);

//     balance += type === "credit" ? absAmount : -absAmount;

//     if (type === "credit") totalIncome += absAmount;
//     else totalExpense += absAmount;

//     if (type === "debit") {
//       if (!categorySummary[category]) categorySummary[category] = 0;
//       categorySummary[category] += absAmount;
//     }

//     transactions.push({
//       date: date || new Date(),
//       description: description || `Transaction ${i}`,
//       amount: absAmount,
//       type,
//       category,
//       balanceAfter: balance
//     });
//   }

//   return {
//     summary: {
//       openingBalance,
//       totalIncome,
//       totalExpense,
//       closingBalance: balance
//     },
//     categorySpending: categorySummary,
//     transactions
//   };
// };

// module.exports = { parseXLSX };


const XLSX = require("xlsx");
const fs = require("fs");

const CATEGORY_RULES = [
  { name: "Food & Dining", keywords: ["food", "restaurant", "grocery", "cafe", "meal", "swiggy", "zomato", "dominos", "mcdonald", "kfc", "subway"] },
  { name: "Transportation", keywords: ["uber", "ola", "taxi", "fuel", "petrol", "diesel", "bus", "train", "metro", "rapido"] },
  { name: "Entertainment", keywords: ["movie", "netflix", "spotify", "cinema", "pvr", "inox", "prime", "hotstar", "game"] },
  { name: "Health", keywords: ["hospital", "doctor", "pharmacy", "medicine", "clinic", "apollo", "practo", "medplus"] },
  { name: "Education", keywords: ["school", "college", "course", "udemy", "fees", "coursera", "unacademy", "byju"] },
  { name: "Shopping", keywords: ["amazon", "flipkart", "myntra", "ajio", "mall", "store", "shopping"] },
  { name: "Utilities", keywords: ["electricity", "water", "gas", "mobile", "internet", "recharge", "bill", "airtel", "jio", "vi"] },
  { name: "Rent", keywords: ["rent", "lease", "housing", "maintenance"] },
  { name: "Transfer", keywords: ["transfer", "upi", "neft", "imps", "rtgs", "paytm", "phonepe", "gpay"] },
  { name: "Income", keywords: ["salary", "income", "bonus", "credit", "payment received", "refund"] }
];

const detectCategory = (description) => {
  const desc = description.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some(k => desc.includes(k))) {
      return rule.name;
    }
  }
  return "Miscellaneous";
};

const parseAmount = (value) => {
  if (!value && value !== 0) return null;
  if (typeof value === 'number') return value;
  
  let str = value.toString().trim();
  if (str === '' || str === '-') return null;
  
  let isNegative = false;
  
  // Handle parentheses (accounting format for negative)
  if (str.match(/^\(.*\)$/)) {
    isNegative = true;
    str = str.slice(1, -1);
  }
  
  // Handle explicit negative/positive signs
  if (str.startsWith("-")) {
    isNegative = true;
    str = str.substring(1);
  } else if (str.startsWith("+")) {
    str = str.substring(1);
  }
  
  // Remove currency symbols, commas, spaces
  str = str.replace(/[₹$€£,\s]/g, "");
  
  // Handle CR/DR suffixes (common in Indian bank statements)
  if (str.toUpperCase().endsWith("CR")) {
    str = str.slice(0, -2);
    // CR means credit (positive)
  } else if (str.toUpperCase().endsWith("DR")) {
    isNegative = true;
    str = str.slice(0, -2);
  }
  
  str = str.trim();
  if (str === '') return null;
  
  const num = parseFloat(str);
  if (isNaN(num)) return null;
  
  return isNegative ? -num : num;
};

const parseDate = (value) => {
  if (!value) return null;
  
  try {
    // Handle Excel date serial numbers
    if (typeof value === 'number' && value > 40000 && value < 60000) {
      const date = XLSX.SSF.parse_date_code(value);
      return new Date(date.y, date.m - 1, date.d);
    }
    
    // Handle string dates
    const dateObj = new Date(value);
    if (!isNaN(dateObj) && dateObj.getFullYear() > 1900 && dateObj.getFullYear() < 2100) {
      return dateObj;
    }
    
    // Handle DD/MM/YYYY or DD-MM-YYYY format
    const parts = value.toString().split(/[\/\-\.]/);
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      
      if (day > 0 && day <= 31 && month > 0 && month <= 12 && year > 1900) {
        return new Date(year, month - 1, day);
      }
    }
  } catch (e) {
    // Not a valid date
  }
  
  return null;
};

const identifyColumns = (headers, rows) => {
  const cols = {
    date: -1,
    description: -1,
    debit: -1,
    credit: -1,
    withdrawal: -1,
    deposit: -1,
    amount: -1,
    balance: -1
  };
  
  // Step 1: Check headers
  for (let i = 0; i < headers.length; i++) {
    const h = (headers[i] || "").toString().toLowerCase().trim();
    
    if (h.includes("date") || h.includes("txn date") || h.includes("transaction date")) {
      cols.date = i;
    }
    
    if (h.includes("description") || h.includes("narration") || h.includes("detail") || 
        h.includes("particular") || h.includes("remarks")) {
      cols.description = i;
    }
    
    if (h.includes("debit") || h.includes("withdrawal") || h.includes("dr")) {
      if (h.includes("balance")) continue; // Skip "debit balance"
      if (cols.debit === -1) cols.debit = i;
      if (h.includes("withdrawal")) cols.withdrawal = i;
    }
    
    if (h.includes("credit") || h.includes("deposit") || h.includes("cr")) {
      if (h.includes("balance")) continue; // Skip "credit balance"
      if (cols.credit === -1) cols.credit = i;
      if (h.includes("deposit")) cols.deposit = i;
    }
    
    if (h.includes("amount") && !h.includes("balance")) {
      cols.amount = i;
    }
    
    if (h.includes("balance") || h.includes("closing balance")) {
      cols.balance = i;
    }
  }
  
  // Step 2: Fallback - detect by data patterns (sample first 15 rows)
  const sampleSize = Math.min(15, rows.length);
  
  for (let c = 0; c < headers.length && c < 20; c++) {
    let dateCount = 0, textCount = 0, numCount = 0, textLength = 0;
    
    for (let r = 1; r < sampleSize; r++) {
      const val = rows[r]?.[c];
      if (!val) continue;
      
      if (parseDate(val)) dateCount++;
      
      if (typeof val === "string" && val.length > 5) {
        textCount++;
        textLength += val.length;
      }
      
      if (parseAmount(val) !== null) numCount++;
    }
    
    const avgTextLength = textLength / Math.max(textCount, 1);
    
    // Identify date column
    if (cols.date === -1 && dateCount >= sampleSize * 0.6) {
      cols.date = c;
    }
    
    // Identify description column (longer text fields)
    if (cols.description === -1 && textCount >= sampleSize * 0.5 && avgTextLength > 15) {
      cols.description = c;
    }
    
    // Identify amount columns (numeric with fewer than 100% filled indicates debit/credit split)
    if (numCount >= sampleSize * 0.3 && numCount < sampleSize) {
      if (cols.debit === -1 && cols.withdrawal === -1) {
        cols.debit = c;
      } else if (cols.credit === -1 && cols.deposit === -1) {
        cols.credit = c;
      }
    }
  }
  
  return cols;
};

const parseXLSX = (filePath, openingBalance = 0) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    console.log("📄 Reading Excel file...");
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Parse with raw: false to get formatted values
    const rows = XLSX.utils.sheet_to_json(sheet, { 
      header: 1, 
      defval: null,
      raw: false 
    });
    
    console.log(`📊 Total rows found: ${rows.length}`);
    
    if (!rows || rows.length < 2) {
      return { 
        summary: { openingBalance, totalIncome: 0, totalExpense: 0, closingBalance: openingBalance }, 
        categorySpending: {}, 
        transactions: [] 
      };
    }

    // Find header row (skip empty rows at top)
    let headerIndex = -1;
    for (let i = 0; i < Math.min(10, rows.length); i++) {
      const row = rows[i];
      if (row && row.some(c => c && c.toString().toLowerCase().match(/(date|description|amount|debit|credit)/))) {
        headerIndex = i;
        break;
      }
    }
    
    if (headerIndex === -1) {
      headerIndex = 0; // Assume first row
    }
    
    console.log(`📋 Header found at row: ${headerIndex + 1}`);
    const headers = rows[headerIndex];
    const cols = identifyColumns(headers, rows);
    
    console.log("🔍 Detected columns:", {
      date: cols.date >= 0 ? headers[cols.date] : 'Not found',
      description: cols.description >= 0 ? headers[cols.description] : 'Not found',
      debit: cols.debit >= 0 ? headers[cols.debit] : 'Not found',
      credit: cols.credit >= 0 ? headers[cols.credit] : 'Not found'
    });

    let balance = openingBalance;
    const transactions = [];
    const categorySummary = {};
    let totalIncome = 0;
    let totalExpense = 0;
    let processedCount = 0;

    // Process transactions
    for (let i = headerIndex + 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.every(c => !c && c !== 0)) continue;

      let date = null;
      let description = "";
      let amount = null;
      let transactionBalance = null;

      // Extract date
      if (cols.date >= 0) {
        date = parseDate(row[cols.date]);
      }

      // Extract description
      if (cols.description >= 0 && row[cols.description]) {
        description = row[cols.description].toString().trim();
      }

      // Extract amount (priority: debit/credit columns, then single amount column)
      if (cols.debit >= 0 || cols.credit >= 0) {
        const debitVal = cols.debit >= 0 ? parseAmount(row[cols.debit]) : null;
        const creditVal = cols.credit >= 0 ? parseAmount(row[cols.credit]) : null;
        
        if (debitVal !== null && debitVal > 0) {
          amount = -Math.abs(debitVal); // Debit is negative
        } else if (creditVal !== null && creditVal > 0) {
          amount = Math.abs(creditVal); // Credit is positive
        }
      } else if (cols.amount >= 0) {
        amount = parseAmount(row[cols.amount]);
      }

      // Extract balance (for verification)
      if (cols.balance >= 0) {
        transactionBalance = parseAmount(row[cols.balance]);
      }

      // Skip if no valid amount
      if (amount === null || amount === 0) continue;

      const type = amount < 0 ? "debit" : "credit";
      const absAmount = Math.abs(amount);
      const category = detectCategory(description);

      // Update running balance
      balance += type === "credit" ? absAmount : -absAmount;

      if (type === "credit") totalIncome += absAmount;
      else totalExpense += absAmount;

      if (type === "debit") {
        if (!categorySummary[category]) categorySummary[category] = 0;
        categorySummary[category] += absAmount;
      }

      transactions.push({
        date: date || new Date(),
        description: description || `Transaction ${i}`,
        amount: absAmount,
        type,
        category,
        balance: parseFloat(balance.toFixed(2))
      });

      processedCount++;
    }

    console.log(`✅ Successfully processed ${processedCount} transactions`);

    return {
      summary: {
        openingBalance: parseFloat(openingBalance.toFixed(2)),
        totalIncome: parseFloat(totalIncome.toFixed(2)),
        totalExpense: parseFloat(totalExpense.toFixed(2)),
        closingBalance: parseFloat(balance.toFixed(2))
      },
      categorySpending: Object.fromEntries(
        Object.entries(categorySummary).map(([k, v]) => [k, parseFloat(v.toFixed(2))])
      ),
      transactions
    };

  } catch (error) {
    console.error("❌ Error parsing XLSX:", error);
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
};

module.exports = { parseXLSX };