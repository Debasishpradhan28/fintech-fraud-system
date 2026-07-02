import {
 useEffect,
 useState
}
from "react";

import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import api from "../services/api";

function Transactions(){

 const [
  transactions,
  setTransactions
 ]
 =
 useState<any[]>([]);

 const fetchTransactions =
async ()=>{

 try{

  const token =
  localStorage.getItem(
   "token"
  );

  const response =
  await api.get(
   "/transactions",
   {
    headers:{
     Authorization:
     `Bearer ${token}`
    }
   }
  );

  setTransactions(
   response.data.transactions
  );

 }catch(error){

  console.log(error);

 }

};

 useEffect(()=>{

  fetchTransactions();

 },[]);

 return(

  <Layout>

   <PageHeader

    title="Transactions"

    subtitle="
    Monitor all financial activity
    "

   />

   <div
    className="
    bg-white
    rounded-2xl
    shadow
    overflow-hidden
   "
   >

    <table
     className="
     w-full
     table-fixed
     "
    >

     <thead>

      <tr
       className="
       bg-slate-100
       "
      >

       <th className="w-[22%] p-4">
        Sender
       </th>
       <th className="w-[22%]">
        Receiver
       </th>

       <th className="w-[15%]">
        Amount
       </th>

       <th className="w-[15%]">
        Risk
       </th>

       <th className="w-[13%]">
        Status
       </th>

       <th className="w-[13%]">
        Date
       </th>

      </tr>

     </thead>

     <tbody>

      {
      transactions.map(
      (tx:any)=>(
      <tr
       key={
        tx.transaction_reference
       }
       className="
       border-t
       "
      >

       <td className="p-4 font-mono">
       {tx.sender_account}
       </td>

       <td className="p-4 font-mono">
        {tx.receiver_account}
       </td>

       <td className="p-4 font-mono">
        ₹{tx.amount}
       </td>

       <td className="p-4 font-mono">
        {tx.risk_score}

 {
  tx.risk_score > 70
  ?
  "🔴 HIGH"

  :

  tx.risk_score > 40
  ?
  "🟡 MEDIUM"

  :

  "🟢 LOW"
 }

</td>

       <td>
        {tx.status}
       </td>

       <td>
        {
         new Date(
          tx.created_at
         )
         .toLocaleDateString()
        }
       </td>

      </tr>
      ))
      }

     </tbody>

    </table>

   </div>

  </Layout>

 );

}

export default Transactions;