import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import api from "../services/api";
import AddFunds from "./AddFunds"; // Ensure correct relative path to your AddFunds component

function MyBanking() {
  const navigate = useNavigate();
  const [transferAnimating, setTransferAnimating] = useState(false);
  const [banking, setBanking] = useState<any>(null);
  const [recentRecipients, setRecentRecipients] = useState([]);
  const [showBalance, setShowBalance] = useState(true);
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [showDepositModal, setShowDepositModal] = useState(false); // Modal control state

  const fetchBanking = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/profile/banking", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBanking(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecipients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/transactions/recent-recipients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecentRecipients(response.data.recipients);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBanking();
    fetchRecipients();
  }, []);

  if (!banking) {
    return <Layout>Loading Banking Data...</Layout>;
  }

  const handleServiceClick = (item: string) => {
    if (item === "💰 Deposit Funds") {
      setShowDepositModal(true);
    } else {
      // Handle other services natively
      console.log(`Clicked ${item}`);
    }
  };

  return (
    <Layout>
      <PageHeader
        title="My Banking"
        subtitle="Manage your account and transfers"
      />

      {/* Banking Card */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-blue-100">Available Balance</p>
            <h1 className="text-4xl font-bold mt-2">
              {showBalance ? `₹${banking.balance}` : "••••••"}
            </h1>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
          >
            {showBalance ? "🙈 Hide" : "👁 Show"}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6 text-sm text-blue-100 pt-4 border-t border-white/10">
          <div>
            <span className="opacity-70">Account: </span>
            <span className="font-mono font-bold tracking-wider">{banking.account_number}</span>
          </div>
          <div className="sm:ml-auto">
            <span className="opacity-70">Trust Score: </span>
            <span className="font-bold">{banking.trust_score}</span>
          </div>
        </div>
      </div>

      {/* Transfer Circle Interaction */}
      <div className="flex justify-center mb-8">
        <motion.div
          animate={{
            width: transferAnimating ? 320 : 160,
            height: transferAnimating ? 80 : 160,
            borderRadius: transferAnimating ? 24 : 9999,
          }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setTransferAnimating(true);
            setTimeout(() => {
              navigate("/transfer");
            }, 400);
          }}
          className="h-40 w-40 bg-linear-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-center text-center cursor-pointer shadow-2xl"
        >
          <div>
            <div className="text-4xl">₹</div>
            <div className="font-medium mt-1">Transfer Money</div>
          </div>
        </motion.div>
      </div>

      {/* Recent Recipients */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="font-bold text-lg mb-4">Recent Recipients</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {recentRecipients.map((user: any) => (
            <div
              key={user.account_number}
              onClick={() => setSelectedRecipient(user)}
              className="min-w-35 bg-slate-50 rounded-xl p-4 cursor-pointer hover:bg-blue-50 transition"
            >
              <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-2">
                {user.full_name[0]}
              </div>
              <div className="font-medium text-sm truncate">{user.full_name}</div>
              <div className="text-xs text-gray-500 font-mono mt-0.5">{user.account_number}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: Recent Recipient Details */}
      <AnimatePresence>
        {selectedRecipient && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="text-5xl text-center mb-4">👤</div>
              <h2 className="text-2xl font-bold text-center mb-6">Recent Recipient</h2>
              <div className="space-y-3 text-slate-700">
                <div><span className="font-semibold text-slate-500">Name:</span> {selectedRecipient.full_name}</div>
                <div><span className="font-semibold text-slate-500">Account:</span> <span className="font-mono">{selectedRecipient.account_number}</span></div>
                <div><span className="font-semibold text-slate-500">Last Amount:</span> ₹{selectedRecipient.last_amount}</div>
                <div><span className="font-semibold text-slate-500">Remark:</span> {selectedRecipient.last_remark || "-"}</div>
                <div><span className="font-semibold text-slate-500">Last Transfer:</span> {new Date(selectedRecipient.last_transfer_date).toLocaleDateString()}</div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setSelectedRecipient(null)}
                  className="flex-1 bg-gray-100 font-semibold text-gray-600 py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    navigate("/transfer-money", {
                      state: { accountNumber: selectedRecipient.account_number },
                    });
                  }}
                  className="flex-1 bg-linear-to-r from-blue-600 to-indigo-700 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Send Again
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Razorpay Deposit Queue Initiation */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
            >
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-800">Secure Vault Portal</span>
                <button 
                  onClick={() => {
                    setShowDepositModal(false);
                    fetchBanking(); // Automatically refresh balance in case a deposit status cleared
                  }}
                  className="text-slate-400 hover:text-slate-600 font-semibold p-1"
                >
                  ✕
                </button>
              </div>
              <div className="p-2">
                <AddFunds account_number={banking.account_number} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Stats Panel */}
      <div className="grid md:grid-cols-3 gap-6 mb-6 mt-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-sm font-semibold text-slate-500 mb-1">Trust Score</h3>
          <div className="text-3xl font-bold text-slate-800">{banking.trust_score}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-sm font-semibold text-slate-500 mb-1">Security</h3>
          <div className="text-3xl font-bold text-green-600">Secure</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-sm font-semibold text-slate-500 mb-1">Account</h3>
          <div className="text-3xl font-bold text-blue-600">Active</div>
        </div>
      </div>

      {/* Banking Services Hub */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {["💰 Deposit Funds", "🏦 Loans", "🎁 Offers", "🤖 AI Assistant"].map(
          (item) => (
            <div
              key={item}
              onClick={() => handleServiceClick(item)}
              className="bg-white rounded-2xl shadow p-6 text-center font-semibold text-slate-700 cursor-pointer hover:shadow-lg hover:text-blue-600 transition"
            >
              {item}
            </div>
          )
        )}
      </div>
    </Layout>
  );
}

export default MyBanking;