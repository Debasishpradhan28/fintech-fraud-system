import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell
} from "recharts";
import type { RiskData, FraudTrend, SuspiciousUser } from "../pages/Analytics";

interface AnalyticsChartsProps {
  riskData: RiskData[];
  fraudTrend: FraudTrend[];
  trustData: any[]; // Kept for your future expansion
  topUsers: SuspiciousUser[];
}

// Map risk levels to specific hex colors for instant visual diagnosis
const getRiskColor = (level: string) => {
  const normalizedLevel = level.toUpperCase();
  if (normalizedLevel.includes("LOW")) return "#10b981"; // Emerald Green
  if (normalizedLevel.includes("MEDIUM")) return "#f59e0b"; // Amber
  if (normalizedLevel.includes("HIGH")) return "#ef4444"; // Red
  if (normalizedLevel.includes("CRITICAL")) return "#7f1d1d"; // Dark Red
  return "#6b7280"; // Gray fallback
};

export default function AnalyticsCharts({
  riskData,
  fraudTrend,
  topUsers,
}: AnalyticsChartsProps) {
  
  return (
    <div className="space-y-6">
      
      {/* Top Row: Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Fraud Transaction Velocity (Replaced LineChart with AreaChart) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Fraud Alerts Velocity</h2>
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md">Trailing 7 Days</span>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={fraudTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="alerts" 
                stroke="#ef4444" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorAlerts)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">System Risk Distribution</h2>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                dataKey="count"
                nameKey="risk_level"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {/* Dynamically assign colors to the slices using Cell */}
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getRiskColor(entry.risk_level)} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row: Top Suspicious Accounts List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">High-Risk Watchlist</h2>
          <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">
            {topUsers.length} Accounts Flagged
          </span>
        </div>

        {topUsers.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-xl">
            No suspicious accounts currently flagged.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {topUsers.map((user) => (
              <div
                key={user.account_number}
                className="group border border-slate-200 rounded-xl p-4 hover:border-red-300 hover:shadow-md hover:bg-red-50/30 cursor-pointer transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-800 group-hover:text-red-700 transition-colors">
                      {user.full_name}
                    </div>
                    <div className="text-sm text-slate-500 font-mono mt-1">
                      {user.account_number}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded font-bold text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                      {user.highest_risk}
                    </div>
                    <div className="text-xs font-semibold text-slate-500 mt-2">
                      Trust Score: <span className="text-slate-800">{user.score}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}