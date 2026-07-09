import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

export default function AdminDeposits() {
  const [requests, setRequests] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ id: number, action: "APPROVE" | "REJECT" } | null>(null);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/deposits/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const prepareAction = (id: number, action: "APPROVE" | "REJECT") => {
    setPendingAction({ id, action });
    setShowModal(true);
  };

  const executeAction = async () => {
    if (!pendingAction) return;
    try {
      const token = localStorage.getItem("token");
      await api.post("/admin/deposits/action", 
        { deposit_id: pendingAction.id, action: pendingAction.action }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(requests.filter(req => req.id !== pendingAction.id));
      setShowModal(false);
      setPendingAction(null);
    } catch (error) {
      alert("Failed to process transaction. Check server logs.");
      setShowModal(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900">AML Compliance Queue</h2>
        <p className="text-slate-500">Manual verification required for pending deposits.</p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          No pending deposits at this time.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="p-6">Customer Details</th>
                <th className="p-6">Account</th>
                <th className="p-6">Amount</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-6">
                    <div className="font-bold text-slate-900">{req.full_name}</div>
                    <div className="text-sm text-slate-500">{req.email}</div>
                  </td>
                  <td className="p-6 font-mono font-medium">{req.account_number}</td>
                  <td className="p-6 font-bold text-lg text-emerald-600">₹{parseFloat(req.amount).toLocaleString()}</td>
                  <td className="p-6 text-right space-x-3">
                    <button 
                      onClick={() => prepareAction(req.id, "APPROVE")}
                      className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-bold hover:bg-emerald-100 transition"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => prepareAction(req.id, "REJECT")}
                      className="bg-rose-50 text-rose-700 px-4 py-2 rounded-lg font-bold hover:bg-rose-100 transition"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2-Factor Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-xl font-black mb-3">Authorize Transaction</h3>
              <p className="text-slate-600 mb-8">
                You are about to <span className="font-bold">{pendingAction?.action === "APPROVE" ? "APPROVE" : "REJECT"}</span> a deposit of 
                <span className="font-bold text-black"> ₹{requests.find(r => r.id === pendingAction?.id)?.amount}</span>. 
                This will update user balances permanently.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200">Cancel</button>
                <button onClick={executeAction} className={`flex-1 py-3 rounded-xl font-bold text-white ${pendingAction?.action === "APPROVE" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"}`}>
                  Confirm {pendingAction?.action}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}