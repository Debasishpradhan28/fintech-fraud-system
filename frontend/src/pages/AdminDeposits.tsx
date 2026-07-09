import { useState, useEffect } from "react";
import api from "../services/api";

export default function AdminDeposits() {
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/deposits/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (requestId: number, action: "APPROVE" | "REJECT") => {
    try {
      const token = localStorage.getItem("token");
      await api.post("/admin/deposits/action", { requestId, action }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove the processed request from the UI
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (error) {
      console.error(error);
      alert("Failed to process request");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Pending Deposits (AML Queue)</h2>
      
      {requests.length === 0 ? (
        <p className="text-slate-500">No pending deposits in the queue.</p>
      ) : (
        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 border-b">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Account No</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id} className="border-b">
                  <td className="p-4">
                    <div className="font-bold">{req.full_name}</div>
                    <div className="text-sm text-slate-500">{req.email}</div>
                  </td>
                  <td className="p-4 font-mono text-sm">{req.account_number}</td>
                  <td className="p-4 font-bold text-green-600">₹{req.amount}</td>
                  <td className="p-4 flex gap-2">
                    <button 
                      onClick={() => handleAction(req.id, "APPROVE")}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded font-semibold hover:bg-green-200"
                    >
                      Clear Funds
                    </button>
                    <button 
                      onClick={() => handleAction(req.id, "REJECT")}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded font-semibold hover:bg-red-200"
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
    </div>
  );
}