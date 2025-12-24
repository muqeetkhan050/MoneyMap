

// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { AuthContext } from '../Context/AuthContext';
// import { getBudget } from '../utils/api';
// import './Budget.css';

// function Budget() {
//   const { logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const { budgetId } = useParams();

//   const [budgetData, setBudgetData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchBudget = async () => {
//       try {
//         setLoading(true);

//         let id = budgetId;

//         // If no budgetId in URL, fetch all budgets and use the first one
//         if (!id) {
//           const allBudgets = await getBudget();
//           if (!allBudgets.data || allBudgets.data.length === 0) {
//             setError('No budgets found');
//             return;
//           }
//           id = allBudgets.data[0]._id;
//         }

//         const res = await getBudget(id);
//         setBudgetData(res.data);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to load budget');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBudget();
//   }, [budgetId]);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   if (loading) {
//     return <div className="budget-loading">Loading budget...</div>;
//   }

//   if (error) {
//     return (
//       <div className="budget-error">
//         <p>{error}</p>
//         <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
//       </div>
//     );
//   }

//   const { budgetLimit, spent, remaining } = budgetData || {};

//   return (
//     <div className="budget-page">
//       <header className="budget-header">
//         <h2>Budget Overview</h2>
//         <button onClick={handleLogout} className="logout-btn">
//           Logout
//         </button>
//       </header>

//       <div className="budget-cards">
//         <div className="budget-card total">
//           <h3>Budget Limit</h3>
//           <p>₹{budgetLimit?.toLocaleString() || 0}</p>
//         </div>

//         <div className="budget-card spent">
//           <h3>Spent</h3>
//           <p>₹{spent?.toLocaleString() || 0}</p>
//         </div>

//         <div className="budget-card remaining">
//           <h3>Remaining</h3>
//           <p>₹{remaining?.toLocaleString() || 0}</p>
//         </div>
//       </div>

//       <div className="budget-progress">
//         <h3>Progress</h3>
//         <div className="progress-bar-container">
//           <div
//             className="progress-bar"
//             style={{
//               width: budgetLimit
//                 ? `${Math.min((spent / budgetLimit) * 100, 100)}%`
//                 : '0%',
//             }}
//           ></div>
//         </div>
//         <p>{budgetLimit ? `${((spent / budgetLimit) * 100).toFixed(2)}% used` : '0%'}</p>
//       </div>

//       <div className="budget-actions">
//         <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
//       </div>
//     </div>
//   );
// }

// export default Budget;


import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { getTransactions } from '../utils/api';
import './Budget.css';

function Budget() {
  const { logout, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await getTransactions(); // fetch all user transactions
        setTransactions(res.data || []);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div className="budget-loading">Loading budget...</div>;

  // Calculate budget stats
  const budgetLimit = transactions.reduce((sum, t) => sum + (t.type === 'debit' ? t.amount : 0), 0) + 50000; // example total budget
  const spent = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
  const remaining = budgetLimit - spent;

  return (
    <div className="budget-page">
      <header className="budget-header">
        <h2>Budget Overview</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <div className="budget-cards">
        <div className="budget-card total">
          <h3>Budget Limit</h3>
          <p>₹{budgetLimit.toLocaleString()}</p>
        </div>

        <div className="budget-card spent">
          <h3>Spent</h3>
          <p>₹{spent.toLocaleString()}</p>
        </div>

        <div className="budget-card remaining">
          <h3>Remaining</h3>
          <p>₹{remaining.toLocaleString()}</p>
        </div>
      </div>

      <div className="budget-progress">
        <h3>Progress</h3>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: budgetLimit ? `${Math.min((spent / budgetLimit) * 100, 100)}%` : '0%' }}
          ></div>
        </div>
        <p>{budgetLimit ? `${((spent / budgetLimit) * 100).toFixed(2)}% used` : '0%'}</p>
      </div>

      <div className="budget-actions">
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    </div>
  );
}

export default Budget;
