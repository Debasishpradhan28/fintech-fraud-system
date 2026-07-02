import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import {
 useEffect,
 useState
}
from "react";

import {
 useParams
}
from "react-router-dom";

import api
from "../services/api";

function FraudInvestigation(){
    const { id } = useParams();
const [
 details,
 setDetails
]
=
useState<any>(null);
const [
 showBehavior,
 setShowBehavior
]
=
useState(false);
const [
 timeline,
 setTimeline
]
=
useState([]);
const [notes,setNotes] = useState("");

useEffect(()=>{

 fetchDetails();
 fetchTimeline();

},[]);
const fetchTimeline =
async()=>{

 try{

  const token =
  localStorage.getItem(
   "token"
  );

  const response =
  await api.get(
   `/fraud/investigation/${id}/timeline`,
   {
    headers:{
     Authorization:
     `Bearer ${token}`
    }
   }
  );
  // console.log("Timeline response", response.data);
  setTimeline(
   response.data.history
  );
  // console.log("Timeline State:",response.data.history);

 }catch(error){

  console.log(error);

 }

};
const fetchDetails =
async ()=>{
 console.log("Started Fetch");
 try{
  console.log("ID =", id);
  const token =
  localStorage.getItem(
   "token"
  );

  const response =
  await api.get(
   `/fraud/investigation/${id}`,
   {
    headers:{
     Authorization:
     `Bearer ${token}`
    }
   }
  );
  console.log("Response =", response.data);
  setDetails(
   response.data || ""
  );
  setNotes(
   response.data.notes || ""
  );
 }catch(error){

  console.log(error);

 }

};
const handleStatusChange =
async (newStatus:string)=>{

 try{

  const token =
  localStorage.getItem("token");

  await api.put(

   `/fraud/alerts/${id}/status`,

   {
    status:newStatus,
    notes: notes
   },

   {
    headers:{
     Authorization:
     `Bearer ${token}`
    }
   }

  );

  setDetails({

   ...details,

   investigation_status:
   newStatus

  });

 }catch(error){

  console.log(error);

 }

};
if(!details){

 return(

  <Layout>

   Loading Investigation...

  </Layout>

 );

}
const behaviorRisk =

(details.location
 ? 0
 : 30)

+

(details.device_fingerprint
 ? 0
 : 40);
const behaviorLevel =
 behaviorRisk > 60
 ? "HIGH"
 : behaviorRisk > 30
 ? "MEDIUM"
 : "LOW";

const recommendations = [];

if(details?.risk_score > 120){

 recommendations.push(
  "Freeze account immediately"
 );

 recommendations.push(
  "Escalate to fraud team"
 );

}

if(details?.risk_score > 70){

 recommendations.push(
  "Require manual review"
 );

}

if(details?.risk_score > 100){

 recommendations.push(
  "Monitor future transactions"
 );

}

 return(

  <Layout>

   <PageHeader

    title="Fraud Investigation"

    subtitle="
    Analyze suspicious transactions
    "

   />
   

   <div
    className="
    bg-white
    rounded-2xl
    shadow
    p-6
   "
   >

    <h2
     className="
     text-xl
     font-bold
     mb-6
    "
    >
     Investigation Details
    </h2>

    <div
     className="
     grid
     md:grid-cols-2
     gap-6
    "
    >

      <div>
        Transaction ID
      </div>

      <div>
        {details.transaction_reference}
      </div>

      <div>
        Sender
      </div>

      <div>
        {details.sender_account}
      </div>

      <div>
        Receiver
      </div>

      <div>
        {details.receiver_account}
      </div>

      <div>
        Amount
      </div>

      <div>
        ₹{details.amount}
      </div>

      <div>
        Risk Score
      </div>

      <div>
        {details.risk_score}
      </div>

      <div>
        Severity
      </div>

      <div>
        {details.severity}
      </div>
      <div>
 Investigation Status
</div>

<div>

 <select

  value={
   details.investigation_status
   || "OPEN"
  }

  onChange={(e)=>
   handleStatusChange(
    e.target.value
   )
  }

  className="
  border
  rounded-lg
  p-2
  "

 >

  <option>
   OPEN
  </option>

  <option>
   UNDER REVIEW
  </option>

  <option>
   RESOLVED
  </option>

  <option>
   FALSE POSITIVE
  </option>

 </select>

</div>
<div
 className="
 bg-white
 rounded-2xl
 shadow
 p-6
 mt-6
"
>

<h2 className="text-xl font-bold mb-4">
 Analyst Notes
</h2>

<textarea

 value={notes}

 onChange={(e)=>
 setNotes(
  e.target.value
 )
 }

 rows={5}

 className="
 w-full
 border
 rounded-xl
 p-3
 "
/>

<button

 onClick={()=>
 handleStatusChange(
  details.investigation_status
 )
 }

 className="
 mt-4
 bg-blue-600
 text-white
 px-5
 py-2
 rounded-xl
 "
>

 Save Notes

</button>

</div>
<div
 className="
 bg-white
 rounded-2xl
 shadow
 p-6
 mt-6
 "
>

<h2
 className="
 text-xl
 font-bold
 mb-4
 "
>
 Investigation Decision
</h2>

<div
 className="
 flex
 gap-3
 "
>

<button

 onClick={()=>
 handleStatusChange(
  "FRAUD"
 )
 }

 className="
 bg-red-600
 text-white
 px-4
 py-2
 rounded-xl
 "
>

 Confirm Fraud

</button>

<button

 onClick={()=>
 handleStatusChange(
  "FALSE POSITIVE"
 )
 }

 className="
 bg-green-600
 text-white
 px-4
 py-2
 rounded-xl
 "
>

 Genuine User

</button>

</div>

</div>
<div
 className="
 bg-white
 rounded-2xl
 shadow
 p-6
 mt-6
 "
>

 <h2
  className="
  text-xl
  font-bold
  mb-4
 "
 >
  Risk Meter
 </h2>

 <div
  className="
  w-full
  bg-slate-200
  rounded-full
  h-5
  "
 >

  <div

   className="
   bg-red-500
   h-5
   rounded-full
   transition-all
   "

   style={{
    width: `${Math.min(details.risk_score,100)}%`
   }}

  />

 </div>

 <p className="mt-3">

  Current Risk Score:
  <strong>
   {details.risk_score}
  </strong>

 </p>

</div>
<div
 className="
 bg-white
 rounded-2xl
 shadow
 p-6
 mt-6
 "
>

 <h2
  className="
  text-xl
  font-bold
  mb-4
 "
 >
  📜 Alert Timeline
 </h2>

 <div className="space-y-4">

  <div>

   🔴 Alert Created

   <br />

   <span
    className="
    text-sm
    text-slate-500
    "
   >
    {
     new Date(
      details.created_at
     ).toLocaleString()
    }
   </span>

  </div>

  <div>

   🟡 Status

   <br />

   <span
    className="
    font-semibold
    "
   >
    {
     details.investigation_status
    }
   </span>

  </div>

  {
   details.resolved_at && (

    <div>

     🟢 Resolved

     <br />

     <span
      className="
      text-sm
      text-slate-500
      "
     >
      {
       new Date(
        details.resolved_at
       ).toLocaleString()
      }
     </span>

    </div>

   )
  }

 </div>

</div>
<div
 className="
 bg-white
 rounded-2xl
 shadow
 p-6
 mt-6
 "
>

<h2
 className="
 text-xl
 font-bold
 mb-6
 "
>
 Investigation Activity
</h2>

<div
 className="
 space-y-4
 "
>

{
  timeline.length > 0
 ?
 timeline.map(
 (item:any)=>(

  <div

   key={item.id}

   className="
   flex
   gap-4
   "
  >

   <div
    className="
    w-3
    h-3

    mt-2

    rounded-full

    bg-blue-500
    "
   />

   <div>

    <div
     className="
     font-semibold
     "
    >
     {item.action}
    </div>

    <div
     className="
     text-sm
     text-gray-500
     "
    >

     {item.performed_by}

     •

     {
      new Date(
       item.created_at
      ).toLocaleString()
     }

    </div>

   </div>

  </div>

 ))
:

 (
  <div
   className="
   text-gray-500
   text-center
   py-8
   "
  >
   No investigation activity yet
  </div>
 )
}

</div>

</div>
<div
 className="
 bg-white
 rounded-2xl
 shadow
 p-6
 mt-6
 "
>

 <h2
  className="
  text-xl
  font-bold
  mb-4
 "
 >
  Risk Analysis
 </h2>

 <div className="space-y-3">

  {
   details.risk_score > 70 &&
   <div>
    ✓ Large Transaction Risk
   </div>
  }

  {
   details.risk_score > 100 &&
   <div>
    ✓ Behavioral Risk Triggered
   </div>
  }

  {
   details.severity === "HIGH" &&
   <div>
    ✓ High Severity Alert
   </div>
  }

 </div>
 <button

 onClick={()=>
 setShowBehavior(true)
 }

 className="
 mt-4

 bg-indigo-600

 text-white

 px-4

 py-2

 rounded-xl

 hover:bg-indigo-700
 "
>

🧠 Behavior Analysis

</button>

</div>


    </div>
    

   </div>
   

{
 showBehavior && (

<div
 className="
 fixed
 inset-0

 bg-black/40

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

 shadow-2xl

 p-8

 w-150

 max-w-[95vw]

 max-h-[85vh]

 overflow-y-auto
 "
>

<div
 className="
 flex
 justify-between
 items-center
 mb-6
 "
>

<h2
 className="
 text-2xl
 font-bold
 "
>
Behavior Analysis
</h2>

<button

 onClick={()=>
 setShowBehavior(false)
 }

 className="
 text-xl
 "
>
✕
</button>

</div>

<div className="space-y-4">

 <div>

  <div className="text-gray-500">
   Device
  </div>

  <div className="font-semibold">
   {
    details.device_fingerprint
    || "Unknown Device"
   }
  </div>

 </div>

 <div>

  <div className="text-gray-500">
   Location
  </div>

  <div className="font-semibold">
   {
    details.location
    || "Unknown"
   }
  </div>

 </div>

 <div>

  <div className="text-gray-500">
   IP Address
  </div>

  <div>
   {
    details.ip_address
    || "Unknown"
   }
  </div>

 </div>

 <div>

  <div className="text-gray-500">
   Behavior Risk
  </div>

  <div
   className="
   text-red-600
   font-bold
   "
  >
    {behaviorRisk} ({behaviorLevel})
  </div>

 </div>
 <hr className="my-5" />

<h3
 className="
 text-lg
 font-bold
 mb-4
 "
>
 Risk Breakdown
</h3>
<div className="space-y-3">

{
 details.risk_breakdown?.map(
 (factor:any,index:number)=>(

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
    {<div>

 <div
  className="
  font-semibold
  "
 >
  {factor.title}
 </div>

 <div
  className="
  text-sm
  text-gray-500
  "
 >
  {factor.description}
 </div>

</div>}
   </span>

   <span
    className="
    font-bold
    text-red-600
    "
   >
    +{factor.score}
   </span>

  </div>

 ))
}

</div>
<div
 className="
 mt-5

 border-t

 pt-4

 flex

 justify-between

 text-lg

 font-bold
 "
>

<span>
 Final Risk
</span>

<span
 className="
 text-red-600
 "
>

 {details.risk_score}

</span>

</div>
<hr className="my-5" />

<h3
 className="
 text-lg
 font-bold
 mb-4
 "
>
 Recommended Actions
</h3>

<div className="space-y-3">

{
 recommendations.map(
 (item,index)=>(

  <div

   key={index}

   className="
   bg-blue-50

   border

   border-blue-200

   rounded-xl

   p-3
   "
  >

   ✓ {item}

  </div>

 ))
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

export default FraudInvestigation;