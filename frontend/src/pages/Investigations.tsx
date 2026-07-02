import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

import {
 useState,
 useEffect
}
from "react";


function Investigations(){
    const navigate = useNavigate();
    const [search,setSearch] = useState("");
    const [filter,setFilter] = useState("ALL");

 const [
  alerts,
  setAlerts
 ]
 =
 useState([]);
 const [
 selectedCase,
 setSelectedCase
]
=
useState<any>(null);

 const fetchQueue =
 async()=>{

  try{

   const token =
   localStorage.getItem(
    "token"
   );

   const response =
   await api.get(
    "/fraud/investigations",
    {
     headers:{
      Authorization:
      `Bearer ${token}`
     }
    }
   );

   setAlerts(
    response.data.alerts
   );

  }catch(error){

   console.log(error);

  }

 };

 useEffect(()=>{

  fetchQueue();

 },[]);

 return(

  <Layout>

   <PageHeader

    title="Investigations"

    subtitle="
    Manage fraud cases
    "

   />


{/* Summary Cards */}

<div className="
grid
grid-cols-4
gap-4
mb-6
">

<div className="
bg-white
rounded-2xl
shadow
p-5
">
 <p className="text-gray-500">
  Total Cases
 </p>
 <h2 className="text-3xl font-bold">
  {alerts.length}
 </h2>
</div>

<div className="
bg-white
rounded-2xl
shadow
p-5
">
 <p className="text-gray-500">
  Open
 </p>
 <h2 className="text-3xl font-bold text-red-600">
  {
   alerts.filter(
    (a:any)=>
    a.investigation_status==="OPEN"
   ).length
  }
 </h2>
</div>

<div className="
bg-white
rounded-2xl
shadow
p-5
">
 <p className="text-gray-500">
  Under Review
 </p>
 <h2 className="text-3xl font-bold text-yellow-600">
  {
   alerts.filter(
    (a:any)=>
    a.investigation_status==="UNDER REVIEW"
   ).length
  }
 </h2>
</div>

<div className="
bg-white
rounded-2xl
shadow
p-5
">
 <p className="text-gray-500">
  Resolved
 </p>
 <h2 className="text-3xl font-bold text-green-600">
  {
   alerts.filter(
    (a:any)=>
    a.investigation_status==="RESOLVED"
   ).length
  }
 </h2>
 
</div>
</div>
<div className="
bg-white
rounded-2xl
shadow
p-4
mb-6
">

<input

 value={search}

 onChange={(e)=>
  setSearch(
   e.target.value
  )
 }

 placeholder="
 Search alert, severity, status
 "

 className="
 w-full
 border
 rounded-xl
 p-3
 "
/>

</div>
<div className="
grid
grid-cols-3
gap-4
mb-6
">

<div className="
bg-gradient-to-r
from-red-500
to-red-600
text-white
rounded-2xl
p-5
">

<h2 className="text-2xl font-bold">
{
 alerts.filter(
  (a:any)=>
  a.risk_score > 100
 ).length
}
</h2>

<p>
Critical Cases
</p>

</div>

<div className="
bg-gradient-to-r
from-yellow-500
to-orange-500
text-white
rounded-2xl
p-5
">

<h2 className="text-2xl font-bold">
{
 alerts.filter(
  (a:any)=>
  a.investigation_status==="UNDER REVIEW"
 ).length
}
</h2>

<p>
Pending Review
</p>

</div>

<div className="
bg-gradient-to-r
from-green-500
to-green-600
text-white
rounded-2xl
p-5
">

<h2 className="text-2xl font-bold">
{
 alerts.filter(
  (a:any)=>
  a.investigation_status==="RESOLVED"
 ).length
}
</h2>

<p>
Closed Cases
</p>

</div>

</div>
<div className="
flex
gap-3
mt-4
">

{
["ALL","HIGH","MEDIUM"]
.map(level=>(

<button

 key={level}

 onClick={()=>
 setFilter(level)
 }

 className={`
 px-4
 py-2
 rounded-xl

 ${
  filter===level
  ?
  "bg-blue-600 text-white"
  :
  "bg-slate-100"
 }
 `}
>

 {level}

</button>

))
}

</div>
<div
 className="
 lg:col-span-2
 space-y-4
 "
>
{
 alerts
 .filter(
  (alert:any)=>

   alert.alert_type
   .toLowerCase()
   .includes(
    search.toLowerCase()
   )

   ||

   alert.severity
   .toLowerCase()
   .includes(
    search.toLowerCase()
   )

   ||

   alert.investigation_status
   .toLowerCase()
   .includes(
    search.toLowerCase()
   )
 )

 .filter(
  (alert:any)=>

   filter==="ALL"

   ||

   alert.severity===filter
 )

 .sort(
  (a:any,b:any)=>

   b.risk_score -
   a.risk_score
 ).map(
  (alert:any)=>(
   <div

    key={alert.id}

    className="
    bg-white
    rounded-2xl
    shadow
    p-6

    hover:shadow-xl

    transition
    cursor-pointer
    "

    onClick={()=> setSelectedCase(alert)}
   >

    <div className="
    flex
    justify-between
    items-center
    ">

     <div>

      <h2 className="
      font-bold
      text-lg
      ">
       Alert #{alert.id}
      </h2>

      <p className="
      text-gray-500
      ">
       {alert.alert_type}
      </p>

     </div>

     <div>

      <span
       className={`
       px-3
       py-1
       rounded-full
       text-sm

       ${
        alert.severity==="HIGH"
        ?
        "bg-red-100 text-red-700"
        :
        "bg-yellow-100 text-yellow-700"
       }
       `}
      >

       {alert.severity}

      </span>

     </div>

    </div>

    <div className="
    mt-4
    grid
    grid-cols-3
    gap-4
    ">

     <div>

      <div className="text-gray-500 text-sm">
       Risk Score
      </div>

      <div className="font-bold">
       {alert.risk_score}
      </div>

     </div>

     <div>

      <div className="text-gray-500 text-sm">
       Status
      </div>

      <div className="font-bold">
       <span
className={`
px-3
py-1
rounded-full

${
 alert.investigation_status==="OPEN"
 ?
 "bg-red-100 text-red-700"
 :

 alert.investigation_status==="UNDER REVIEW"
 ?
 "bg-yellow-100 text-yellow-700"
 :

 "bg-green-100 text-green-700"
}
`}
>

{alert.investigation_status}

</span>
      </div>

     </div>

     <div>

      <div className="text-gray-500 text-sm">
       Created
      </div>

      <div className="font-bold text-sm">
       {
        new Date(
         alert.created_at
        )
        .toLocaleDateString()
       }
      </div>

     </div>

    </div>

   </div>
  )
 )
}

</div>
<div
 className="
 bg-white
 rounded-2xl
 shadow
 p-6
 sticky
 top-6
 h-fit
 "
>

{
 selectedCase
 ?

 (
  <>

   <h2
    className="
    text-xl
    font-bold
    mb-4
    "
   >
    Case Preview
   </h2>

   <div className="space-y-4">

    <div>

     <div className="text-gray-500">
      Alert ID
     </div>

     <div className="font-bold">
      #{selectedCase.id}
     </div>

    </div>

    <div>

     <div className="text-gray-500">
      Alert Type
     </div>

     <div>
      {selectedCase.alert_type}
     </div>

    </div>

    <div>

     <div className="text-gray-500">
      Risk Score
     </div>

     <div
      className="
      text-red-600
      font-bold
      "
     >
      {selectedCase.risk_score}
     </div>

    </div>

    <div>

     <div className="text-gray-500">
      Severity
     </div>

     <div>
      {selectedCase.severity}
     </div>

    </div>

    <div>

     <div className="text-gray-500">
      Status
     </div>

     <div>
      {selectedCase.investigation_status}
     </div>

    </div>

    <button

     onClick={()=>
      navigate(
       `/fraud-investigation/${selectedCase.id}`
      )
     }

     className="
     w-full

     bg-red-600

     text-white

     py-3

     rounded-xl

     hover:bg-red-700
     "
    >

     Open Investigation

    </button>
    <button

onClick={()=>{
   if (!selectedCase) return;

 navigate(`/network/${selectedCase.id}`)
}}

className="
bg-indigo-600
text-white
px-4
py-2
rounded-xl
"

>

🌐 View Network

</button>

   </div>

  </>
 )

 :

 (
  <div
   className="
   text-center
   text-gray-500
   mt-12
   "
  >

   Select a case to preview

  </div>
 )

}


</div>


  </Layout>

 );

}

export default Investigations;