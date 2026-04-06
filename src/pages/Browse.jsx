import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Browse = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtering States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'active', 'ended'
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const CATEGORIES = [
    "All Categories",
    "Fine Art",
    "Tech & Innovation",
    "Collectibles",
    "Horology",
    "Automobilia",
  ];

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/auctions");
        setAuctions(data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  const filteredAuctions = auctions.filter((auction) => {
    // 1. Search Matching
    const matchesSearch = auction.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // 2. Status Matching
    const matchesStatus =
      filterStatus === "all" || auction.status === filterStatus;

    // 3. Category Matching
    const matchesCategory =
      categoryFilter === "All Categories" ||
      auction.category === categoryFilter;

    // 4. Price Matching (Using currentBid, falling back to startingBid if 0)
    const activePrice =
      auction.currentBid > 0 ? auction.currentBid : auction.startingBid;
    const meetsMin = minPrice === "" || activePrice >= parseFloat(minPrice);
    const meetsMax = maxPrice === "" || activePrice <= parseFloat(maxPrice);

    return (
      matchesSearch && matchesStatus && matchesCategory && meetsMin && meetsMax
    );
  });

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setCategoryFilter("All Categories");
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
      <main className="max-w-[1600px] mx-auto px-8 pb-24 mt-12 flex flex-col lg:flex-row gap-12">
        {/* Left Sidebar Filters */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 sticky top-28 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/20">
              <h2 className="text-2xl font-black headline tracking-tighter">
                Filters
              </h2>
              <button
                onClick={clearFilters}
                className="text-xs uppercase font-label font-bold text-on-surface-variant hover:text-primary transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-8">
              {/* Search */}
              <div>
                <label className="block text-xs uppercase font-label font-bold text-outline mb-2">
                  Search Catalog
                </label>
                <div className="relative w-full">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search titles..."
                    className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:bg-surface-container-lowest focus:border-primary/30 focus:shadow-sm transition-all outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs uppercase font-label font-bold text-outline mb-2">
                  Auction Status
                </label>
                <div className="bg-surface-container-low p-1 rounded-xl flex">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${filterStatus === "all" ? "bg-primary text-white shadow-md" : "text-on-surface-variant hover:bg-surface-variant/50"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus("active")}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${filterStatus === "active" ? "bg-primary text-white shadow-md" : "text-on-surface-variant hover:bg-surface-variant/50"}`}
                  >
                    Live
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs uppercase font-label font-bold text-outline mb-2">
                  Department
                </label>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-colors flex justify-between items-center ${categoryFilter === cat ? "bg-primary/10 text-primary border border-primary/20" : "bg-transparent text-on-surface hover:bg-surface-container-low border border-transparent"}`}
                    >
                      {cat}
                      {categoryFilter === cat && (
                        <span className="material-symbols-outlined text-[16px]">
                          check
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs uppercase font-label font-bold text-outline mb-2">
                  Price Range (INR)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-surface-container-low border border-transparent rounded-xl py-2 px-3 text-sm font-medium focus:bg-surface-container-lowest focus:border-primary/30 outline-none text-center"
                  />
                  <span className="text-outline">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-surface-container-low border border-transparent rounded-xl py-2 px-3 text-sm font-medium focus:bg-surface-container-lowest focus:border-primary/30 outline-none text-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Gallery Grid */}
        <section className="flex-1 w-full min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/20">
            <h1 className="text-4xl font-black headline tracking-tighter">
              Collections
            </h1>
            <div className="text-sm text-on-surface-variant font-label font-bold uppercase tracking-widest bg-surface-container-low px-4 py-1.5 rounded-full">
              {filteredAuctions.length}{" "}
              {filteredAuctions.length === 1 ? "Lot" : "Lots"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredAuctions.map((auction) => (
              <Link
                key={auction._id}
                to={`/auction/${auction._id}`}
                className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl block"
              >
                <div className="relative h-64 overflow-hidden rounded-xl m-3 bg-surface-container shrink-0">
                  {auction.images && auction.images.length > 0 ? (
                    <img
                      src={auction.images[0]}
                      alt={auction.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-outline bg-surface-container-low transition-transform duration-700 group-hover:scale-105">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">
                        image
                      </span>
                      <span className="text-xs font-label">
                        No preview visible
                      </span>
                    </div>
                  )}

                  <div
                    className={`absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 ${auction.status !== "active" ? "opacity-70" : ""}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${auction.status === "active" ? "bg-secondary animate-pulse" : "bg-outline"}`}
                    ></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest font-label">
                      {auction.status === "active" ? "Live" : "Ended"}
                    </span>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <div className="flex justify-between items-start mb-2 mt-1">
                    <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">
                      {auction.category || "Uncategorized"}
                    </p>
                  </div>
                  <h4 className="text-lg font-black headline tracking-tight mb-4 line-clamp-1">
                    {auction.title}
                  </h4>

                  <div className="mt-4 pt-4 border-t border-outline-variant/10 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] uppercase text-on-surface-variant font-label tracking-widest mb-0.5">
                        Current Bid
                      </p>
                      <p className="text-xl font-black headline text-primary">
                        ₹
                        {(auction.currentBid > 0
                          ? auction.currentBid
                          : auction.startingBid
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-secondary-container/20 text-secondary px-4 py-2 rounded-full text-sm font-bold font-label group-hover:bg-primary group-hover:text-white transition-all">
                      View lot &rarr;
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredAuctions.length === 0 && (
            <div className="py-32 text-center border-2 border-dashed border-outline-variant/30 rounded-3xl bg-surface-container-lowest">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-4 bg-surface-container p-4 rounded-full">
                search_off
              </span>
              <p className="text-xl headline font-black text-on-surface tracking-tighter mt-4">
                No collections found.
              </p>
              <p className="text-on-surface-variant font-body max-w-md mx-auto mt-2">
                Try adjusting your filters or search terms to uncover hidden
                gems in our catalog.
              </p>
              <button
                onClick={clearFilters}
                className="bg-on-surface text-surface-container-lowest px-6 py-2 rounded-full font-bold mt-6 hover:bg-primary transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low pt-20 pb-12 border-t border-outline-variant/10">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="flex flex-col justify-center items-center gap-6">
            <span className="text-2xl font-black text-[#3525cd] tracking-tighter headline">
              The Auction Curator
            </span>
            <span className="text-sm text-outline">
              © 2024 The Auction Curator. All Rights Reserved.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Browse;
