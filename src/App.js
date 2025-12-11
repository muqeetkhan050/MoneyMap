

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, AuthContext } from './Context/AuthContext';
// import Main from './Main';
// import Login from './Pages/Login';
// import Signup from './Pages/Signup';
// import Dashboard from './Pages/Dashboard';
// import Upload from './Pages/Upload';

// // Protected Route Component
// function ProtectedRoute({ children }) {
//   const { isAuthenticated, loading } = React.useContext(AuthContext);
  
//   if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         Loading...
//       </div>
//     );
//   }
  
//   return isAuthenticated ? children : <Navigate to="/login" />;
// }

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Main />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route 
//             path="/dashboard" 
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/upload" 
//             element={
//               <ProtectedRoute>
//                 <Upload />
//               </ProtectedRoute>
//             } 
//           />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }


// export default App;



import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './Context/AuthContext';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import Upload from './Pages/Upload';

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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
