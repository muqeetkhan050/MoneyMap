


const XLSX = require("xlsx");
const fs = require("fs");

const CATEGORY_RULES = [
  { name: "Food & Dining", keywords: ["food", "restaurant", "grocery", "cafe", "meal"] },
  { name: "Transportation", keywords: ["uber", "taxi", "fuel", "bus", "train", "metro"] },
  { name: "Entertainment", keywords: ["movie", "netflix", "spotify", "cinema", "game"] },
  { name: "Health", keywords: ["hospital", "doctor", "pharmacy", "medicine", "clinic"] },
  { name: "Education", keywords: ["school", "college", "course", "udemy", "fees"] },
  { name: "Shopping", keywords: ["amazon", "flipkart", "mall", "store"] },
  { name: "Income", keywords: ["salary", "income", "bonus", "credit"] }
];

/**
 * Detect category from description
 */
const detectCategory = (description) => {
  const desc = description.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some(k => desc.includes(k))) {
      return rule.name;
    }
  }
  return "Miscellaneous";
};

/**
 * MAIN PARSER
 */
const parseXLSX = (filePath, openingBalance = 0) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  if (!rows || rows.length < 2) return [];

  // Find header row
  let headerIndex = rows.findIndex(r => r?.some(c => c));
  const headers = rows[headerIndex];

  let balance = openingBalance;
  const transactions = [];
  const categorySummary = {};
  let totalIncome = 0;
  let totalExpense = 0;

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every(c => !c)) continue;

    let date = null;
    let description = "";
    let amount = null;

    for (let c = 0; c < row.length; c++) {
      const value = row[c];
      if (!value) continue;

      // Date
      if (!date) {
        const d = new Date(value);
        if (!isNaN(d)) date = d;
      }

      // Amount
      if (amount === null) {
        // ✅ Fixed parsing: remove commas, currency symbols, etc.
        const num = parseFloat(value.toString().replace(/[^0-9.-]+/g, ""));
        if (!isNaN(num)) amount = num;
      }

      // Description
      if (!description && typeof value === "string" && value.length > 3) {
        description = value;
      }
    }

    if (amount === null) continue;

    const type = amount < 0 ? "debit" : "credit";
    const absAmount = Math.abs(amount);
    const category = detectCategory(description);

    // Balance calculation
    balance += type === "credit" ? absAmount : -absAmount;

    // Totals
    if (type === "credit") totalIncome += absAmount;
    else totalExpense += absAmount;

    // Category totals
    if (!categorySummary[category]) categorySummary[category] = 0;
    if (type === "debit") categorySummary[category] += absAmount;

    transactions.push({
      date: date || new Date(),
      description: description || `Transaction ${i}`,
      amount: absAmount,
      type,
      category,
      balanceAfter: balance
    });
  }

  return {
    summary: {
      openingBalance,
      totalIncome,
      totalExpense,
      closingBalance: balance
    },
    categorySpending: categorySummary,
    transactions
  };
};

module.exports = { parseXLSX };


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

//   // Handle negative in parentheses
//   let isNegative = false;
//   if (str.startsWith("(") && str.endsWith(")")) {
//     isNegative = true;
//     str = str.slice(1, -1);
//   }

//   // Remove commas, currency symbols, and spaces
//   str = str.replace(/[^0-9.]+/g, "");

//   const num = parseFloat(str);
//   if (isNaN(num)) return null;
//   return isNegative ? -num : num;
// };

// const parseXLSX = (filePath, openingBalance = 0) => {
//   if (!fs.existsSync(filePath)) {
//     throw new Error(`File not found: ${filePath}`);
//   }

//   const workbook = XLSX.readFile(filePath);
//   const sheet = workbook.Sheets[workbook.SheetNames[0]];
//   const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//   if (!rows || rows.length < 2) return [];

//   // Find header row
//   const headerIndex = rows.findIndex(r => r?.some(c => c));
//   const headers = rows[headerIndex];

//   // Map columns based on header text
//   const headerMap = {};
//   headers.forEach((h, idx) => {
//     if (!h) return;
//     const key = h.toString().toLowerCase();
//     if (key.includes("date")) headerMap.date = idx;
//     else if (key.includes("description") || key.includes("particulars") || key.includes("narration")) headerMap.description = idx;
//     else if (key.includes("amount") || key.includes("credit") || key.includes("debit")) headerMap.amount = idx;
//     else if (key.includes("type")) headerMap.type = idx;
//   });

//   let balance = openingBalance;
//   const transactions = [];
//   const categorySummary = {};
//   let totalIncome = 0;
//   let totalExpense = 0;

//   for (let i = headerIndex + 1; i < rows.length; i++) {
//     const row = rows[i];
//     if (!row || row.every(c => !c)) continue;

//     const date = headerMap.date && row[headerMap.date] ? new Date(row[headerMap.date]) : new Date();
//     const description = headerMap.description && row[headerMap.description] ? row[headerMap.description].toString() : `Transaction ${i}`;
//     let amount = headerMap.amount && row[headerMap.amount] ? parseAmount(row[headerMap.amount]) : null;

//     if (amount === null) continue;

//     // Determine type
//     let type = amount < 0 ? "debit" : "credit";
//     if (headerMap.type && row[headerMap.type]) {
//       const t = row[headerMap.type].toString().toLowerCase();
//       if (t.includes("debit")) type = "debit";
//       else if (t.includes("credit")) type = "credit";
//     }

//     const absAmount = Math.abs(amount);
//     balance += type === "credit" ? absAmount : -absAmount;

//     if (type === "credit") totalIncome += absAmount;
//     else totalExpense += absAmount;

//     const category = detectCategory(description);
//     if (type === "debit") {
//       if (!categorySummary[category]) categorySummary[category] = 0;
//       categorySummary[category] += absAmount;
//     }

//     transactions.push({
//       date,
//       description,
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

// // // ✅ Improved amount parsing
// // const parseAmount = (value) => {
// //   if (!value) return null;
// //   let str = value.toString().trim();

// //   // Handle negative in parentheses
// //   let isNegative = false;
// //   if (str.startsWith("(") && str.endsWith(")")) {
// //     isNegative = true;
// //     str = str.slice(1, -1);
// //   }

// //   // Remove commas, currency symbols, and spaces
// //   str = str.replace(/[^0-9.]+/g, "");

// //   const num = parseFloat(str);
// //   if (isNaN(num)) return null;
// //   return isNegative ? -num : num;
// // };

// // const parseXLSX = (filePath, openingBalance = 0) => {
// //   if (!fs.existsSync(filePath)) {
// //     throw new Error(`File not found: ${filePath}`);
// //   }

// //   const workbook = XLSX.readFile(filePath);
// //   const sheet = workbook.Sheets[workbook.SheetNames[0]];
// //   const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// //   if (!rows || rows.length < 2) return [];

// //   // Find header row
// //   let headerIndex = rows.findIndex(r => r?.some(c => c));
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

// //       // Parse date
// //       if (!date) {
// //         const d = new Date(value);
// //         if (!isNaN(d)) date = d;
// //       }

// //       // Parse amount
// //       if (amount === null) {
// //         const num = parseAmount(value);
// //         if (num !== null) amount = num;
// //       }

// //       // Parse description
// //       if (!description && typeof value === "string" && value.length > 3) {
// //         description = value;
// //       }
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
