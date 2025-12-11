import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { getOverview, getTransactions } from '../utils/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [overviewRes, transactionsRes] = await Promise.all([
        getOverview(),
        getTransactions()
      ]);
      
      setOverview(overviewRes.data);
      setTransactions(transactionsRes.data);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your financial data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  const categoryData = Object.entries(overview?.categorySpending || {}).map(([name, value]) => ({
    name,
    value: Math.round(value)
  }));

  const monthlyData = Object.entries(overview?.monthlyData || {}).map(([month, data]) => ({
    month,
    income: Math.round(data.income),
    expense: Math.round(data.expense)
  }));

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#fa709a', '#fee140', '#30cfd0'];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>MoneyMap</h1>
          <div className="header-actions">
            <span className="user-name">Hello, {user?.name}!</span>
            <button className="upload-btn" onClick={() => navigate('/upload')}>
              Upload Statement
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="cards-grid">
          <div className="stat-card income">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <p className="card-label">Total Income</p>
              <h2 className="card-value">₹{overview?.totalIncome?.toLocaleString() || 0}</h2>
            </div>
          </div>

          <div className="stat-card expense">
            <div className="card-icon">💸</div>
            <div className="card-content">
              <p className="card-label">Total Expenses</p>
              <h2 className="card-value">₹{overview?.totalExpense?.toLocaleString() || 0}</h2>
            </div>
          </div>

          <div className="stat-card balance">
            <div className="card-icon">💵</div>
            <div className="card-content">
              <p className="card-label">Balance</p>
              <h2 className="card-value">₹{overview?.balance?.toLocaleString() || 0}</h2>
            </div>
          </div>

          <div className="stat-card transactions">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <p className="card-label">Total Transactions</p>
              <h2 className="card-value">{overview?.transactionCount || 0}</h2>
            </div>
          </div>
        </div>

        {categoryData.length > 0 && (
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Spending by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Monthly Income vs Expenses</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" />
                  <Bar dataKey="expense" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="transactions-section">
          <h3>Recent Transactions</h3>
          <div className="transactions-table">
            {transactions.length === 0 ? (
              <div className="empty-state">
                <p>No transactions yet</p>
                <button onClick={() => navigate('/upload')}>
                  Upload Bank Statement
                </button>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Type</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.slice(0, 10).map((transaction) => (
                    <tr key={transaction._id}>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>{transaction.description}</td>
                      <td>
                        <span className="category-badge">{transaction.category}</span>
                      </td>
                      <td className={transaction.type === 'credit' ? 'amount-credit' : 'amount-debit'}>
                        ₹{transaction.amount.toLocaleString()}
                      </td>
                      <td>
                        <span className={`type-badge ${transaction.type}`}>
                          {transaction.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
