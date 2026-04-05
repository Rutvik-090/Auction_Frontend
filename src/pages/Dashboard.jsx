import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BuyerDashboard = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
        <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest font-bold mb-2">Bids Placed</p>
        <p className="text-4xl font-headline font-black text-on-surface tracking-tighter">42</p>
        <p className="text-secondary text-sm font-bold flex items-center gap-1 mt-4">
          <span className="material-symbols-outlined text-sm">trending_up</span> +12% from last month
        </p>
      </div>

      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-tertiary/10 transition-colors"></div>
        <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest font-bold mb-2">Won Auctions</p>
        <p className="text-4xl font-headline font-black text-on-surface tracking-tighter">18</p>
        <p className="text-on-surface-variant text-sm mt-4 font-medium">Across 4 categories</p>
      </div>

      <div className="bg-primary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/20 transition-colors"></div>
        <p className="text-white/80 font-label text-xs uppercase tracking-widest font-bold mb-2">Total Spent</p>
        <p className="text-4xl font-headline font-black tracking-tighter">$148.5k</p>
        <p className="text-white/80 text-sm mt-4 font-medium">Lifetime Investment</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Active Bids */}
      <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 shadow-lg">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-outline-variant/20">
          <h3 className="font-headline font-black text-xl tracking-tighter">Active Bids</h3>
          <Link to="/browse" className="text-primary font-bold text-sm hover:underline">View All</Link>
        </div>
        <div className="space-y-4">
          {[
            { title: "1950s Lounge Chair", category: "Design Classics", bid: "$4,250", status: "Winning" },
            { title: "Blue Horizon No. 4", category: "Contemporary Art", bid: "$12,000", status: "Outbid" },
            { title: "Patek Philippe Calatrava", category: "Horology", bid: "$89,000", status: "Winning" }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl group hover:bg-surface-container-high transition-all">
              <div>
                <h4 className="font-bold text-on-surface">{item.title}</h4>
                <p className="text-xs text-on-surface-variant">{item.category}</p>
              </div>
              <div className="text-right">
                <p className="font-headline font-black">{item.bid}</p>
                <p className={`text-[10px] uppercase font-bold tracking-widest ${item.status === 'Winning' ? 'text-secondary' : 'text-error'}`}>
                  {item.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Watchlist */}
      <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 shadow-lg">
         <div className="flex items-center justify-between mb-6 pb-6 border-b border-outline-variant/20">
          <h3 className="font-headline font-black text-xl tracking-tighter">Your Watchlist</h3>
          <span className="text-outline text-sm">3 Items</span>
        </div>
        <div className="space-y-4">
          {[
            { title: "Rolex Cosmograph Daytona", category: "Luxury Watches", price: "$42,500" },
            { title: "Serenity in Stone III", category: "Modern Sculpture", price: "$8,900" },
            { title: "Leica M3 Single Stroke", category: "Photography", price: "$2,100" }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-outline-variant/20 rounded-xl">
              <div>
                <h4 className="font-bold text-on-surface">{item.title}</h4>
                <p className="text-xs text-on-surface-variant">{item.category}</p>
              </div>
              <p className="font-headline font-black text-primary">{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const SellerDashboard = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="bg-inverse-surface rounded-3xl p-10 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="relative z-10">
        <h2 className="text-3xl font-headline font-black text-white tracking-tighter mb-2">Welcome back, Curator.</h2>
        <p className="text-surface-container-high font-body">Your portfolio is performing <span className="text-secondary-container font-black">12% above average</span> this month.</p>
      </div>
      <Link to="/create-auction" className="relative z-10 bg-white text-on-surface px-8 py-4 rounded-full font-bold hover:bg-surface-container-high transition-all text-center flex items-center gap-2">
        <span className="material-symbols-outlined text-xl">add</span> Create Listing
      </Link>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/20 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest font-bold mb-2">Active Bidders</p>
          <p className="text-4xl font-headline font-black text-on-surface tracking-tighter">142</p>
        </div>
        <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-inner">
          <span className="material-symbols-outlined text-3xl">group</span>
        </div>
      </div>
      <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/20 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest font-bold mb-2">Items Sold</p>
          <p className="text-4xl font-headline font-black text-on-surface tracking-tighter">12</p>
        </div>
        <div className="text-right">
           <p className="text-primary font-bold">Avg. $3,450/item</p>
        </div>
      </div>
    </div>

    <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-headline font-black text-2xl tracking-tighter">Active Listings</h3>
        <Link to="/admin" className="text-primary font-bold text-sm hover:underline border border-primary/20 px-4 py-2 rounded-full">Manage All</Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-outline-variant/20 rounded-2xl hover:shadow-lg transition-all flex flex-col justify-between group">
          <div>
            <h4 className="font-headline font-black text-xl mb-1 group-hover:text-primary transition-colors">1974 Rolex Daytona Ref. 6263</h4>
            <p className="text-sm text-on-surface-variant mb-6">Original papers, pristine condition.</p>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs uppercase font-label font-bold text-outline">Current Bid</p>
              <p className="font-headline font-black text-2xl text-primary">$18,400</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black headline">24</p>
              <p className="text-xs font-bold text-on-surface-variant uppercase">Bidders</p>
            </div>
          </div>
        </div>

        <div className="p-6 border border-outline-variant/20 rounded-2xl hover:shadow-lg transition-all flex flex-col justify-between group">
          <div>
            <h4 className="font-headline font-black text-xl mb-1 group-hover:text-primary transition-colors">Eames Lounge Chair & Ottoman</h4>
            <p className="text-sm text-on-surface-variant mb-6">Rosewood frame, black leather finish.</p>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs uppercase font-label font-bold text-outline">Current Bid</p>
              <p className="font-headline font-black text-2xl text-primary">$4,250</p>
            </div>
             <div className="text-right">
              <p className="text-xl font-black headline">9</p>
              <p className="text-xs font-bold text-on-surface-variant uppercase">Bidders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('buyer'); // 'buyer' or 'seller'

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12">
      {/* Dashboard Top Tabs */}
      <div className="flex justify-center mb-12">
        <div className="bg-surface-container p-1.5 rounded-full flex gap-2 shadow-inner border border-outline-variant/20">
          <button 
            onClick={() => setActiveTab('buyer')}
            className={`px-10 py-3 rounded-full text-sm font-bold font-headline tracking-wide transition-all ${activeTab === 'buyer' ? 'bg-surface-container-lowest text-on-surface shadow-md border border-outline-variant/10' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Collector Dashboard
          </button>
          <button 
             onClick={() => setActiveTab('seller')}
            className={`px-10 py-3 rounded-full text-sm font-bold font-headline tracking-wide transition-all ${activeTab === 'seller' ? 'bg-surface-container-lowest text-on-surface shadow-md border border-outline-variant/10' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Curator Dashboard
          </button>
        </div>
      </div>

      {/* Render Active Dashboard */}
      {activeTab === 'buyer' ? <BuyerDashboard /> : <SellerDashboard />}
    </div>
  );
};

export default Dashboard;
