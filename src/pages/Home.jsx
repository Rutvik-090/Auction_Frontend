import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auctions');
        // Just take the first 4 for the home page mockup
        setTrending(data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching trending auctions:', error);
      }
    };
    fetchTrending();
  }, []);

  return (
    <>
      <main className="max-w-[1600px] mx-auto px-8 pb-24">
        {/* Hero Section: Featured Carousel */}
        <section className="mt-8 mb-16">
          <div className="relative w-full h-[600px] rounded-3xl overflow-hidden bg-surface-container-low group">
            <img 
              alt="Main Featured Auction" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzHjxTnsxM0t7MrrH3Yb4-LrQ_taS6ZF1FeESRSXDxVi3HzTiUjKglITq3XjQ3FH4xs7ZNF0TrYigq9kQm-aSbHogppw5wn4d1WMRJ372FbQa_HsGwlpQOkxK7PFnV0YeHUZwIIKO2EASg6l1W9MQTIF2XEiXlJCiOrFB8okh5w5wJHZg5q-VW5zylb9atoUeXNpznZhJWihlBDuPRvrkPK-uje3-Ngnb9abmzGFEqxOLMBEZcweGsFV6Q7tNGolP5cO9_f3GzUiU" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-on-surface/80 via-on-surface/40 to-transparent flex flex-col justify-center px-8 sm:px-16">
              <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full mb-6 w-fit">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="text-xs font-bold tracking-widest uppercase font-label">Live Bidding Now</span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-4 max-w-2xl tracking-tighter shadow-sm">The Vanguard Collection: Contemporary Masterpieces</h1>
              <p className="text-xl text-surface-container-high mb-8 max-w-xl font-body drop-shadow-md">Exclusive access to primary market releases from emerging global talents. Curated for the discerning collector.</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <Link to="/dashboard" className="bg-gradient-to-r from-primary to-primary-container text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 text-center">
                  Explore Gallery
                </Link>
                <div className="flex flex-col">
                  <span className="text-surface-container-high text-xs uppercase font-label tracking-widest drop-shadow-sm">Current High Bid</span>
                  <span className="text-white text-2xl font-black headline tracking-tight drop-shadow-md">$14,500</span>
                </div>
              </div>
            </div>
          </div>
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
            <div className="md:col-span-2 relative group cursor-pointer overflow-hidden rounded-2xl bg-surface-container h-[300px] md:h-auto">
              <img alt="Fine Art" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAafJlYslHCWRsEt_5bpeqNwlWpO3E52G0Pi22R7C4QSiscH2Oq5LWInopQHpire3cHz60m--3VQa_Ws8LHGJRewrL1g0RyOwaiHUEnfWrc1Dqt2iJfJfMOXKo4YO4LSJEu6EjJl2FPBn059uN2UYPstAx__iAlD9mFST8At2B5PL7WGi9HmpUQmFHeQEbjEiIGtSN2PysZKuuF7_ww22UpI3TftGMNfgW21mdWjPnujIxwAFaTOp0RAGHYwxkygvpQX8Ni15DRKrQ" />
              <div className="absolute inset-0 bg-on-surface/40 flex flex-col justify-end p-8">
                <h3 className="text-white text-3xl font-black headline">Fine Art</h3>
                <p className="text-white/80 font-body">1,240 Items</p>
              </div>
            </div>
            <div className="relative group cursor-pointer overflow-hidden rounded-2xl bg-surface-container h-[200px] md:h-auto">
              <img alt="Tech &amp; Gadgets" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlL1ocL1a2sTlh3or_FQXFbiJTID3aULgkUS85spBjFiVKnHgZPerWFYS12FOdx7uchW3AOztbTLN4wIcaADMtxEBzhoim9nSwbXVuwFd6w0nhaLrXZYLKiIylqh5ItfFV_phyLLE7n0BsroMBWiHP3VsUnh3zdfJyHwqM5Me6nimlZfADtAzkttnS9J_TpblRKfmdx0dflbdxTfhL1BXDKNU6usPnelfFHQCTwAHHMivg9zlko1ZIQO3yWSHh8QJWJsMzd451IbA" />
              <div className="absolute inset-0 bg-on-surface/40 flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-black headline">Tech &amp; Innovation</h3>
                <p className="text-white/80 font-body">480 Items</p>
              </div>
            </div>
            <div className="relative group cursor-pointer overflow-hidden rounded-2xl bg-surface-container h-[200px] md:h-auto">
              <img alt="Collectibles" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1d06cC-EGP4mmIUbJX9Alub8qshj7WsOHskAxW_ctfOESVglVbbxeTWE81hwyEzHXvmN3pSHhZ5Jjb3JxeIBLA-XGZEuwEKOxAL_wtLO8Mtcx6lhuOZA7MIyUxdacRfL4gK63Of3DBqPvKF3vx5UftgWB9dlllfkre2ffMIyJJ-GaDuQWx2yIkkRdtxkR-a4I5MQdiaU_GcybR1wYF8Xo-MdkpXPL57eUO4wmNm2awU1U6tQRNGGKd6_ZwywgJxft9zdPUHvH-IA" />
              <div className="absolute inset-0 bg-on-surface/40 flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-black headline">Collectibles</h3>
                <p className="text-white/80 font-body">892 Items</p>
              </div>
            </div>
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
