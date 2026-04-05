import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const socket = io('http://localhost:5000');

const AuctionDetails = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/auctions/${id}`);
        setAuction(data);
      } catch (err) {
        setError('Error fetching auction details.');
      }
    };
    fetchAuction();

    // Socket.io Real-time logic
    socket.emit('join_auction', id);

    socket.on('new_bid', (data) => {
      if (data.auctionId === id) {
        setAuction((prev) => ({ ...prev, currentBid: data.amount, highestBidder: { name: data.bidder } }));
        // Play subtle flash or animation visually when a bid occurs
      }
    });

    return () => {
      socket.emit('leave_auction', id);
      socket.off('new_bid');
    };
  }, [id]);

  const handleBid = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`http://localhost:5000/api/bids/${id}`, { amount: Number(bidAmount) }, config);
      setSuccess('Bid placed successfully!');
      setBidAmount('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place bid');
    }
  };

  if (!auction) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Image Gallery Mockup */}
        <div className="lg:w-1/2">
          <div className="h-96 bg-slate-200 rounded-3xl overflow-hidden glass shadow-xl border border-slate-200">
             {auction.images && auction.images.length > 0 ? (
               <img src={auction.images[0]} alt={auction.title} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-slate-400 text-lg">Image Pending</div>
             )}
          </div>
        </div>

        {/* Auction Details */}
        <div className="lg:w-1/2 flex flex-col justify-center">
          <div className="inline-block px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-sm font-semibold tracking-wide w-max mb-4">
            {auction.status === 'active' ? 'Live Auction' : 'Ended'}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6">{auction.title}</h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            {auction.description}
          </p>

          <div className="glass p-6 rounded-2xl border border-slate-200 mb-8 bg-white/60">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">Current Highest Bid</p>
                {/* Dynamically updating bid text */}
                <p className="text-5xl font-black text-brand-600 transition-all duration-300 transform">
                  ${auction.currentBid}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 font-medium">Highest Bidder</p>
                <p className="font-bold text-slate-900">{auction.highestBidder?.name || 'No bids yet'}</p>
              </div>
            </div>
            <div className="text-sm font-medium text-slate-500 mb-4 pt-4 border-t border-slate-200/60">
              Ends on {new Date(auction.endTime).toLocaleString()}
            </div>

            {auction.status === 'active' && user ? (
              <form onSubmit={handleBid} className="mt-6 flex flex-col sm:flex-row gap-4">
                <input
                  type="number"
                  min={auction.currentBid + 1}
                  required
                  className="input-field text-lg font-bold py-3 bg-white"
                  placeholder={`$${auction.currentBid + 10} or more`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
                <button type="submit" className="btn-primary text-lg font-semibold py-3 px-8 whitespace-nowrap shadow-brand-500/30">
                  Place Bid Now
                </button>
              </form>
            ) : !user ? (
              <div className="mt-6 text-center p-4 bg-slate-100 rounded-lg text-slate-600 font-medium border border-slate-200">
                Please login to place a bid.
              </div>
            ) : auction.status === 'ended' && auction.highestBidder?.name === user.name ? (
              <div className="mt-6">
                 <button onClick={() => window.location.href = `/checkout/${auction._id}`} className="w-full btn-primary text-lg font-semibold py-3 whitespace-nowrap bg-green-500 hover:bg-green-600 shadow-xl shadow-green-500/30">
                  You won! Proceed to Secure Checkout
                </button>
              </div>
            ) : null}

            {error && <div className="mt-4 text-sm font-medium text-red-500 bg-red-50 p-2 rounded-md">{error}</div>}
            {success && <div className="mt-4 text-sm font-medium text-green-500 bg-green-50 p-2 rounded-md">{success}</div>}
          </div>

          <div className="flex items-center text-sm font-medium text-slate-500">
            <span className="bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-slate-700">S</span>
            Listed by {auction.seller?.name || 'Unknown'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;
