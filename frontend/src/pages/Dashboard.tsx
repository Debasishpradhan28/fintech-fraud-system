import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import SummaryCard from "../components/SummaryCard";
import DashboardBanner from "../components/DashboardBanner";

function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [, setDashboard] = useState<any>(null);
  const [ showSimulator, setShowSimulator] = useState(false);
  const [amount,setAmount] = useState(50000);

  const [device,setDevice] = useState("KNOWN");

  const [location,setLocation] = useState("KNOWN");

  const [receiverRisk,setReceiverRisk] = useState("LOW");

  const [trustScore,setTrustScore] = useState(700);

  const [simulation,setSimulation] = useState<any>(null);
  const [riskThreshold, setRiskThreshold] = useState(70);

  useEffect(() => {
    fetchSummary();
    fetchAlerts();
    fetchDashboard();
    const saved = localStorage.getItem("trustguardSettings");

if(saved){

 const settings = JSON.parse(saved);

 setRiskThreshold(settings.riskThreshold ?? 70);

}
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDashboard(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/fraud/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSummary(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/fraud/alerts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlerts(response.data.alerts ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  if (!summary) {
    return (
      <div className="p-10">
        Loading Dashboard...
      </div>
    );
  }

const generateAiSummary = (
 risk:number,
 amount:number,
 device:string,
 location:string,
 receiverRisk:string,
 trustScore:number
)=>{

 const reasons = [];

 if(amount >= 50000){
  reasons.push(
   "a high-value transaction"
  );
 }

 if(device==="NEW"){
  reasons.push(
   "an unrecognized device"
  );
 }

 if(location==="NEW"){
  reasons.push(
   "an unusual location"
  );
 }

 if(receiverRisk==="HIGH"){
  reasons.push(
   "a high-risk recipient"
  );
 }

 if(trustScore < 500){
  reasons.push(
   "a low trust score"
  );
 }

 return `
This transaction is classified as ${risk >= 180
 ? "CRITICAL"
 : risk >= 120
 ? "HIGH"
 : risk >= 60
 ? "MEDIUM"
 : "LOW"} risk because it involves ${reasons.join(", ")}.

These indicators resemble patterns commonly associated with account takeover, mule activity, or unauthorized fund movement.

Recommended action: Perform manual review before approving the transaction.
`;

};
const runSimulation = ()=>{

 let risk = 0;
 let financialRisk = 0;
 const reasons:string[] = [];

 const recommendations:string[] = [];

 const breakdown = [];

 if(amount>=50000){

 risk+=100;

 financialRisk+=100;

 reasons.push(
 "Large transaction exceeds safe threshold."
 );

 recommendations.push(
 "Request customer verification."
 );

 breakdown.push({
  label:"Large Transaction",
  score:100
 });

}

 if(device==="NEW"){

  risk += 40;

  breakdown.push({
   label:"Unknown Device",
   score:40
  });

 }

 if(location==="NEW"){

  risk += 30;

  breakdown.push({
   label:"Unknown Location",
   score:30
  });

 }

 if(receiverRisk==="MEDIUM"){

  risk += 20;

  breakdown.push({
   label:"Medium Risk Receiver",
   score:20
  });

 }

 if(receiverRisk==="HIGH"){

  risk += 40;

  breakdown.push({
   label:"High Risk Receiver",
   score:40
  });

 }

 if(trustScore < 500){

  risk += 30;

  breakdown.push({
   label:"Low Trust Score",
   score:30
  });

 }
 let verdict = "LOW";

if(risk >= riskThreshold + 80){

 verdict = "CRITICAL";

}else if(risk >= riskThreshold + 40){

 verdict = "HIGH";

}else if(risk >= riskThreshold){

 verdict = "MEDIUM";

}

 setSimulation({

 risk,

 breakdown,

 verdict,
 
 fraudProbability:
 Math.min(
  Math.round(risk / 2),
  100
 ),

 confidence:
 risk >= 180
 ? 96
 : risk >= 120
 ? 88
 : risk >= 60
 ? 72
 : 45,

 aiSummary:
 generateAiSummary(
  risk,
  amount,
  device,
  location,
  receiverRisk,
  trustScore
 )
 

});

};
  return (
    <Layout>
      <DashboardBanner/>
      <PageHeader
        title="Dashboard"
        subtitle="Real-time fraud monitoring, alerts, and trust metrics"
      />
      <div className="mt-4 mb-6">

  <button
    onClick={() =>
      setShowSimulator(true)
    }
    className="
    bg-gradient-to-r
    from-red-600
    to-orange-600

    text-white

    px-5
    py-3

    rounded-2xl

    shadow-lg

    hover:scale-105

    transition
    "
  >

    🚀 Fraud Simulator

  </button>

</div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <SummaryCard title="Total Transactions" value={summary.totalTransactions} />
        <SummaryCard title="High Risk" value={summary.highRiskTransactions} />
        <SummaryCard title="Fraud Alerts" value={summary.fraudAlerts} />
        <SummaryCard title="Avg Trust Score" value={summary.averageTrustScore} />
      </div>

      <div className="mt-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Fraud Alerts</h2>

          <div className="space-y-4">
            {alerts.map((alert: any) => (
              <div key={alert.id} className="border rounded-xl p-4 hover:bg-slate-50">
                <div className="flex justify-between">
                  <div className="font-semibold">🚨 {alert.alert_type}</div>
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                    {alert.severity}
                  </span>
                </div>

                <div className="text-sm text-slate-500 mt-2">
                  Risk Score: {alert.risk_score ?? "N/A"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">How TrustGuard Protects Users</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>🛡 Behavioral Analytics</div>
          <div>📱 Device Intelligence</div>
          <div>🚨 Fraud Detection</div>
          <div>⭐ Trust Scoring</div>
          <div>📊 Risk Monitoring</div>
          <div>🔍 Investigation Engine</div>
        </div>
      </div>
{
 showSimulator && (

<div
 className="
 fixed
 inset-0
 bg-black/50
 flex
 items-center
 justify-center
 z-50
 "
>

<div
 className="
 bg-white
 rounded-3xl
 w-[1100px]
 max-w-[95vw]
 max-h-[90vh]
 overflow-y-auto
 p-8
 "
>
<div
 className="
 flex
 justify-between
 items-center
 mb-8
 "
>

<h2
 className="
 text-2xl
 font-bold
 "
>
🚀 Fraud Simulator
</h2>

<button
 onClick={()=>
  setShowSimulator(false)
 }
>
✕
</button>

</div>

<div
 className="
 grid
 lg:grid-cols-2
 gap-8
 "
>

<div
 className="
 bg-slate-50
 rounded-2xl
 p-6
 "
>

<h3
 className="
 text-lg
 font-bold
 mb-4
 "
>
Simulation Inputs
</h3>
<h4
 className="
 font-semibold
 mb-3
 "
>
Quick Scenarios
</h4>

<div
 className="
 flex
 flex-wrap
 gap-2
 mb-6
 "
>

<button

 onClick={()=>{
  setAmount(100000);
  setDevice("NEW");
  setLocation("NEW");
  setReceiverRisk("HIGH");
  setTrustScore(350);
 }}

 className="
 px-4
 py-2
 rounded-full
 bg-red-100
 hover:bg-red-200
 "
>

Money Mule

</button>

<button

 onClick={()=>{
  setAmount(80000);
  setDevice("NEW");
  setLocation("KNOWN");
  setReceiverRisk("LOW");
  setTrustScore(450);
 }}

 className="
 px-4
 py-2
 rounded-full
 bg-yellow-100
 hover:bg-yellow-200
 "
>

Account Takeover

</button>

<button

 onClick={()=>{
  setAmount(5000);
  setDevice("KNOWN");
  setLocation("KNOWN");
  setReceiverRisk("LOW");
  setTrustScore(800);
 }}

 className="
 px-4
 py-2
 rounded-full
 bg-green-100
 hover:bg-green-200
 "
>

Safe User

</button>

</div>
<p className="mb-2">
Transaction Amount
</p>

<input
 type="range"
 min="1000"
 max="200000"
 step="1000"
 value={amount}
 onChange={(e)=>
 setAmount(
  Number(e.target.value)
 )
 }
/>

<div
 className="
 text-xl
 font-bold
 mb-6
 "
>
₹{amount.toLocaleString()}
</div>
<p className="font-semibold mb-2">
Device
</p>

<div
 className="
 flex
 gap-3
 mb-6
 "
>

<button

 onClick={()=>
 setDevice("KNOWN")
 }

 className={`
 px-4
 py-2
 rounded-full

 ${
 device==="KNOWN"
 ? "bg-blue-600 text-white"
 : "bg-slate-100"
 }
 `}
>

Known Device

</button>

<button

 onClick={()=>
 setDevice("NEW")
 }

 className={`
 px-4
 py-2
 rounded-full

 ${
 device==="NEW"
 ? "bg-red-600 text-white"
 : "bg-slate-100"
 }
 `}
>

New Device

</button>

</div>
<p className="font-semibold mb-2">
Location
</p>

<div
 className="
 flex
 gap-3
 mb-6
 "
>

<button

 onClick={()=>
 setLocation("KNOWN")
 }

 className={`
 px-4
 py-2
 rounded-full

 ${
 location==="KNOWN"
 ? "bg-green-600 text-white"
 : "bg-slate-100"
 }
 `}
>

Known Location

</button>

<button

 onClick={()=>
 setLocation("NEW")
 }

 className={`
 px-4
 py-2
 rounded-full

 ${
 location==="NEW"
 ? "bg-orange-600 text-white"
 : "bg-slate-100"
 }
 `}
>

New Location

</button>

</div>
<p className="font-semibold mb-2">
Receiver Risk
</p>

<select

 value={receiverRisk}

 onChange={(e)=>
 setReceiverRisk(
  e.target.value
 )
 }

 className="
 w-full
 border
 rounded-xl
 p-3
 mb-6
 "
>

<option>LOW</option>
<option>MEDIUM</option>
<option>HIGH</option>

</select>
<p className="font-semibold mb-2">
Trust Score
</p>

<input

 type="range"
 min="300"
 max="900"
 value={trustScore}
 onChange={(e)=>
 setTrustScore(
  Number(e.target.value)
 )
 }

 className="w-full"
/>

<div
 className="
 text-lg
 font-bold
 mb-6
 "
>
{trustScore}
</div>
<button

 onClick={runSimulation}

 className="
 w-full
 bg-red-600
 text-white
 py-3
 rounded-xl
 "
>

Run Simulation

</button>

</div>

<div
 className="
 border
 rounded-2xl
 p-6
 "
>

{
 !simulation
 ?

 (
  <div
   className="
   text-center
   text-gray-500
   mt-20
   "
  >
   Run a simulation to view risk analysis
  </div>
 )

 :

 (
  <div>

   <h3
    className="
    text-xl
    font-bold
    mb-4
    "
   >
    Simulation Result
   </h3>
   

   <div
    className="
    h-6
    bg-slate-200
    rounded-full
    overflow-hidden
    "
   >

    <div

     className="
     h-full
     bg-gradient-to-r
     from-green-500
     via-yellow-500
     to-red-600
     "

     style={{
      width:
      `${Math.min(
       simulation.risk,
       200
      ) / 2}%`
     }}

    />

   </div>

   <div
    className="
    text-6xl
    font-bold
    mt-6
    "
   >
    {simulation.risk}
   </div>

   <div
    className="
    text-red-600
    text-2xl
    font-bold
    "
   >
    {
     Math.min(
      Math.round(
       simulation.risk / 2
      ),
      100
     )
    }%
   </div>
   

   <div className="text-gray-500">
    Fraud Probability
    <div className="mt-4">

 <div
  className="
  text-blue-600
  text-2xl
  font-bold
  "
 >
  {simulation.confidence}%
 </div>

 <div className="text-gray-500">
  Confidence Score
 </div>

</div>
    <h4
 className="
 mt-8
 mb-4
 text-lg
 font-bold
 "
>
Risk Contributors
</h4>

<div className="space-y-3">

{
 simulation.breakdown.map(
 (item:any,index:number)=>(

<div

 key={index}

 className="
 flex
 justify-between
 bg-red-50
 rounded-xl
 p-3
 "
>

 <span>
  {item.label}
 </span>

 <span
  className="
  font-bold
  text-red-600
  "
 >
  +{item.score}
 </span>

</div>

 ))
}

</div>
<h4
 className="
 mt-8
 mb-4
 text-lg
 font-bold
 "
>
Recommended Actions
</h4>

<div className="space-y-3">

{
 simulation.risk > 150 &&

 <div
  className="
  bg-red-100
  p-3
  rounded-xl
  "
 >
  🔴 Freeze Account Immediately
 </div>
}

{
 simulation.risk > 100 &&

 <div
  className="
  bg-orange-100
  p-3
  rounded-xl
  "
 >
  🟠 Escalate To Fraud Team
 </div>
}

{
 simulation.risk > 70 &&

 <div
  className="
  bg-yellow-100
  p-3
  rounded-xl
  "
 >
  🟡 Manual Investigation Required
 </div>
}

<div
 className="
 bg-blue-100
 p-3
 rounded-xl
 "
>
🔵 Monitor Future Activity
</div>

</div>
<div
 className="
 mt-8

 rounded-2xl

 p-5

 border-l-4

 border-red-500

 bg-red-50
 "
>

<h4
 className="
 font-bold
 mb-2
 "
>
🤖 AI Verdict
</h4>

<div
 className={`
 mt-4

 inline-flex

 px-4
 py-2

 rounded-full

 font-bold

 ${
  simulation.verdict==="CRITICAL"
  ? "bg-red-100 text-red-700"

  : simulation.verdict==="HIGH"
  ? "bg-orange-100 text-orange-700"

  : simulation.verdict==="MEDIUM"
  ? "bg-yellow-100 text-yellow-700"

  : "bg-green-100 text-green-700"
 }
 `}
>

{simulation.verdict}

</div>

</div>
   </div>

  </div>
 )
}

</div>

</div>

</div>

</div>

 )
}

</Layout>
);
}

export default Dashboard;