import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [auctions, setAuctions] = useState([]);

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auctions');
        setAuctions(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 glass rounded-xl border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-500 uppercase">Total Auctions</h3>
          <p className="text-4xl font-black text-brand-600 mt-2">{auctions.length}</p>
        </div>
        <div className="p-6 glass rounded-xl border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-500 uppercase">Active Auctions</h3>
          <p className="text-4xl font-black text-green-500 mt-2">
            {auctions.filter(a => a.status === 'active').length}
          </p>
        </div>
        <div className="p-6 glass rounded-xl border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-500 uppercase">System Status</h3>
          <p className="text-2xl font-bold text-slate-800 mt-2 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span> Operational
          </p>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Seller</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Highest Bid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {auctions.map((auction) => (
              <tr key={auction._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{auction.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{auction.seller?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${auction.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                    {auction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${auction.currentBid}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-red-600 hover:text-red-900">Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
