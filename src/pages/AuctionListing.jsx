import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AuctionListing = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtering States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'active', 'ended'
  const [endingSoonOnly, setEndingSoonOnly] = useState(false);
  const [groupCategories, setGroupCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  // Added sort option based on UI
  const [sortOption, setSortOption] = useState("Ending Soonest");

  const [dynamicCategories, setDynamicCategories] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const [auctionsRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/auctions"),
          axios.get("http://localhost:5000/api/categories"),
        ]);
        setAuctions(auctionsRes.data);
        setDynamicCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  const handleCategoryToggle = (cat) => {
    setGroupCategories((prev) => {
      if (prev.includes(cat)) {
        return prev.filter((c) => c !== cat);
      }
      return [...prev, cat];
    });
  };

  const filteredAuctions = auctions
    .filter((auction) => {
      // 1. Search Matching (if added to logic)
      const matchesSearch = auction.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // 2. Status Matching
      const matchesStatus =
        filterStatus === "all" || auction.status === filterStatus;

      // 3. Category Matching
      const matchesCategory =
        groupCategories.length === 0 ||
        groupCategories.includes(auction.category);

      // 4. Price Matching
      const activePrice =
        auction.currentBid > 0 ? auction.currentBid : auction.startingBid;
      const meetsMin = minPrice === "" || activePrice >= parseFloat(minPrice);
      const meetsMax = maxPrice === "" || activePrice <= parseFloat(maxPrice);

      // 5. Ending Soon
      const distanceToEnds = new Date(auction.endTime).getTime() - Date.now();
      const isEndingSoon =
        distanceToEnds <= 48 * 60 * 60 * 1000 && distanceToEnds > 0;
      const matchesEndingSoon =
        !endingSoonOnly || (auction.status === "active" && isEndingSoon);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        meetsMin &&
        meetsMax &&
        matchesEndingSoon
      );
    })
    .sort((a, b) => {
      let priceA = a.currentBid > 0 ? a.currentBid : a.startingBid;
      let priceB = b.currentBid > 0 ? b.currentBid : b.startingBid;
      if (sortOption === "Price: Low to High") return priceA - priceB;
      if (sortOption === "Price: High to Low") return priceB - priceA;
      return 0; // default / Ending soonest
    });

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setEndingSoonOnly(false);
    setGroupCategories([]);
    setMinPrice("");
    setMaxPrice("");
  };

  if (loading)
    return (
      <div className="text-center py-40 text-on-surface-variant font-body animate-pulse">
        Loading curated gallery...
      </div>
    );

  return (
    <>
      <div className="flex min-h-screen bg-surface">
        {/* Sidebar */}
        <aside className="h-full w-64 pt-8 bg-[#f2f3ff] dark:bg-slate-900 flex flex-col gap-1 py-6 border-r-0 z-10 hidden lg:flex rounded-tr-3xl">
          <div className="px-6 py-4 flex flex-col gap-6">
            {/* Search (added for completeness with previous feature) */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 font-headline flex justify-between">
                Search
                {(searchTerm ||
                  groupCategories.length > 0 ||
                  minPrice ||
                  maxPrice ||
                  filterStatus !== "all") && (
                  <button
                    onClick={clearFilters}
                    className="text-primary hover:underline text-[10px]"
                  >
                    Clear
                  </button>
                )}
              </h3>
              <input
                type="text"
                placeholder="Search titles..."
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-2 px-3 text-sm focus:border-primary outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 font-headline">
                Category
              </h3>
              <div className="space-y-3">
                {dynamicCategories.map((catItem) => {
                  const catName = catItem.name;
                  return (
                    <label
                      key={catItem._id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        checked={groupCategories.includes(catName)}
                        onChange={() => handleCategoryToggle(catName)}
                        className="rounded border-outline-variant text-primary focus:ring-primary h-5 w-5 cursor-pointer"
                        type="checkbox"
                      />
                      <span
                        className={`text-sm font-medium transition-colors ${groupCategories.includes(catName) ? "text-primary font-bold" : "text-on-surface group-hover:text-primary"}`}
                      >
                        {catName}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 font-headline">
                Price Range
              </h3>
              <div className="space-y-4">
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-2 px-2 text-xs font-medium focus:border-primary outline-none text-center"
                  />
                  <span className="text-outline text-xs">-</span>
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-2 px-2 text-xs font-medium focus:border-primary outline-none text-center"
                  />
                </div>
              </div>
            </div>

            {/* Condition - Visual Only for UI fidelity */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 font-headline">
                Condition
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-xs font-semibold cursor-pointer">
                  Mint
                </span>
                <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant rounded-full text-xs font-semibold cursor-pointer hover:bg-primary-fixed transition-colors">
                  Excellent
                </span>
                <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant rounded-full text-xs font-semibold cursor-pointer hover:bg-primary-fixed transition-colors">
                  Good
                </span>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 font-headline">
                Status
              </h3>

              <div className="mb-4 bg-error-container/30 border border-error/20 p-3 rounded-xl hover:bg-error-container/50 transition-colors">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    checked={endingSoonOnly}
                    onChange={(e) => setEndingSoonOnly(e.target.checked)}
                    className="rounded border-outline-variant text-error focus:ring-error h-5 w-5 cursor-pointer accent-error"
                    type="checkbox"
                  />
                  <span
                    className={`text-sm font-medium transition-colors ${endingSoonOnly ? "text-error font-black tracking-tight" : "text-on-surface group-hover:text-error"}`}
                  >
                    Ends within 48 Hrs 🔥
                  </span>
                </label>
              </div>

              <div className="flex gap-2 p-1 bg-surface-container-high rounded-xl">
                <button
                  onClick={() => setFilterStatus("active")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${filterStatus === "active" ? "bg-surface-container-lowest shadow-sm text-primary" : "text-on-surface-variant hover:bg-surface-container-highest"}`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus("ended")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${filterStatus === "ended" ? "bg-surface-container-lowest shadow-sm text-primary" : "text-on-surface-variant hover:bg-surface-container-highest"}`}
                >
                  Ended
                </button>
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${filterStatus === "all" ? "bg-surface-container-lowest shadow-sm text-primary" : "text-on-surface-variant hover:bg-surface-container-highest"}`}
                >
                  All
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full p-6 md:p-8 bg-surface">
          <section className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
              <div>
                <span className="text-primary font-bold text-sm tracking-widest uppercase">
                  Live Curator Collection
                </span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-2 text-on-surface headline">
                  Discover Masterpieces
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative group">
                  <label className="text-[10px] absolute -top-2 left-3 bg-surface px-1 font-bold text-on-surface-variant uppercase tracking-tighter z-10">
                    Sort By
                  </label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 pr-10 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none cursor-pointer"
                  >
                    <option>Ending Soonest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Most Popular</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {filteredAuctions.length === 0 ? (
              <div className="py-24 text-center border-2 border-dashed border-outline-variant/30 rounded-3xl bg-surface-container-lowest">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-4 bg-surface-container p-4 rounded-full">
                  search_off
                </span>
                <p className="text-xl headline font-black text-on-surface tracking-tighter mt-4">
                  No collections found.
                </p>
                <p className="text-on-surface-variant font-body max-w-md mx-auto mt-2">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredAuctions.map((auction) => {
                  const isActive = auction.status === "active";
                  const activePrice =
                    auction.currentBid > 0
                      ? auction.currentBid
                      : auction.startingBid;
                  return (
                    <Link
                      key={auction._id}
                      to={`/auction/${auction._id}`}
                      className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_8px_32px_0_rgba(19,27,46,0.04)] hover:shadow-[0_12px_48px_0_rgba(19,27,46,0.08)] transition-all duration-300 block"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-high rounded-t-xl">
                        {auction.images && auction.images.length > 0 ? (
                          <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src={auction.images[0]}
                            alt={auction.title}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-surface-container-high text-outline group-hover:scale-105 transition-transform duration-500">
                            <span className="material-symbols-outlined text-4xl opacity-50">
                              image
                            </span>
                          </div>
                        )}

                        <div
                          className={`absolute top-4 left-4 bg-secondary-container/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 ${!isActive && "opacity-60 grayscale"}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${isActive ? "bg-secondary animate-pulse" : "bg-outline-variant"}`}
                          ></span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-on-secondary-container">
                            {isActive ? "Live Bidding" : "Ended"}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold font-headline text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                            {auction.title}
                          </h3>
                        </div>
                        <p className="text-sm text-on-surface-variant mb-6 line-clamp-1">
                          {auction.category || "Uncategorized Asset"}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-surface-container-low p-3 rounded-xl">
                            <span className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">
                              Current Bid
                            </span>
                            <span className="text-lg font-black font-mono text-primary">
                              ₹{activePrice.toLocaleString()}
                            </span>
                          </div>
                          <div
                            className={`p-3 rounded-xl border ${isActive ? "bg-tertiary-container/10 border-tertiary/10" : "bg-surface-container border-outline/10"}`}
                          >
                            <span
                              className={`block text-[10px] uppercase font-bold mb-1 ${isActive ? "text-tertiary" : "text-outline"}`}
                            >
                              Status
                            </span>
                            <span
                              className={`text-lg font-black font-headline ${isActive ? "text-tertiary" : "text-outline"}`}
                            >
                              {isActive ? "Active" : "Closed"}
                            </span>
                          </div>
                        </div>

                        <button
                          className={`w-full py-4 rounded-full font-bold shadow-lg active:scale-[0.98] transition-all ${isActive ? "bg-gradient-to-r from-primary to-primary-container text-white shadow-primary/20 hover:shadow-primary/40" : "bg-surface-container-high text-on-surface-variant cursor-not-allowed"}`}
                        >
                          {isActive ? "Place Bid" : "View Details"}
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {filteredAuctions.length > 0 && (
              <div className="mt-20 flex flex-col items-center gap-6 pb-12">
                <p className="text-on-surface-variant text-sm font-medium">
                  Displaying {filteredAuctions.length} exclusive lots
                </p>
                <button className="group px-8 py-4 bg-surface-container-high hover:bg-primary-fixed text-on-surface-variant hover:text-on-primary-fixed-variant rounded-full font-bold transition-all duration-300 flex items-center gap-2">
                  Load More Auctions
                  <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">
                    keyboard_arrow_down
                  </span>
                </button>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-transparent pt-16 pb-8 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-black text-primary tracking-tighter block mb-6 headline">
              The Auction Curator
            </span>
            <p className="text-on-surface-variant max-w-sm mb-8 leading-relaxed">
              The premier destination for the world's most exceptional assets.
              Our curated platform connects discerning collectors with
              masterpieces of history, art, and engineering.
            </p>
            <div className="flex gap-4">
              <a
                className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined">share</span>
              </a>
              <a
                className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined">mail</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold font-headline text-on-surface mb-6 uppercase tracking-widest text-xs">
              Navigation
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Active Auctions
                </a>
              </li>
              <li>
                <a
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Private Treaty Sales
                </a>
              </li>
              <li>
                <a
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Collector's Journal
                </a>
              </li>
              <li>
                <a
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Sell with Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold font-headline text-on-surface mb-6 uppercase tracking-widest text-xs">
              Curator Trust
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Authenticity Guarantee
                </a>
              </li>
              <li>
                <a
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Escrow Protection
                </a>
              </li>
              <li>
                <a
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Global Logistics
                </a>
              </li>
              <li>
                <a
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">
          <span>© 2024 The Auction Curator Global Limited</span>
          <div className="flex gap-8">
            <span>All Rights Reserved</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AuctionListing;
