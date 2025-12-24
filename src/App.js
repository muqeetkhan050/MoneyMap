


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './Context/AuthContext';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import Upload from './Pages/Upload';
import Analytics from './Pages/Analytics';  
import Budget from './Pages/Budget';  
import Categories from './Pages/Categories';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = React.useContext(AuthContext);
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Optional redirect component for /budget
function BudgetRedirect() {
  const navigate = React.useNavigate();
  React.useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const res = await fetch('/api/budgets'); // or use your getBudgets API
        const budgets = await res.json();
        if (budgets.length > 0) {
          navigate(`/budget/${budgets[0]._id}`);
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error(err);
        navigate('/dashboard');
      }
    };
    fetchAndRedirect();
  }, [navigate]);

  return <p>Loading budget...</p>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Analytics */}
          <Route path="/analytics" element={<Analytics />} />

          {/* Budget routes */}
          <Route path="/budget" element={<Budget/>} />
 

          {/* Categories */}
          <Route path='/categories' element={<Categories />} />
          
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
