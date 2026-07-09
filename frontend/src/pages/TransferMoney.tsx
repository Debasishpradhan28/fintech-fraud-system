import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import api from "../services/api";

function TransferMoney() {
  const location = useLocation();

  // Core State
  const [banking, setBanking] = useState<any>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  
  // Status State
  const [errorMessage, setErrorMessage] = useState("");
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");

  // 2-Step Verification State
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [processingStage, setProcessingStage] = useState<'NONE' | 'DELAY' | 'EXECUTING'>('NONE');
  const processingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch Banking Info
  const fetchBanking = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/profile/banking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBanking(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Search User
  const searchUser = async (value: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/profile/search?query=${value}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  // STEP 1: Validate & Trigger Confirmation
  const initiateTransfer = () => {
    setErrorMessage("");
    const numAmount = Number(amount);

    // FIX: Strict Validation to block -1, 0, or invalid text
    if (!accountNumber) {
      return setErrorMessage("Please select a valid recipient.");
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      return setErrorMessage("Invalid transfer amount. Must be greater than ₹0.");
    }
    if (banking && numAmount > Number(banking.balance)) {
      return setErrorMessage("Insufficient funds for this transfer.");
    }

    // Open Confirmation Modal
    setShowConfirmation(true);
  };

  // STEP 2: Confirm & Start Processing Delay
  const handleConfirm = () => {
    setShowConfirmation(false);
    setProcessingStage('DELAY');

    // Give user 3 seconds to cancel before making the API call
    processingTimeoutRef.current = setTimeout(() => {
      executeTransferAPI();
    }, 3000);
  };

  // STEP 2.5: Cancel during the delay window
  const handleCancelProcessing = () => {
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }
    setProcessingStage('NONE');
    setErrorMessage("Transfer was securely cancelled by user.");
  };

  // STEP 3: Execute actual API Call
  const executeTransferAPI = async () => {
    setProcessingStage('EXECUTING');
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/transactions/transfer",
        {
          receiverAccountNumber: accountNumber,
          amount: Number(amount),
          remark,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTransactionRef(response.data.transaction?.transaction_reference || "SUCCESS");
      setProcessingStage('NONE');
      setTransferSuccess(true);
    } catch (error: any) {
      setProcessingStage('NONE');
      setErrorMessage(error?.response?.data?.message || error.message || "Transfer Failed");
    }
  };

  useEffect(() => {
    if (location.state?.accountNumber) {
      setAccountNumber(location.state.accountNumber);
    }
    fetchBanking();
  }, [location.state]);

  // Live Risk Assessment Logic
  const getRiskLevel = () => {
    const num = Number(amount);
    if (!amount || num <= 0) return { label: "Low Risk", icon: "🟢", color: "text-green-700", bg: "bg-green-50 border-green-200" };
    if (num > 50000) return { label: "High Risk", icon: "🔴", color: "text-red-700", bg: "bg-red-50 border-red-200" };
    if (num > 10000) return { label: "Medium Risk", icon: "🟡", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" };
    return { label: "Low Risk", icon: "🟢", color: "text-green-700", bg: "bg-green-50 border-green-200" };
  };

  const risk = getRiskLevel();

  return (
    <Layout>
      <PageHeader title="Transfer Money" subtitle="Send money securely" />

      <div className="max-w-xl mx-auto mt-8 mb-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 relative">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium border border-red-200 flex items-center gap-2">
              <span>⚠️</span> {errorMessage}
            </div>
          )}

          {/* Sender Info Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                <span>📤</span> Sending From
              </div>
              <div className="font-mono text-lg font-bold text-slate-800">
                {banking?.account_number || "Loading..."}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Balance</div>
              <div className="font-bold text-slate-700 text-lg">₹{banking?.balance || "0.00"}</div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-6">Payment Details</h2>

          {/* Recipient Search */}
          <div className="relative mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Search User</label>
            <div className="relative z-40">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  searchUser(e.target.value);
                }}
                placeholder="Search name, email or account..."
                className="w-full border-2 border-slate-100 rounded-xl p-4 pl-12 bg-white focus:ring-0 focus:border-blue-500 outline-none transition-colors"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">🔍</span>

              {/* Dropdown */}
              {search.trim() !== "" && users.length > 0 && (
                <div className="absolute w-full bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden mt-2 max-h-60 overflow-y-auto z-50">
                  {users.map((user: any, index: number) => (
                    <div
                      key={user.account_number || index}
                      onClick={() => {
                        setAccountNumber(user.account_number);
                        setSearch(user.full_name);
                        setUsers([]);
                      }}
                      className="p-4 cursor-pointer hover:bg-blue-50 border-b border-slate-50 transition-colors"
                    >
                      <div className="font-bold text-blue-700">{user.full_name}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">{user.email} • {user.account_number}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Recipient Account Number */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Receiver Account Number</label>
            <input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="e.g. TG0418141016"
              className="w-full border-2 border-slate-100 rounded-xl p-4 font-mono bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Amount */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-medium text-slate-400">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border-2 border-slate-100 rounded-xl p-5 pl-12 text-2xl font-bold bg-white focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Remark */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-2">What's this for? (Optional)</label>
            <input
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="e.g. Dinner share"
              className="w-full border-2 border-slate-100 rounded-xl p-4 bg-white focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Live Risk Indicator */}
          <div className={`rounded-xl p-4 mb-8 border flex items-center justify-between transition-colors duration-300 ${risk.bg}`}>
            <div className="flex items-center gap-3">
              <div className="text-2xl">{risk.icon}</div>
              <div>
                <div className={`text-sm font-bold ${risk.color}`}>AI Risk Assessment</div>
                <div className={`text-xs font-medium ${risk.color} opacity-80`}>
                  {Number(amount) > 50000 ? "Unusually high transfer amount detected." : "Transaction parameters appear safe."}
                </div>
              </div>
            </div>
            <div className={`px-3 py-1 bg-white rounded-full text-xs font-bold shadow-sm ${risk.color}`}>
              {risk.label}
            </div>
          </div>

          {/* Initial Send Button */}
          <button
            onClick={initiateTransfer}
            disabled={!accountNumber || !amount}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/30"
          >
            Send Money Securely
          </button>
        </div>
      </div>

      {/* --- MODAL 1: CONFIRMATION WINDOW --- */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Confirm Transfer</h2>
            <p className="text-slate-500 mb-6">
              You are about to securely send <span className="font-bold text-slate-800">₹{amount}</span> to account <span className="font-mono font-bold text-slate-800">{accountNumber}</span>.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmation(false)} 
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Reject
              </button>
              <button 
                onClick={handleConfirm} 
                className="flex-1 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: PROCESSING & CANCELLATION WINDOW --- */}
      {processingStage !== 'NONE' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl animate-in fade-in zoom-in duration-200">
            
            {/* Animated Spinner */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>

            <h2 className="text-xl font-bold text-slate-800 mb-2">
              {processingStage === 'DELAY' ? "Initiating Transfer..." : "Securing Blockchain..."}
            </h2>
            <p className="text-sm text-slate-500 mb-8">
              {processingStage === 'DELAY' 
                ? "Establishing secure connection. You can cancel this operation before it completes." 
                : "Finalizing transaction. Please do not close this window."}
            </p>

            {/* Cancel Button (Only available during the Delay phase) */}
            {processingStage === 'DELAY' ? (
              <button
                onClick={handleCancelProcessing}
                className="w-full border-2 border-red-500 text-red-500 font-bold py-3.5 rounded-xl hover:bg-red-50 transition-colors"
              >
                Cancel Transfer
              </button>
            ) : (
              <div className="w-full bg-slate-100 text-slate-400 font-bold py-3.5 rounded-xl border-2 border-transparent cursor-not-allowed">
                Locking in funds...
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL 3: SUCCESS SUCCESS --- */}
      {transferSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Transfer Successful</h2>
            
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-6 mb-6">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Transaction Ref</p>
              <p className="font-mono text-slate-700 font-medium">{transactionRef}</p>
            </div>

            <button
              onClick={() => {
                setTransferSuccess(false);
                setAmount("");
                setRemark("");
                fetchBanking(); // Refresh balance
              }}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default TransferMoney;