import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import FraudNetworkGraph from "../components/FraudNetworkGraph";
import api from "../services/api";
import { useParams } from "react-router-dom";
import NetworkHeader from "../components/network/NetworkHeader";
import NetworkSummary from "../components/network/NetworkSummary";
import GraphToolbar from "../components/network/GraphToolbar";
import AccountCard from "../components/network/AccountCard";
import SelectedNodeCard from "../components/network/SelectedNodeCard";
import AiInvestigationCard from "../components/network/AiInvestigationCard";
import QuickActionsCard from "../components/network/QuickActionsCard";
import RecentActivityCard from "../components/network/RecentActivityCard";
import InvestigationTimeline from "../components/network/InvestigationTimeline";
import PatternDetectionCard from "../components/network/PatternDetectionCard";
import TransactionFlowExplorer from "../components/network/TransactionFlowExplorer";

function NetworkGraph() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [account, setAccount] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  const { id } = useParams();
  const graphRef = useRef<any>(null);
  
  const fetchNetwork = async () => {
    console.log("Started Fetch");
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/fraud/network/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data;
      setNodes(data.nodes);
      setEdges(data.edges);
      setAccount(data.account);
      setMetrics(data.metrics);
      setTimeline(data.timeline);
      
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchNetwork();
    }
  }, [id]);

  return (
    <Layout>
      <div className="max-w-400 mx-auto space-y-6 pb-12 relative z-0">
        
        {/* Header & High-Level Metrics */}
        <NetworkHeader />
        <NetworkSummary metrics={metrics} account={account} />

        {/* Main Workspace (Graph & Context Sidebar) */}
        <div className="space-y-4">
          <GraphToolbar />
          
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Left Column: Network Graph Interactive Area */}
            <div className="xl:col-span-8 col-span-1 bg-white rounded-3xl shadow-sm border border-slate-200 p-4 h-150 xl:h-187.5 relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
              <FraudNetworkGraph
                ref={graphRef}
                nodes={nodes}
                edges={edges}
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
              />
            </div>
            
            {/* Right Column: Contextual Sidebar */}
            <div className="xl:col-span-4 col-span-1 flex flex-col space-y-5 h-auto xl:h-187.5 overflow-y-auto pr-2 pb-2">
              <AccountCard account={account} />
              <SelectedNodeCard node={selectedNode} edges={edges} />
              <AiInvestigationCard node={selectedNode} />
              <QuickActionsCard selectedNode={selectedNode} />
              <RecentActivityCard timeline={timeline} />
            </div>
            
          </div>
        </div>

        {/* Deep Dive Investigation Section */}
        <div className="pt-8 mt-8 border-t border-slate-200 space-y-8">
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-slate-800">Deep Dive Analysis</h2>
            <p className="text-slate-500 mt-1">Explore historical events, detected anomalies, and transaction paths.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InvestigationTimeline timeline={timeline} />
            <PatternDetectionCard account={account} timeline={timeline} />
          </div>

          <div className="w-full">
            <TransactionFlowExplorer edges={edges} />
          </div>
        </div>
        
      </div>
    </Layout>
  );
}

export default NetworkGraph;