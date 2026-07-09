import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import api from "../services/api";

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [showNotification, setShowNotification] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(response.data);
      console.log(response.data);

      // Trigger the fund approval notification if the user is a customer
      // Note: In production, you would tie this to a specific flag from your backend 
      // (e.g., response.data.has_new_approved_funds === true)
      if (response.data.user?.role === "CUSTOMER") {
        setShowNotification(true);
        // Auto-hide notification after 6 seconds
        setTimeout(() => setShowNotification(false), 6000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return <Layout>Loading...</Layout>;
  }

  // Dynamically set Quick Actions based on user role
  const quickActions =
    profile.user?.role === "ADMIN"
      ? [
          { icon: "🛡️", title: "Approve Funds", path: "/admin/deposits" },
          { icon: "📊", title: "User Analytics", path: "#" },
          { icon: "🚨", title: "Flagged Accounts", path: "#" },
          { icon: "⚙️", title: "System Settings", path: "#" },
        ]
      : [
          { icon: "📱", title: "Recharge", path: "#" },
          { icon: "🏦", title: "Loans", path: "#" },
          { icon: "🎁", title: "Offers", path: "#" },
          { icon: "🤖", title: "AI Assistant", path: "#" },
        ];

  const handleActionClick = (path: string) => {
    if (path !== "#") {
      navigate(path);
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Profile"
        subtitle="Manage account security and trust information"
      />

      {/* Pop-up Notification for Approved Funds */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="mb-6 bg-green-50 border border-green-200 p-4 rounded-2xl flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-xl">✅</div>
              <div>
                <h3 className="text-green-800 font-bold text-lg">Funds Approved!</h3>
                <p className="text-green-700 text-sm">
                  Your recent deposit has cleared compliance. The funds are now available in your account.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="text-green-600 hover:text-green-800 font-bold px-4"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Profile Card */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 mb-6 shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Welcome Back 👋</h1>
            <p className="mt-2 text-blue-100 text-lg">{profile?.user?.full_name}</p>
            <p className="text-blue-200">{profile?.user?.email}</p>
          </div>
          
          {/* Admin Badge */}
          {profile?.user?.role === "ADMIN" && (
            <div className="bg-amber-500 text-amber-950 px-3 py-1 rounded-lg font-bold text-sm tracking-wider uppercase shadow-sm">
              Administrator
            </div>
          )}
        </div>

        <div className="mt-6">
          <span className="bg-white/20 px-5 py-2.5 rounded-full font-medium">
            Trust Score: <span className="font-bold ml-1">{profile?.trustScore || 500}</span>
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Search User</h2>
        <input
          type="text"
          placeholder="Search email or account number"
          className="w-full border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-slate-50 focus:bg-white"
        />
      </div>

      {/* Dynamic Quick Actions */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6 border border-slate-100">
        <h2 className="text-xl font-bold mb-6">
          {profile?.user?.role === "ADMIN" ? "Admin Controls" : "Quick Actions"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {quickActions.map((item) => (
            <div
              key={item.title}
              onClick={() => handleActionClick(item.path)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div
                className={`h-20 w-20 sm:h-24 sm:w-24 rounded-full flex items-center justify-center text-3xl transition-all duration-300 shadow-sm
                ${
                  item.title === "Approve Funds"
                    ? "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                    : "bg-slate-50 text-slate-700 group-hover:scale-105 group-hover:shadow-md group-hover:bg-blue-50"
                }`}
              >
                {item.icon}
              </div>
              <p className="mt-3 font-medium text-slate-700 text-center text-sm sm:text-base">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Security Alerts */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Security Alerts</h2>
        <div className="space-y-3">
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-100">
            <span className="mr-2">⚠</span> Trust Score Updated
          </div>
          <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100">
            <span className="mr-2">🔐</span> Device Monitoring Active
          </div>
          <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-100">
            <span className="mr-2">✅</span> Account Protected
          </div>
        </div>
      </div>

      {/* Bottom Information Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 border border-slate-100 hover:shadow-md transition">
          <div className="text-2xl mb-2">🎁</div>
          <h3 className="font-bold text-slate-800">Cashback Offers</h3>
          <p className="text-sm text-slate-500 mt-1">View your eligible rewards</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-slate-100 hover:shadow-md transition">
          <div className="text-2xl mb-2">📈</div>
          <h3 className="font-bold text-slate-800">Improve Trust Score</h3>
          <p className="text-sm text-slate-500 mt-1">Learn how to boost your rating</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-slate-100 hover:shadow-md transition">
          <div className="text-2xl mb-2">💡</div>
          <h3 className="font-bold text-slate-800">Financial Tips</h3>
          <p className="text-sm text-slate-500 mt-1">Smart secure banking habits</p>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-8 mb-4">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
          className="bg-red-50 text-red-600 border border-red-200 font-bold px-8 py-3.5 rounded-xl hover:bg-red-600 hover:text-white transition-colors w-full sm:w-auto"
        >
          Logout
        </button>
      </div>
    </Layout>
  );
}

export default Profile;