import {
 useEffect,
 useState
}
from "react";

import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function FraudAlerts(){

 const [alerts,setAlerts] = useState<any[]>([]);
 const navigate = useNavigate();

 const fetchAlerts =
 async ()=>{

  try{

   const token =
   localStorage.getItem(
    "token"
   );

   const response =
   await api.get(
    "/fraud/alerts",
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

  fetchAlerts();

 },[]);

 return(

  <Layout>

   <PageHeader

    title="Fraud Alerts"

    subtitle="
    Monitor suspicious activities
    across the platform
    "

   />

   <div
    className="
    space-y-4
   "
   >

    {
    alerts.map(
    (alert:any)=>(
     <div
      key={alert.id}
      className="
      bg-white
      rounded-2xl
      shadow
      p-6
     "
     >

      <div
       className="
       flex
       justify-between
       items-center
      "
      >

       <div>

        <h3
         className="
         font-bold
         text-lg
        "
        >
         🚨
         {alert.alert_type}
        </h3>

        <p
         className="
         text-slate-500
         mt-1
        "
        >
         Risk Score:
         {alert.risk_score}
        </p>

       </div>

       <span
        className="
        bg-red-100
        text-red-700
        px-3
        py-1
        rounded-full
        text-xs
        font-bold
       "
       >
        {alert.severity}
       </span>

      </div>

      <div
       className="
       mt-4
       flex
       justify-between
       items-center
      "
      >

       <span
        className="
        text-sm
        text-slate-500
       "
       >
        {
         new Date(
          alert.created_at
         )
         .toLocaleString()
        }
       </span>

       <button

   onClick={()=>
    navigate(
    `/fraud-investigation/${alert.id}`)}

 className="
 bg-blue-600
 text-white
 px-4
 py-2
 rounded-xl
 hover:bg-blue-700
 "
>

 Investigate

</button>

      </div>

     </div>
    ))
    }

   </div>

  </Layout>

 );

}

export default FraudAlerts;