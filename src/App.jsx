import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Browse from './pages/Browse';
import CreateAuction from './pages/CreateAuction';
import AuctionDetails from './pages/AuctionDetails';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import { AuthContext } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/create-auction" element={<PrivateRoute><CreateAuction /></PrivateRoute>} />
          <Route path="/auction/:id" element={<AuctionDetails />} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
