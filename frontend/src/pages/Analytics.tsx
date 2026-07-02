import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import AnalyticsCharts from "../components/AnalyticsCharts";
import PageHeader from "../components/PageHeader";

function Analytics(){
    const [riskData,setRiskData] =useState([]);
    // const [transactionData,setTransactionData] = useState([]);
    const [ trustData, setTrustData] = useState([]);
    const [fraudTrend, setFraudTrend] = useState([]);
    const [topUsers, setTopUsers] = useState([]);

  const fetchAnalytics =
    async ()=>{

 try{
  const token =
  localStorage.getItem(
  "token"
  );
  const headers = {
  Authorization:
  `Bearer ${token}`
 };

  const risk =
  await api.get(
   "/analytics/risk-distribution"
  );

  // const transactions =
  // await api.get(
  //  "/analytics/transaction-trends"
  // );

  const trust =
  await api.get(
   "/analytics/trust-distribution"
  );
  const trend =
 await api.get(
  "/analytics/fraud-trend",
  { headers }
 );

 const users =
 await api.get(
  "/analytics/top-risk-users",
  { headers }
 );

  setRiskData(
   risk.data
  );

  // setTransactionData(
  //  transactions.data
  // );

  setTrustData(
   trust.data
  );

  setFraudTrend(
   trend.data
  );

  setTopUsers(
   users.data
  );

 }catch(error){

  console.log(error);

 }

};
useEffect(()=>{
      fetchAnalytics();

    },[]);

 return(

  <Layout>
    <PageHeader

 title="Analytics"

 subtitle="
 Real-time fraud analytics
 and trends
 "

/>

   <AnalyticsCharts

 riskData={riskData}

 fraudTrend={fraudTrend}

 trustData={
  trustData
 }
 topUsers={topUsers}

/>

  </Layout>

 );

}

export default Analytics;