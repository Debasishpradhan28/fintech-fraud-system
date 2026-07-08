import { useEffect, useState } from "react";
import {
    FaUserShield,
    FaSearch,
    FaUsers,
    FaUserTie,
    FaUserCog
} from "react-icons/fa";
import api from "../../services/api";

function RoleManagementCard() {
    const [email, setEmail] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [stats, setStats] = useState({
        users: 0,
        analysts: 0,
        admins: 0
    });
    const [analysts, setAnalysts] = useState<any[]>([]);
    const [searchedUser, setSearchedUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    
    // Dialog States
    const [showGrantDialog, setShowGrantDialog] = useState(false);
    const [grantLoading, setGrantLoading] = useState(false);
    
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);
    const [removeLoading, setRemoveLoading] = useState(false);
    const [selectedAnalyst, setSelectedAnalyst] = useState<any>(null);

    const loadStats = async () => {
        try {
            const response = await api.get("/admin/stats");
            setStats(response.data.stats);
        } catch (err) {
            console.error("Error loading stats", err);
        }
    };

    const loadAnalysts = async () => {
        try {
            const response = await api.get("/admin/analysts");
            setAnalysts(response.data);
        } catch (err) {
            console.error("Error loading analysts", err);
        }
    };

    const searchUsers = async (value: string) => {
        setEmail(value);
        if (value.length < 2) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await api.get(`/admin/search?query=${encodeURIComponent(value)}`);
            setSuggestions(response.data);
        } catch (error) {
            console.error("Search error", error);
        }
    };

    const searchUser = async () => {
        if (!email.trim()) return;
        try {
            setLoading(true);
            const response = await api.get(`/admin/user/${encodeURIComponent(email)}`);
            setSearchedUser(response.data.user);
        } catch (err: any) {
            setSearchedUser(null);
            alert(err.response?.data?.message || "User not found");
        } finally {
            setLoading(false);
        }
    };

    const grantAccess = async () => {
        if (!searchedUser) return;
        
        try {
            setGrantLoading(true);
            
            // 1. Perform the actual update on the server
            await api.patch("/admin/grant", {
                email: searchedUser.email
            });
            
            // 2. Close the dialog instantly upon success
            setShowGrantDialog(false);
            
            // 3. Optimistically update the UI so it feels fast
            setSearchedUser((prev: any) => ({ ...prev, role: "ANALYST" }));
            setSuggestions([]);
            
            // 4. Refresh background data safely
            try {
                await loadStats();
                await loadAnalysts();
                const updated = await api.get(`/admin/user/${encodeURIComponent(searchedUser.email)}`);
                setSearchedUser(updated.data.user);
            } catch (refreshErr) {
                console.error("Background refresh failed (user was still updated successfully):", refreshErr);
            }
            
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || err.message || "Failed to grant access.");
        } finally {
            setGrantLoading(false);
        }
    };

    const removeAnalyst = async () => {
        if (!selectedAnalyst) return;
        
        try {
            setRemoveLoading(true);
            
            // 1. Perform the actual removal on the server
            await api.patch(`/admin/remove/${selectedAnalyst.id}`);
            
            // 2. Close the dialog instantly upon success
            setShowRemoveDialog(false);
            
            // 3. Optimistically update the searched user UI if we are viewing them
            if (searchedUser?.id === selectedAnalyst.id) {
                setSearchedUser((prev: any) => ({ ...prev, role: "CUSTOMER" }));
            }
            
            // 4. Refresh background data safely
            try {
                await loadStats();
                await loadAnalysts();
                if (searchedUser?.id === selectedAnalyst.id) {
                    const updated = await api.get(`/admin/user/${encodeURIComponent(selectedAnalyst.email)}`);
                    setSearchedUser(updated.data.user);
                }
            } catch (refreshErr) {
                console.error("Background refresh failed after removal:", refreshErr);
            }
            
        } catch (err: any) {
            console.error("Error removing analyst", err);
            alert(err.response?.data?.message || "Failed to remove analyst access. Please try again.");
        } finally {
            setRemoveLoading(false);
            setSelectedAnalyst(null);
        }
    };

    useEffect(() => {
        loadStats();
        loadAnalysts();
    }, []);

    return (
        <>
            <div className="space-y-6 max-w-7xl mx-auto relative z-0">
                {/* ================= Stats ================= */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-blue-50 rounded-2xl">
                                <FaUsers className="text-blue-600" size={28} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Users</p>
                                <h2 className="text-3xl font-bold text-slate-800">{stats.users}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-green-50 rounded-2xl">
                                <FaUserShield className="text-green-600" size={28} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Analysts</p>
                                <h2 className="text-3xl font-bold text-slate-800">{stats.analysts}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-purple-50 rounded-2xl">
                                <FaUserCog className="text-purple-600" size={28} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Admins</p>
                                <h2 className="text-3xl font-bold text-slate-800">{stats.admins}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= Search ================= */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-blue-50 rounded-xl">
                            <FaSearch className="text-blue-600" size={18} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Search User</h2>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                autoComplete="off"
                                spellCheck={false}
                                value={email}
                                onChange={(e) => searchUsers(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        setSuggestions([]);
                                        searchUser();
                                    }
                                }}
                                placeholder="Enter registered email address..."
                                className="w-full border border-slate-300 rounded-2xl p-4 pl-5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-700 bg-slate-50 hover:bg-white focus:bg-white"
                            />
                            
                            {suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto overflow-hidden">
                                    {suggestions.map((user: any) => (
                                        <div
                                            key={user.id}
                                            onClick={() => {
                                                setEmail(user.email);
                                                setSuggestions([]);
                                                setSearchedUser(user);
                                            }}
                                            className="p-4 border-b border-slate-100 last:border-b-0 hover:bg-blue-50 cursor-pointer transition-colors"
                                        >
                                            <div className="font-semibold text-slate-800">{user.full_name}</div>
                                            <div className="text-sm text-slate-500">{user.email}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                setSuggestions([]);
                                searchUser();
                            }}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-4 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm sm:w-auto w-full flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block"></span>
                                    Searching...
                                </>
                            ) : (
                                "Search"
                            )}
                        </button>
                    </div>
                </div>

                {/* ================= User Details ================= */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">User Details</h2>
                    
                    {!searchedUser ? (
                        <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center py-16">
                            <div className="text-slate-400 mb-2 flex justify-center">
                                <FaUserTie size={48} opacity={0.5} />
                            </div>
                            <p className="text-slate-500 font-medium">Search a user to display information.</p>
                        </div>
                    ) : (
                        <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 border-b border-slate-200 pb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">{searchedUser.full_name}</h2>
                                    <p className="text-slate-500 mt-1">{searchedUser.email}</p>
                                </div>
                                <button
                                    onClick={() => setShowGrantDialog(true)}
                                    disabled={searchedUser.role === "ANALYST" || searchedUser.role === "ADMIN"}
                                    className={`
                                        px-6 py-3 rounded-xl font-semibold transition shadow-sm w-full sm:w-auto
                                        ${searchedUser.role === "CUSTOMER" 
                                            ? "bg-blue-600 hover:bg-blue-700 text-white" 
                                            : "bg-slate-200 text-slate-500 cursor-not-allowed"}
                                    `}
                                >
                                    {searchedUser.role === "CUSTOMER" 
                                        ? "Grant Analyst Access" 
                                        : searchedUser.role === "ANALYST" 
                                            ? "Already Analyst" 
                                            : "Administrator"}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <p className="text-sm font-medium text-slate-500 mb-1">Role</p>
                                    <h3 className="font-semibold text-slate-800 text-lg capitalize">{searchedUser.role}</h3>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <p className="text-sm font-medium text-slate-500 mb-1">User ID</p>
                                    <h3 className="font-semibold text-slate-800 text-lg">#{searchedUser.id}</h3>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <p className="text-sm font-medium text-slate-500 mb-1">Status</p>
                                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        Active
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ================= Analysts ================= */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Current Analysts</h2>
                    
                    {analysts.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-2xl">
                            No analysts found.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {analysts.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-colors gap-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                            {user.full_name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{user.full_name}</h3>
                                            <p className="text-sm text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setSelectedAnalyst(user);
                                            setShowRemoveDialog(true);
                                        }}
                                        className="bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 font-medium px-6 py-2.5 rounded-xl transition-colors w-full sm:w-auto"
                                    >
                                        Remove Access
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ================= Modals ================= */}
            
            {/* Grant Access Modal */}
            {showGrantDialog && searchedUser && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-[430px] p-8">
                        <h2 className="text-2xl font-bold text-slate-800">Grant Analyst Access</h2>
                        <p className="mt-3 text-slate-500 leading-relaxed">
                            This user will gain access to analytics, investigations, fraud monitoring, and dashboards.
                        </p>
                        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <h3 className="font-semibold text-slate-800">{searchedUser.full_name}</h3>
                            <p className="text-slate-500 text-sm">{searchedUser.email}</p>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setShowGrantDialog(false)}
                                className="px-5 py-2 rounded-xl border border-slate-300 font-medium text-slate-700 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={grantAccess}
                                disabled={grantLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2 font-medium transition disabled:opacity-50"
                            >
                                {grantLoading ? "Granting..." : "Grant Access"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Remove Access Modal */}
            {showRemoveDialog && selectedAnalyst && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-[430px] p-8">
                        <h2 className="text-2xl font-bold text-slate-800">Remove Analyst Access</h2>
                        <p className="mt-3 text-slate-500 leading-relaxed">
                            Are you sure you want to revoke analyst privileges for this user? They will lose access to all admin dashboards immediately.
                        </p>
                        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <h3 className="font-semibold text-slate-800">{selectedAnalyst.full_name}</h3>
                            <p className="text-slate-500 text-sm">{selectedAnalyst.email}</p>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setShowRemoveDialog(false)}
                                className="px-5 py-2 rounded-xl border border-slate-300 font-medium text-slate-700 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={removeAnalyst}
                                disabled={removeLoading}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 py-2 font-medium transition disabled:opacity-50"
                            >
                                {removeLoading ? "Removing..." : "Remove Access"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default RoleManagementCard;