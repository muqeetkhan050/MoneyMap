import React, { useEffect, useState, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';
import { AuthContext } from '../Context/AuthContext';
import { getTransactions } from '../utils/api';
import './Analytics.css';

function Analytics() {
  const { token } = useContext(AuthContext);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await getTransactions();
        const transactions = res.data || [];

        // Aggregate transactions by date
        const dataMap = {};
        transactions.forEach(t => {
          const date = new Date(t.date).toLocaleDateString(); // "12/25/2025"
          if (!dataMap[date]) {
            dataMap[date] = { date, income: 0, expense: 0 };
          }
          if (t.type === 'credit') dataMap[date].income += t.amount;
          else if (t.type === 'debit') dataMap[date].expense += t.amount;
        });

        // Convert to array, set expenses as negative for chart
        const sortedData = Object.values(dataMap)
          .map(d => ({ ...d, expense: -d.expense }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setChartData(sortedData);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

  if (loading) return <p className="loading-text">Loading analytics...</p>;

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">Daily Cashflow</h1>
      <div className="chart-card">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => `₹${Math.abs(value).toLocaleString()}`} />
            <Bar dataKey="income" fill="#4CAF50" name="Income">
              <LabelList dataKey="income" position="top" formatter={(val) => `₹${val.toLocaleString()}`} />
            </Bar>
            <Bar dataKey="expense" fill="#F44336" name="Expense">
              <LabelList dataKey="expense" position="bottom" formatter={(val) => `₹${Math.abs(val).toLocaleString()}`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;
