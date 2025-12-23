
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
        const num = parseFloat(value.toString().replace(/[^\d.-]/g, ""));
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

