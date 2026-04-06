import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [auction, setAuction] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/auctions/${id}`,
        );
        setAuction(data);
      } catch (err) {
        setError("Unable to load auction details.");
      }
    };

    fetchAuction();
  }, [id]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector("#razorpay-checkout-script")) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-checkout-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay checkout");
      }

      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(
        `http://localhost:5000/api/payments/razorpay/order/${id}`,
        {},
        config,
      );

      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.currency,
        name: "The Auction Curator",
        description: data.auction.title,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            await axios.post(
              "http://localhost:5000/api/payments/razorpay/verify",
              {
                auctionId: id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
              config,
            );
            setSuccess(true);
            setProcessing(false);
            setTimeout(() => navigate("/dashboard"), 3000);
          } catch (verifyError) {
            setProcessing(false);
            setError(
              verifyError.response?.data?.message ||
                "Payment verification failed",
            );
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3525cd",
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      };

      const paymentWindow = new window.Razorpay(options);
      paymentWindow.on("payment.failed", (response) => {
        setProcessing(false);
        setError(response.error?.description || "Payment failed");
      });
      paymentWindow.open();
    } catch (err) {
      setProcessing(false);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Payment could not be started",
      );
      return;
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="glass p-12 rounded-2xl border border-green-200 bg-green-50/50">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl">
            ✓
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Payment Successful!
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Your funds have been placed in escrow securely until the item is
            delivered.
          </p>
          <p className="text-sm font-medium text-slate-500">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
        Checkout & Escrow
      </h2>
      <div className="glass p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Auction #{id.slice(-6)}
            </h3>
            <p className="text-slate-500">Winning bid item</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-brand-600">
              {auction ? `₹${auction.currentBid.toLocaleString()}` : "Pending"}
            </span>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
            <h4 className="font-semibold text-slate-700 mb-2">
              Escrow Agreement
            </h4>
            <p className="text-sm text-slate-600">
              By proceeding, your payment will be processed through Razorpay.
              The seller will be notified after payment succeeds.
            </p>
          </div>

          {auction && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Item</span>
                <span className="font-semibold text-slate-900">
                  {auction.title}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Winner</span>
                <span className="font-semibold text-slate-900">
                  {user?.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Amount due</span>
                <span className="font-semibold text-slate-900">
                  ₹{auction.currentBid.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={processing}
            className={`w-full py-4 rounded-lg text-lg font-bold transition-all ${processing ? "bg-slate-400 text-white cursor-not-allowed" : "btn-primary"}`}
          >
            {processing ? "Opening Razorpay..." : "Pay with Razorpay"}
          </button>

          {error && (
            <p className="text-sm font-semibold text-red-600">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Checkout;
