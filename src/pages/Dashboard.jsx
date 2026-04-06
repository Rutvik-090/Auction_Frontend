import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString()}`;
const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const MetricCard = ({ label, value, accent = "text-on-surface" }) => (
  <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 shadow-sm relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors" />
    <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest font-bold mb-2">
      {label}
    </p>
    <p
      className={`text-4xl font-headline font-black tracking-tighter ${accent}`}
    >
      {value}
    </p>
  </div>
);

const EmptyState = ({ title, description }) => (
  <div className="rounded-2xl border border-dashed border-outline-variant/30 p-6 text-center text-on-surface-variant bg-surface-container-low">
    <p className="font-bold text-on-surface mb-1">{title}</p>
    <p className="text-sm">{description}</p>
  </div>
);

const BuyerDashboard = ({ data }) => {
  const recentBids = data?.recentBids || [];
  const recentWins = data?.recentWins || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard
          label="Bids Placed"
          value={data?.bidsPlaced ?? 0}
          accent="text-on-surface"
        />
        <MetricCard
          label="Won Auctions"
          value={data?.wonAuctions ?? 0}
          accent="text-on-surface"
        />
        <div className="bg-primary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/20 transition-colors" />
          <p className="text-white/80 font-label text-xs uppercase tracking-widest font-bold mb-2">
            Total Spent
          </p>
          <p className="text-4xl font-headline font-black tracking-tighter">
            {formatCurrency(data?.totalSpent)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-outline-variant/20">
            <h3 className="font-headline font-black text-xl tracking-tighter">
              Recent Bids
            </h3>
            <Link
              to="/browse"
              className="text-primary font-bold text-sm hover:underline"
            >
              Browse Lots
            </Link>
          </div>
          <div className="space-y-4">
            {recentBids.length > 0 ? (
              recentBids.map((bid) => (
                <Link
                  key={bid._id}
                  to={`/auction/${bid.auction?._id}`}
                  className="flex items-center justify-between gap-4 p-4 bg-surface-container-low rounded-xl group hover:bg-surface-container-high transition-all"
                >
                  <div className="min-w-0">
                    <h4 className="font-bold text-on-surface truncate">
                      {bid.auction?.title || "Auction removed"}
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      Placed on {formatDate(bid.time)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-headline font-black text-primary">
                      {formatCurrency(bid.amount)}
                    </p>
                    <p
                      className={`text-[10px] uppercase font-bold tracking-widest ${bid.auction?.status === "ended" ? "text-secondary" : "text-outline"}`}
                    >
                      {bid.auction?.status || "Unknown"}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState
                title="No bids yet"
                description="Your bidding activity will appear here after you place an offer."
              />
            )}
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-outline-variant/20">
            <h3 className="font-headline font-black text-xl tracking-tighter">
              Recent Wins
            </h3>
            <Link
              to="/browse"
              className="text-primary font-bold text-sm hover:underline"
            >
              Find More
            </Link>
          </div>
          <div className="space-y-4">
            {recentWins.length > 0 ? (
              recentWins.map((auction) => (
                <Link
                  key={auction._id}
                  to={`/auction/${auction._id}`}
                  className="p-4 border border-outline-variant/20 rounded-xl bg-surface-container-low hover:bg-surface-container-high flex items-start justify-between gap-4 transition-all group"
                >
                  <div className="min-w-0">
                    <h4 className="font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                      {auction.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      Ended {formatDate(auction.endTime)}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Seller: {auction.seller?.name || "Unknown"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-headline font-black text-primary">
                      {formatCurrency(auction.currentBid)}
                    </p>
                    <p
                      className={`text-[10px] uppercase font-bold tracking-widest ${auction.paymentStatus === "paid" ? "text-secondary" : "text-error"}`}
                    >
                      {auction.paymentStatus === "paid"
                        ? "Paid"
                        : "Payment due"}
                    </p>
                    {auction.paymentStatus !== "paid" && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/checkout/${auction._id}`;
                        }}
                        className="mt-2 inline-flex text-xs font-bold text-primary hover:underline"
                      >
                        Pay now
                      </button>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState
                title="No wins yet"
                description="When you win an auction, it will show up here with payment status."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SellerDashboard = ({ data }) => {
  const recentListings = data?.recentListings || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-inverse-surface rounded-3xl p-10 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-3xl font-headline font-black text-white tracking-tighter mb-2">
            Seller Performance
          </h2>
          <p className="text-surface-container-high font-body">
            {data?.soldListings ?? 0} sold listings and{" "}
            {data?.activeListings ?? 0} active listings tracked from the
            backend.
          </p>
        </div>
        <Link
          to="/create-auction"
          className="relative z-10 bg-white text-on-surface px-8 py-4 rounded-full font-bold hover:bg-surface-container-high transition-all text-center flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-xl">add</span> Create
          Listing
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="Active Listings"
          value={data?.activeListings ?? 0}
          accent="text-on-surface"
        />
        <MetricCard
          label="Sold Listings"
          value={data?.soldListings ?? 0}
          accent="text-on-surface"
        />
        <div className="bg-primary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/20 transition-colors" />
          <p className="text-white/80 font-label text-xs uppercase tracking-widest font-bold mb-2">
            Total Revenue
          </p>
          <p className="text-4xl font-headline font-black tracking-tighter">
            {formatCurrency(data?.totalRevenue)}
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-headline font-black text-2xl tracking-tighter">
              Recent Listings
            </h3>
            <p className="text-sm text-on-surface-variant">
              Latest auctions from your store.
            </p>
          </div>
          <Link
            to="/browse"
            className="text-primary font-bold text-sm hover:underline"
          >
            Open Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentListings.length > 0 ? (
            recentListings.map((auction) => (
              <Link
                key={auction._id}
                to={`/auction/${auction._id}`}
                className="p-6 border border-outline-variant/20 rounded-2xl hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h4 className="font-headline font-black text-xl group-hover:text-primary transition-colors truncate">
                      {auction.title}
                    </h4>
                    <span
                      className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded-full ${auction.status === "active" ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container text-on-surface-variant"}`}
                    >
                      {auction.status}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">
                    {auction.description}
                  </p>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs uppercase font-label font-bold text-outline">
                      Current Bid
                    </p>
                    <p className="font-headline font-black text-2xl text-primary">
                      {formatCurrency(auction.currentBid)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black headline">
                      {auction.highestBidder?.name
                        ? auction.highestBidder.name.slice(0, 1).toUpperCase()
                        : "—"}
                    </p>
                    <p className="text-xs font-bold text-on-surface-variant uppercase">
                      Winner
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="md:col-span-2">
              <EmptyState
                title="No listings yet"
                description="Your auction inventory will appear here once you create listings."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("buyer");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === "seller") {
      setActiveTab("seller");
    }
  }, [user?.role]);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?.token) return;

      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(
          "http://localhost:5000/api/auth/dashboard",
          config,
        );
        setDashboardData(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user?.token]);

  const tabs = useMemo(
    () => [
      { id: "buyer", label: "Collector Dashboard" },
      { id: "seller", label: "Curator Dashboard" },
    ],
    [],
  );

  if (authLoading || loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-10 text-on-surface-variant">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        <div className="rounded-3xl border border-error/20 bg-error-container p-10 text-error font-semibold">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12">
      <div className="flex flex-col gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-black headline tracking-tighter text-on-surface mb-2">
            Dashboard
          </h1>
          <p className="text-on-surface-variant">
            Live activity for{" "}
            {dashboardData?.profile?.name || user?.name || "your account"}.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="bg-surface-container p-1.5 rounded-full flex gap-2 shadow-inner border border-outline-variant/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-10 py-3 rounded-full text-sm font-bold font-headline tracking-wide transition-all ${activeTab === tab.id ? "bg-surface-container-lowest text-on-surface shadow-md border border-outline-variant/10" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === "buyer" ? (
        <BuyerDashboard data={dashboardData?.buyer} />
      ) : (
        <SellerDashboard data={dashboardData?.seller} />
      )}
    </div>
  );
};

export default Dashboard;
