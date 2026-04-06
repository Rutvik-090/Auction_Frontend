import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [auctions, setAuctions] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auctions');
        setAuctions(data);
        // Just take the first 4 for the home page mockup
        setTrending(data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    };
    fetchAuctions();
  }, []);

  const featuredAuction = auctions.length > 0 ? auctions[auctions.length - 1] : null;

  const categoryCounts = auctions.reduce((acc, curr) => {
    const cat = curr.category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  
  const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <>
      <main className="max-w-[1600px] mx-auto px-8 pb-24">
        {/* Hero Section: Featured Carousel */}
        <section className="mt-8 mb-16">
          {featuredAuction ? (
            <div className="relative w-full h-[600px] rounded-3xl overflow-hidden bg-surface-container-low group">
              <img 
                alt={featuredAuction.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                src={featuredAuction.images && featuredAuction.images.length > 0 ? featuredAuction.images[0] : 'https://placehold.co/1200x600/e2e8f0/64748b?text=Featured+Auction'} 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-on-surface/80 via-on-surface/40 to-transparent flex flex-col justify-center px-8 sm:px-16">
                <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full mb-6 w-fit">
                  <span className={`w-2 h-2 rounded-full ${featuredAuction.status === 'active' ? 'bg-secondary animate-pulse' : 'bg-outline'}`}></span>
                  <span className="text-xs font-bold tracking-widest uppercase font-label">
                    {featuredAuction.status === 'active' ? 'Live Bidding Now' : 'Featured Collection'}
                  </span>
                </div>
                <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-4 max-w-2xl tracking-tighter shadow-sm">{featuredAuction.title}</h1>
                <p className="text-xl text-surface-container-high mb-8 max-w-xl font-body drop-shadow-md line-clamp-3">{featuredAuction.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <Link to={`/auction/${featuredAuction._id}`} className="bg-gradient-to-r from-primary to-primary-container text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 text-center">
                    View Masterpiece
                  </Link>
                  <div className="flex flex-col">
                    <span className="text-surface-container-high text-xs uppercase font-label tracking-widest drop-shadow-sm">Current High Bid</span>
                    <span className="text-white text-2xl font-black headline tracking-tight drop-shadow-md">
                      ${featuredAuction.currentBid > 0 ? featuredAuction.currentBid.toLocaleString() : featuredAuction.startingBid.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-[600px] rounded-3xl bg-surface-container flex flex-col gap-4 items-center justify-center">
               <span className="material-symbols-outlined text-4xl text-on-surface-variant">hourglass_empty</span>
               <p className="text-on-surface-variant text-xl font-bold">Waiting for auctions to be posted...</p>
            </div>
          )}
        </section>

        {/* Categories: Visual Bento */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black headline tracking-tighter mb-2">Explore Departments</h2>
              <p className="text-on-surface-variant font-body">Navigate through our expertly curated specialty categories.</p>
            </div>
            <Link to="/dashboard" className="hidden sm:flex text-primary font-bold items-center gap-2 hover:gap-3 transition-all">
              View All <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:h-[400px]">
            {topCategories.length > 0 ? topCategories.map(([cat, count], index) => {
              const bgImages = [
                "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1550537687-c9a0ed967fc8?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1611145367651-63028d7a1b41?auto=format&fit=crop&q=80&w=1000"
              ];
              return (
                <Link to="/browse" key={cat} className={`${index === 0 ? 'md:col-span-2' : ''} relative group cursor-pointer overflow-hidden rounded-2xl bg-surface-container h-[200px] md:h-auto`}>
                  <img alt={cat} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={bgImages[index % bgImages.length]} />
                  <div className="absolute inset-0 bg-on-surface/40 flex flex-col justify-end p-8">
                    <h3 className="text-white text-2xl font-black headline">{cat}</h3>
                    <p className="text-white/80 font-body">{count} {count === 1 ? 'Item' : 'Items'}</p>
                  </div>
                </Link>
              );
            }) : (
              <div className="md:col-span-4 p-12 text-center text-on-surface-variant bg-surface-container rounded-2xl">
                Start listing auctions to populate categories.
              </div>
            )}
          </div>
        </section>

        {/* Trending Auctions Grid */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black headline tracking-tighter">Trending Now</h2>
            <Link to="/dashboard" className="text-primary font-bold hover:underline">Explore More</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trending.map((auction) => (
              <Link key={auction._id} to={`/auction/${auction._id}`} className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-lg border border-outline-variant/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="relative h-64 overflow-hidden rounded-xl m-4 bg-surface-container">
                  {auction.images && auction.images.length > 0 ? (
                    <img src={auction.images[0]} alt={auction.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-outline bg-surface-container-low transition-transform duration-500 group-hover:scale-110">
                       <span className="material-symbols-outlined text-4xl mb-2 opacity-50">image</span>
                       <span className="text-xs font-label">No preview</span>
                    </div>
                  )}
                  
                  <div className={`absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 ${auction.status !== 'active' ? 'opacity-70' : ''}`}>
                    <span className={`w-2 h-2 rounded-full ${auction.status === 'active' ? 'bg-secondary animate-pulse' : 'bg-outline'}`}></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest font-label">{auction.status === 'active' ? 'Active' : 'Ended'}</span>
                  </div>
                </div>
                
                <div className="px-6 pb-6">
                  <h4 className="text-lg font-black headline tracking-tight mb-4 line-clamp-1">{auction.title}</h4>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-on-surface-variant font-label">Current Bid</p>
                      <p className="text-xl font-black headline text-primary">${auction.currentBid}</p>
                    </div>
                    <div className="bg-secondary-container/30 text-secondary px-4 py-2 rounded-full text-sm font-bold font-label group-hover:bg-secondary group-hover:text-white transition-all border border-secondary/20">
                      View lot &rarr;
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {trending.length === 0 && (
              <p className="col-span-4 text-center py-10 text-on-surface-variant">No trending auctions available yet.</p>
            )}
          </div>
        </section>

        {/* Premium Experience Banner */}
        <section className="bg-inverse-surface rounded-3xl p-8 sm:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
          <div className="relative z-10 md:w-1/2">
            <h2 className="text-4xl font-black text-white headline tracking-tighter mb-6">List Your Collection with The Authority</h2>
            <p className="text-surface-container-high font-body text-lg mb-8">Our white-glove curation service handles everything from authentication to final delivery. Experience the highest sell-through rates in the digital market.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/create-auction" className="bg-white text-on-surface px-8 py-4 rounded-full font-bold hover:bg-surface-container-high transition-all text-center">Start Selling</Link>
              <button className="border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all">View Seller Guide</button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center relative w-full overflow-hidden sm:overflow-visible">
            <div className="w-72 h-72 rounded-full bg-primary/20 blur-3xl absolute top-0"></div>
            <img alt="Seller Support" className="w-[80%] md:w-full max-w-sm rounded-2xl shadow-2xl relative z-10 rotate-3 transition-transform duration-500 hover:rotate-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVGjHTJg3pnyqWNgYVRP91OFoSCXyXxxoHbagKYqrs7Ie81acWb7Xz-zuTe2V95uB7_ON6ZHg1G0-9s7Jr6NpEs_9_BPsJUzQC3aCs-j25BikFtROXz9bYec8NNCzFKhJ9uwMssIPMnJYWvVKp-5ZxOYyEhMSpN_D4q-H_mIo6peB9zYrSSD0KNT7yaP-ldQbCZS8LwH7BQQAtouOTjqwmQoLICsU1-40Hemlc99H3XUNMVaeLX_PLhG71e5FOCuGn4jZt5GSyGO0" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low pt-20 pb-12 border-t border-outline-variant/10 mt-12">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="flex flex-col justify-center items-center gap-6">
            <span className="text-2xl font-black text-[#3525cd] tracking-tighter headline">The Auction Curator</span>
            <span className="text-sm text-outline">© 2024 The Auction Curator. All Rights Reserved.</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
