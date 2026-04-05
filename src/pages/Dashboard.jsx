import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auctions');
        setAuctions(data);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  if (loading) return <div>Loading auctions...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Live Auctions</h2>
        <Link to="/create-auction" className="btn-primary">
          Create Auction
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {auctions.map((auction) => (
          <Link key={auction._id} to={`/auction/${auction._id}`} className="group block">
            <div className="glass hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden border border-slate-200 flex flex-col h-full bg-white transform group-hover:-translate-y-1">
              <div className="relative">
                <div className="h-48 w-full bg-slate-200 overflow-hidden">
                  {auction.images && auction.images.length > 0 ? (
                    <img src={auction.images[0]} alt={auction.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-brand-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {auction.status === 'active' ? 'Live' : 'Ended'}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="font-semibold text-slate-500 text-sm mb-1">{auction.seller?.name}</div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                  {auction.title}
                </h3>
                <div className="mt-auto pt-4 flex justify-between items-end">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Current Bid</div>
                    <div className="text-2xl font-bold text-slate-900">${auction.currentBid}</div>
                  </div>
                  <div className="text-sm font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded-md">
                    Bid Now &rarr;
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {auctions.length === 0 && (
          <div className="col-span-full text-center py-20 text-slate-500">
            No active auctions right now. Create one!
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
