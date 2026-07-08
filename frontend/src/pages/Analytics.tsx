import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import AnalyticsCharts from "../components/AnalyticsCharts";
import PageHeader from "../components/PageHeader";

// Define TypeScript interfaces for your data
export interface RiskData {
  risk_level: string;
  count: number;
}

export interface FraudTrend {
  day: string;
  alerts: number;
}

export interface SuspiciousUser {
  account_number: string;
  full_name: string;
  highest_risk: string;
  score: number;
}

function Analytics() {
  const [riskData, setRiskData] = useState<RiskData[]>([]);
  const [trustData, setTrustData] = useState<any[]>([]);
  const [fraudTrend, setFraudTrend] = useState<FraudTrend[]>([]);
  const [topUsers, setTopUsers] = useState<SuspiciousUser[]>([]);
  
  // UX: Loading state
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Execute all promises concurrently for faster loading
      const [riskRes, trustRes, trendRes, usersRes] = await Promise.all([
        api.get("/analytics/risk-distribution", { headers }),
        api.get("/analytics/trust-distribution", { headers }),
        api.get("/analytics/fraud-trend", { headers }),
        api.get("/analytics/top-risk-users", { headers }),
      ]);

      setRiskData(riskRes.data);
      setTrustData(trustRes.data);
      setFraudTrend(trendRes.data);
      setTopUsers(usersRes.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Optional: Auto-refresh every 60 seconds for a "Live" dashboard feel
    const interval = setInterval(fetchAnalytics, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="flex justify-between items-end mb-6">
        <PageHeader
          title="Fraud Analytics"
          subtitle="Real-time transaction monitoring and risk distribution"
        />
        <button 
          onClick={fetchAnalytics}
          className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          {/* Live Indicator Dot */}
          <span className="relative flex h-2.5 w-2.5 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          Refresh Data
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <AnalyticsCharts
          riskData={riskData}
          fraudTrend={fraudTrend}
          trustData={trustData}
          topUsers={topUsers}
        />
      )}
    </Layout>
  );
}

export default Analytics;