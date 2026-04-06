import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";

const socket = io("http://localhost:5000");

const AuctionDetails = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bidHistory, setBidHistory] = useState([]);
  const [liveToast, setLiveToast] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isWinningBidder =
    auction?.status === "ended" &&
    auction?.highestBidder?._id?.toString() === user?._id?.toString();

  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        const { data: auctionData } = await axios.get(
          `http://localhost:5000/api/auctions/${id}`,
        );
        setAuction(auctionData);

        const { data: bidsData } = await axios.get(
          `http://localhost:5000/api/bids/${id}`,
        );
        setBidHistory(bidsData);

        if (auctionData.category) {
          const { data: allAuctions } = await axios.get(
            `http://localhost:5000/api/auctions`,
          );
          const similar = allAuctions
            .filter((a) => a.category === auctionData.category && a._id !== id)
            .slice(0, 3);
          setSimilarProducts(similar);
        }
      } catch (err) {
        setError("Error fetching auction details.");
      }
    };
    fetchAuctionData();

    socket.emit("join_auction", id);

    socket.on("new_bid", (data) => {
      if (data.auctionId === id) {
        setAuction((prev) => ({
          ...prev,
          currentBid: data.amount,
          highestBidder: { name: data.bidder },
        }));
        setLiveToast(`New bid placed! ${data.bidder} just bid ₹${data.amount}`);
        setTimeout(() => setLiveToast(null), 5000);

        setBidHistory((prev) => [
          {
            bidder: { name: data.bidder },
            amount: data.amount,
            time: new Date(),
          },
          ...prev,
        ]);
      }
    });

    return () => {
      socket.emit("leave_auction", id);
      socket.off("new_bid");
    };
  }, [id]);

  useEffect(() => {
    if (!auction?.endTime || auction.status !== "active") {
      if (auction?.status === "ended") setTimeLeft("Auction Closed");
      return;
    }

    // Initial display
    const updateTime = () => {
      const now = new Date().getTime();
      const distance = new Date(auction.endTime).getTime() - now;

      if (distance < 0) {
        setTimeLeft("Closing...");
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        let display = "";
        if (days > 0) display += `${days}d `;
        display += `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        setTimeLeft(display);
      }
    };
    updateTime();

    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, [auction?.endTime, auction?.status]);

  const handleBid = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(
        `http://localhost:5000/api/bids/${id}`,
        { amount: Number(bidAmount) },
        config,
      );
      setSuccess("Bid placed successfully!");
      setBidAmount("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place bid");
    }
  };

  if (!auction)
    return (
      <div className="text-center py-20 text-on-surface-variant font-body">
        Loading...
      </div>
    );

  return (
    <main className="bg-surface min-h-screen pb-20">
      {/* Live Alert Notification */}
      {liveToast && (
        <div className="fixed top-24 right-8 z-[60] flex items-center gap-4 bg-secondary-container text-on-secondary-container px-6 py-4 rounded-xl shadow-xl border border-secondary/10 animate-bounce">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            notifications_active
          </span>
          <div>
            <p className="font-bold text-sm">New bid placed!</p>
            <p className="text-xs opacity-80">{liveToast}</p>
          </div>
          <button
            className="ml-4 opacity-50 hover:opacity-100"
            onClick={() => setLiveToast(null)}
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-8 py-12">
        {/* Top Split Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Left: Gallery Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative group aspect-[4/3] rounded-3xl overflow-hidden bg-surface-container-lowest shadow-lg">
              {auction.images && auction.images.length > 0 ? (
                <img
                  src={auction.images[0]}
                  alt={auction.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-outline text-lg bg-surface-container">
                  Image Pending
                </div>
              )}

              <div className="absolute top-6 left-6 flex gap-2">
                {auction.status === "active" && (
                  <span className="bg-secondary-container/90 backdrop-blur-md text-on-secondary-container px-4 py-2 rounded-full text-xs font-black tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    LIVE AUCTION
                  </span>
                )}
                <span className="bg-surface-container-lowest/90 backdrop-blur-md text-on-surface px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest shadow-sm inline-block">
                  LOT #{auction._id.slice(-4).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Bidding Details */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <section className="space-y-4 mb-8">
              <nav className="flex items-center gap-2 text-on-surface-variant text-xs uppercase font-bold tracking-widest mb-4 opacity-70">
                <Link
                  to="/browse"
                  className="hover:text-primary transition-colors"
                >
                  Gallery
                </Link>
                <span className="material-symbols-outlined text-xs">
                  chevron_right
                </span>
                <span className="text-primary">{auction.category}</span>
              </nav>
              <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tight leading-tight text-on-surface">
                {auction.title}
              </h1>
            </section>

            {/* Bidding Panel */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_32px_64px_-16px_rgba(53,37,205,0.08)] border border-outline-variant/20 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

              <div className="grid grid-cols-2 gap-8 relative z-10">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest">
                    Current Bid
                  </span>
                  <div className="text-4xl font-mono font-black text-primary">
                    ₹{auction.currentBid.toLocaleString()}
                  </div>
                  {auction.highestBidder?.name && (
                    <span className="text-xs text-primary/80 font-bold block mt-1">
                      Leading: {auction.highestBidder.name}
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest">
                    {auction.status === "active" ? "Time Remaining" : "Status"}
                  </span>
                  <div className="text-2xl lg:text-3xl font-mono font-black text-on-surface tracking-tighter mt-1">
                    {timeLeft || "---"}
                  </div>
                  <span className="text-xs font-mono font-bold text-outline mt-1 block">
                    {auction.status === "active" ? "Closes:" : "Closed:"}{" "}
                    {new Date(auction.endTime).toLocaleString([], {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {auction.status === "active" && user ? (
                <form
                  onSubmit={handleBid}
                  className="space-y-4 relative z-10 block"
                >
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-lg">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={auction.currentBid + 1}
                      required
                      className="w-full bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest rounded-full py-5 pl-12 pr-6 text-xl font-black transition-all outline-none placeholder:font-medium placeholder:opacity-50"
                      placeholder={`Enter bid (₹${auction.currentBid + 10} or more)`}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-5 rounded-full font-headline font-black tracking-wide text-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all outline-none"
                  >
                    Place Bid
                  </button>
                  <p className="text-[10px] text-center text-on-surface-variant uppercase tracking-widest opacity-60 font-bold mt-2">
                    By bidding, you agree to our terms
                  </p>
                </form>
              ) : !user ? (
                <div className="mt-6 text-center p-6 bg-surface-container-high rounded-xl text-on-surface-variant font-bold tracking-wide border border-outline-variant/20 shadow-inner">
                  Please{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Log in
                  </Link>{" "}
                  to place a bid.
                </div>
              ) : isWinningBidder ? (
                <div className="mt-6">
                  {auction.paymentStatus === "paid" ? (
                    <div className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-headline font-black text-lg py-5 rounded-full shadow-lg flex items-center justify-center gap-3">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      Payment Completed!
                    </div>
                  ) : (
                    <button
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-headline font-black text-lg py-5 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all"
                      onClick={() => navigate(`/checkout/${auction._id}`)}
                    >
                      You won! Proceed to Razorpay
                    </button>
                  )}
                </div>
              ) : auction.status === "ended" ? (
                <div className="mt-6 p-4 text-center bg-surface-container rounded-xl font-bold text-outline">
                  Auction Closed
                </div>
              ) : null}

              {error && (
                <div className="mt-4 text-sm font-bold text-error bg-error-container/50 p-4 rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    error
                  </span>
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 text-sm font-bold text-secondary bg-secondary-container/50 p-4 rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    check_circle
                  </span>
                  {success}
                </div>
              )}
            </div>

            {/* Seller Info Short */}
            <div className="flex items-center gap-4 mt-8 px-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center font-black text-primary shadow-sm text-lg">
                {auction.seller?.name?.charAt(0).toUpperCase() || "S"}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm text-on-surface">
                    {auction.seller?.name || "Unknown Curator"}
                  </span>
                  <span
                    className="material-symbols-outlined text-secondary text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-outline">
                  Premium Seller
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid (Description & History) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-16 border-t border-outline-variant/20">
          {/* Description Section */}
          <div className="lg:col-span-8">
            <h3 className="font-headline font-black text-2xl tracking-tighter mb-8 text-on-surface">
              About the Item
            </h3>
            <div className="bg-surface-container-lowest p-8 md:p-10 rounded-3xl shadow-sm border border-outline-variant/20">
              <p className="text-on-surface-variant leading-relaxed font-body text-lg whitespace-pre-wrap">
                {auction.description}
              </p>
            </div>
          </div>

          {/* Bid History Section */}
          <div className="lg:col-span-4">
            <h3 className="font-headline font-black text-2xl tracking-tighter mb-8 text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">
                history
              </span>{" "}
              Bid History
            </h3>

            <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/20 overflow-hidden">
              {bidHistory.length > 0 ? (
                <ul className="divide-y divide-outline-variant/10 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {bidHistory.map((bid, index) => (
                    <li
                      key={index}
                      className={`p-5 flex justify-between items-center transition-colors ${index === 0 ? "bg-primary/5" : "hover:bg-surface-container-low"}`}
                    >
                      <div>
                        <p
                          className={`font-bold text-sm ${index === 0 ? "text-primary" : "text-on-surface"}`}
                        >
                          {bid.bidder?.name || "Unknown"}
                        </p>
                        <p className="text-[10px] text-outline font-mono font-bold tracking-widest mt-1">
                          {new Date(bid.time).toLocaleString([], {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                      <div
                        className={`font-mono font-black ${index === 0 ? "text-xl text-primary" : "text-lg text-on-surface-variant"}`}
                      >
                        ₹{bid.amount.toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center text-outline">
                  <span className="material-symbols-outlined text-4xl opacity-50 mb-2">
                    gavel
                  </span>
                  <p className="font-bold text-sm">No bids placed yet.</p>
                  <p className="text-xs mt-1">
                    Be the first to bid on this exclusive item.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="pt-24 mt-16 border-t border-outline-variant/20">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-primary font-bold text-[10px] tracking-widest uppercase mb-2">
                  Curated Matches
                </h3>
                <h2 className="font-headline font-black text-3xl tracking-tighter text-on-surface">
                  Similar Masterpieces
                </h2>
              </div>
              <Link
                to="/browse"
                className="hidden md:flex items-center gap-1 font-bold text-sm text-primary hover:text-primary-container transition-colors"
              >
                View all{" "}
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarProducts.map((item) => (
                <Link
                  key={item._id}
                  to={`/auction/${item._id}`}
                  className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl block"
                >
                  <div className="relative h-48 overflow-hidden rounded-t-xl bg-surface-container shrink-0">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-outline bg-surface-container-low transition-transform duration-700 group-hover:scale-105">
                        <span className="material-symbols-outlined text-3xl opacity-50">
                          image
                        </span>
                      </div>
                    )}

                    <div
                      className={`absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 ${item.status !== "active" ? "opacity-70 grayscale" : ""}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${item.status === "active" ? "bg-secondary animate-pulse" : "bg-outline-variant"}`}
                      ></span>
                      <span className="text-[10px] font-black uppercase tracking-widest font-label">
                        {item.status === "active" ? "Live" : "Ended"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">
                      {item.category}
                    </p>
                    <h4 className="text-lg font-black headline tracking-tight mb-4 line-clamp-1 group-hover:text-primary transition-colors text-on-surface">
                      {item.title}
                    </h4>

                    <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-end mt-2">
                      <div>
                        <p className="text-[10px] uppercase text-outline font-bold tracking-widest mb-0.5">
                          Current Bid
                        </p>
                        <p className="text-lg font-black font-mono text-on-surface">
                          ₹
                          {item.currentBid > 0
                            ? item.currentBid.toLocaleString()
                            : item.startingBid.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-primary font-black text-sm group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        View{" "}
                        <span className="material-symbols-outlined text-sm">
                          arrow_forward
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AuctionDetails;
