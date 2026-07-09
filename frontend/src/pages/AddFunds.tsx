import { useState } from "react";
import api from "../services/api";

// 1. FIX: Define the expected types for your component props
interface AddFundsProps {
  account_number: string;
}

export default function AddFunds({ account_number }: AddFundsProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    // 2. FIX: Convert the string 'amount' to a Number before checking isNaN
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return alert("Enter valid amount");
    }
    
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Create Order on Backend
      const orderRes = await api.post("/deposit/create-order", { amount: Number(amount) }, { headers });
      const order = orderRes.data.order;

      if (!(window as any).Razorpay) {
        alert("Razorpay SDK failed to load. Are you offline or using an adblocker?");
        setLoading(false);
        return;
     }

      // Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
        name: "TrustGuard Banking",
        description: "Account Deposit",
        order_id: order.id,
        handler: async function (response: any) {
          // Verify Payment on Backend
          await api.post("/deposit/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: Number(amount),
            account_number: account_number
          }, { headers });

          setSuccess(true);
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 bg-green-50 text-green-800 rounded-xl border border-green-200">
        <h3 className="font-bold text-lg mb-2">Funds Pending Clearing</h3>
        <p>Your payment was successful. Our compliance team will review and credit the funds to your account shortly.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h3 className="font-bold text-lg mb-4">Add Funds to Account</h3>
      <input
        type="number"
        placeholder="Enter amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Processing..." : "Deposit via Razorpay"}
      </button>
    </div>
  );
}