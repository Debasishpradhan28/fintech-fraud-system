import {useEffect,useState } from "react";
import Layout from "../components/Layout";
// import PageHeader from "../components/PageHeader";
import FraudNetworkGraph from "../components/FraudNetworkGraph";
import api from "../services/api";
import { useParams } from "react-router-dom";
import NetworkHeader from "../components/network/NetworkHeader";
import NetworkSummary from "../components/network/NetworkSummary";
import GraphToolbar from "../components/network/GraphToolbar";
import {useRef} from "react";
import AccountCard from "../components/network/AccountCard";
import SelectedNodeCard from "../components/network/SelectedNodeCard";
import AiInvestigationCard from "../components/network/AiInvestigationCard";
import QuickActionsCard from "../components/network/QuickActionsCard";
import RecentActivityCard from "../components/network/RecentActivityCard";
import InvestigationTimeline from "../components/network/InvestigationTimeline";
import PatternDetectionCard from "../components/network/PatternDetectionCard";
import TransactionFlowExplorer from "../components/network/TransactionFlowExplorer";

function NetworkGraph(){

 const [nodes, setNodes] = useState<any[]>([]);
 const [edges, setEdges] = useState<any[]>([]);

const [account, setAccount] = useState<any>(null);
const [metrics, setMetrics] = useState<any>(null);
const [timeline, setTimeline] = useState<any[]>([]);
// const [patterns, setPatterns] = useState<any[]>([]);
// const [recommendations, setRecommendations] = useState<any[]>([]);
// const [aiSummary, setAiSummary] = useState("");
const [selectedNode, setSelectedNode] = useState<any>(null);
// const [search, setSearch] = useState("");
// const [filter, setFilter] = useState("ALL");
// const [filterOpen, setFilterOpen] = useState(false);
const { id } = useParams();
const graphRef = useRef<any>(null);
 const fetchNetwork = async () => {
console.log("Started Fetch");
 try{

  const token =
  localStorage.getItem("token");

  const response =
  await api.get(

   `/fraud/network/${id}`,

   {
    headers:{
     Authorization:`Bearer ${token}`
    }
   }

  );

  const data = response.data;
  setNodes(data.nodes);
  setEdges(data.edges);
  setAccount(data.account);
  setMetrics(data.metrics);
  setTimeline(data.timeline);
//   setPatterns(data.patterns);
//   setRecommendations(
//    data.recommendations
//   );
//   setAiSummary(
//    data.aiSummary
//   );
console.log(response.data);
 }catch(error){
  console.log(error);
 }

};

 useEffect(()=>{
 if(id){
  fetchNetwork();
 }
 },[id]);

 return(

  <Layout>

   <NetworkHeader />

   <NetworkSummary  metrics={metrics}   account={account}/>
   <div className="lg:col-span-8">
    <GraphToolbar/>
    <div className="grid xl:grid-cols-12 grid-cols-1 gap-6" >
        <div className="xl:col-span-8 col-span-1 bg-white rounded-3xl shadow-lg border p-4 h-162.5 overflow-hidden hover:shadow-xl transition-all duration-300">
            <FraudNetworkGraph
                ref={graphRef}
                nodes={nodes}
                edges={edges}
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
            />
        </div>
        <div className="xl:col-span-4 col-span-1 sm:h-105 space-y-6 overflow-y-auto pr-2">
        <AccountCard account={account} />
        <SelectedNodeCard  node={selectedNode} edges={edges} />
        <AiInvestigationCard node={selectedNode} />
        <QuickActionsCard selectedNode={selectedNode} />
        <RecentActivityCard timeline={timeline}/>
       </div>
    </div>
</div>
<div className="mt-8">

<InvestigationTimeline

timeline={timeline}

/>
<PatternDetectionCard

account={account}

timeline={timeline}

/>
<TransactionFlowExplorer edges={edges} />

</div>
  </Layout>

 );

}

export default NetworkGraph;