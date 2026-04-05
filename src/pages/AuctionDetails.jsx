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
  const [bidHistory, setBidHistory] = useState([]); // Mocking live history
  const [liveToast, setLiveToast] = useState(null);
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

    socket.emit('join_auction', id);

    socket.on('new_bid', (data) => {
      if (data.auctionId === id) {
        setAuction((prev) => ({ ...prev, currentBid: data.amount, highestBidder: { name: data.bidder } }));
        setLiveToast(`New bid placed! ${data.bidder} just bid $${data.amount}`);
        setTimeout(() => setLiveToast(null), 5000);
        
        setBidHistory((prev) => [
          { bidder: data.bidder, amount: data.amount, time: 'Just now' },
          ...prev
        ]);
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

  if (!auction) return <div className="text-center py-20 text-on-surface-variant font-body">Loading...</div>;

  return (
    <main className="max-w-[1440px] mx-auto px-8 py-12">
      {/* Live Alert Notification */}
      {liveToast && (
        <div className="fixed top-24 right-8 z-[60] flex items-center gap-4 bg-secondary-container text-on-secondary-container px-6 py-4 rounded-xl shadow-xl border border-secondary/10 animate-bounce">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
          <div>
            <p className="font-bold text-sm">New bid placed!</p>
            <p className="text-xs opacity-80">{liveToast}</p>
          </div>
          <button className="ml-4 opacity-50 hover:opacity-100" onClick={() => setLiveToast(null)}>
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Gallery Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative group aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-lowest">
            {auction.images && auction.images.length > 0 ? (
               <img src={auction.images[0]} alt={auction.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-outline text-lg bg-surface-container">Image Pending</div>
             )}
            
            <div className="absolute top-6 left-6 flex gap-2">
              {auction.status === 'active' && (
                <span className="bg-primary/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  LIVE AUCTION
                </span>
              )}
              <span className="bg-surface-container-lowest/90 backdrop-blur-md text-on-surface px-4 py-2 rounded-full text-xs font-bold shadow-sm inline-block">
                LOT #{auction._id.slice(-4).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Auction Details */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <section className="space-y-4">
            <nav className="flex items-center gap-2 text-on-surface-variant text-sm font-medium mb-4">
              <span>Gallery</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary">Masterpieces</span>
            </nav>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {auction.title}
            </h1>
            <p className="text-on-surface-variant leading-relaxed font-light text-lg">
              {auction.description}
            </p>
          </section>

          <div className="flex items-center justify-between p-6 bg-surface-container-low rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center font-bold text-primary">
                {auction.seller?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm">{auction.seller?.name || 'Unknown Curator'}</span>
                  <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <div className="flex items-center gap-1 text-tertiary">
                   <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                   <span className="text-xs font-bold tracking-wide">Premium Seller</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bidding Interface */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_32px_64px_-16px_rgba(53,37,205,0.08)] space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            
            <div className="grid grid-cols-2 gap-8 relative">
              <div className="space-y-1">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Current Bid</span>
                <div className="text-4xl font-headline font-black text-primary">${auction.currentBid}</div>
                {auction.highestBidder?.name && (
                   <span className="text-xs text-secondary font-semibold">Highest: {auction.highestBidder.name}</span>
                )}
              </div>
              <div className="space-y-1 text-right">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{auction.status === 'active' ? 'Ends On' : 'Ended On'}</span>
                <div className="text-xl font-headline font-bold text-tertiary tabular-nums tracking-tight mt-1">
                  {new Date(auction.endTime).toLocaleDateString()}
                </div>
                <span className="text-xs text-on-surface-variant">{new Date(auction.endTime).toLocaleTimeString()}</span>
              </div>
            </div>

            {auction.status === 'active' && user ? (
              <form onSubmit={handleBid} className="space-y-4">
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">$</span>
                  <input
                    type="number"
                    min={auction.currentBid + 1}
                    required
                    className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary focus:ring-0 rounded-full py-5 pl-10 pr-6 text-lg font-bold transition-all placeholder:font-normal placeholder:opacity-50"
                    placeholder={`Enter bid ($${auction.currentBid + 10} or more)`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                  />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-[#3525cd] to-[#4f46e5] text-white py-5 rounded-full font-headline font-extrabold text-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all">
                  Place Bid
                </button>
                <p className="text-[10px] text-center text-on-surface-variant uppercase tracking-tighter opacity-60">By bidding, you agree to our terms of service</p>
              </form>
            ) : !user ? (
               <div className="mt-6 text-center p-4 bg-surface-container-high rounded-xl text-on-surface-variant font-medium border border-outline-variant/20 shadow-inner">
                Please login to place a bid.
              </div>
            ) : auction.status === 'ended' && auction.highestBidder?.name === user.name ? (
              <div className="mt-6">
                 <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-headline font-bold text-lg py-5 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all" onClick={() => alert('Razorpay integration pending!')}>
                  You won! Proceed to Pay with Razorpay
                </button>
              </div>
            ) : null}

            {error && <div className="mt-4 text-sm font-medium text-error bg-error-container p-3 rounded-md">{error}</div>}
            {success && <div className="mt-4 text-sm font-medium text-secondary bg-secondary-container p-3 rounded-md">{success}</div>}
          </div>

        </div>
      </div>
    </main>
  );
};

export default AuctionDetails;
