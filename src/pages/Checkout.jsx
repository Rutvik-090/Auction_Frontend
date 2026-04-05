import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    }, 2000);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="glass p-12 rounded-2xl border border-green-200 bg-green-50/50">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl">✓</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Payment Successful!</h2>
          <p className="text-lg text-slate-600 mb-8">Your funds have been placed in escrow securely until the item is delivered.</p>
          <p className="text-sm font-medium text-slate-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Checkout & Escrow</h2>
      <div className="glass p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Auction #{id.slice(-6)}</h3>
            <p className="text-slate-500">Winning Bid Item</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-brand-600">Pending</span>
          </div>
        </div>
        
        <form onSubmit={handlePayment} className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
            <h4 className="font-semibold text-slate-700 mb-2">Escrow Agreement</h4>
            <p className="text-sm text-slate-600">By proceeding, your payment will be held securely in escrow. The seller will be notified to ship the item. Funds are only released to the seller once you confirm delivery.</p>
          </div>

          <div className="space-y-4">
            <input type="text" required placeholder="Cardholder Name" className="input-field" defaultValue="John Doe" />
            <div className="flex gap-4">
              <input type="text" required placeholder="Card Number" className="input-field w-3/4" defaultValue="•••• •••• •••• 4242" />
              <input type="text" required placeholder="CVC" className="input-field w-1/4" defaultValue="123" />
            </div>
          </div>

          <button type="submit" disabled={processing} className={`w-full py-4 rounded-lg text-lg font-bold transition-all ${processing ? 'bg-slate-400 text-white cursor-not-allowed' : 'btn-primary'}`}>
            {processing ? 'Processing Secure Payment...' : 'Pay with Escrow'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
