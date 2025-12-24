


import React, { useEffect, useState, useContext } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../Context/AuthContext';
import { getOverview } from '../utils/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4567'];

function Categories() {
  const { token } = useContext(AuthContext);
  const [overview, setOverview] = useState(null);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const res = await getOverview();
        setOverview(res.data);

        // Convert categorySpending object to array for pie chart
        const categoriesArray = Object.entries(res.data.categorySpending || {}).map(
          ([name, value]) => ({ name, value })
        );
        setCategoryData(categoriesArray);
      } catch (err) {
        console.error('Error fetching overview:', err);
      }
    }

    fetchOverview();
  }, [token]);

  if (!overview) return <p>Loading overview...</p>;

  const { totalIncome, totalExpense, balance, categoryPercentages, monthlyData, comparison } = overview;

  // Prepare monthly chart data
  const monthlyChartData = Object.entries(monthlyData || {}).map(([month, data]) => ({
    month,
    Income: data.income,
    Expense: data.expense
  }));

  return (
    <div style={{ padding: '20px' }}>
      <h1>Financial Overview</h1>

      {/* Overview Cards */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
        <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '10px' }}>
          <h3>Total Income</h3>
          <p>${totalIncome.toFixed(2)}</p>
        </div>
        <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '10px' }}>
          <h3>Total Expense</h3>
          <p>${totalExpense.toFixed(2)}</p>
        </div>
        <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '10px' }}>
          <h3>Balance</h3>
          <p>${balance.toFixed(2)}</p>
        </div>
        <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '10px' }}>
          <h3>Spent vs Income %</h3>
          <p>{comparison?.spentVsIncomePercent}%</p>
        </div>
      </div>

      {/* Category Pie Chart */}
      <h2>Spending by Category</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={categoryData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      {/* Monthly Income vs Expense Bar Chart */}
      <h2 style={{ marginTop: '40px' }}>Monthly Income vs Expense</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Income" fill="#00C49F" />
          <Bar dataKey="Expense" fill="#FF8042" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Categories;
