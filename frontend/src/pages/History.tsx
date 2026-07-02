import api from "../services/api";
import {useState, useEffect} from "react";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

function History(){
const [
 transactions,
 setTransactions
]
=
useState([]);

const fetchHistory =
async()=>{

 const token =
 localStorage.getItem(
  "token"
 );

 const response =
 await api.get(
  "/transactions/history",
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

};

useEffect(()=>{

 fetchHistory();

},[]);
return(
    <Layout>

 <PageHeader
  title="History"
  subtitle="
  Track all transactions
  "
 />

 <div className="space-y-4">

  {
   transactions.map(
    (tx:any)=>(
     <div

      key={tx.id}

      className="
      bg-white

      rounded-2xl

      shadow

      p-5

      hover:shadow-lg

      transition
      "
     >

      <div
       className="
       flex
       justify-between
       "
      >

       <div>

        <h3 className="font-bold text-lg">

        {
         tx.transaction_type === "SENT"
         ?
         "⬆ Sent"
        :
         "⬇ Received"
        }
        ₹{tx.amount}
       </h3>

        <p
         className="
         text-sm
         text-gray-500
         "
        >
         {
          tx.transaction_type === "SENT"
          ?
          `To: ${tx.receiver_account}`
           :
           `From: ${tx.sender_account}`
          }
        </p>

       </div>

       <div>

        <span
         className="
         bg-green-100

         text-green-700

         px-3

         py-1

         rounded-full

         text-sm
         "
        >
         {tx.status}
        </span>

       </div>

      </div>

      <div
       className="
       mt-4
       text-sm
       text-gray-500
       "
      >

       Ref:
       {tx.transaction_reference}

      </div>

      <div
       className="
       text-sm
       text-gray-500
       "
      >

       {
        new Date(
         tx.created_at
        ).toLocaleString()
       }

      </div>

     </div>
    )
   )
  }

 </div>

</Layout>
);
}
export default History;