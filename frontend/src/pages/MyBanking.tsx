import {
 useEffect,
 useState
}
from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

import PageHeader
from "../components/PageHeader";

import api from "../services/api";

function MyBanking(){
    const navigate = useNavigate();
    const [ transferAnimating, setTransferAnimating]= useState(false);

 const [
  banking,
  setBanking
 ]
 =
 useState<any>(null);

 const [
 recentRecipients,
 setRecentRecipients
]
=
useState([]);

 const [
  showBalance,
  setShowBalance
 ]
 =
 useState(true);
 const [
 selectedRecipient,
 setSelectedRecipient
]
=
useState<any>(null);
 const fetchBanking = async()=>{

 try{

  const token =
  localStorage.getItem(
   "token"
  );

  const response =
  await api.get(
   "/profile/banking",
   {
    headers:{
     Authorization:
     `Bearer ${token}`
    }
   }
  );

  setBanking(
   response.data
  );

 }catch(error){

  console.log(error);

 }

};
const fetchRecipients =
async()=>{

 const token =
 localStorage.getItem(
  "token"
 );

 const response =
 await api.get(
  "/transactions/recent-recipients",
  {
   headers:{
    Authorization:
    `Bearer ${token}`
   }
  }
 );

 setRecentRecipients(
  response.data.recipients
 );

};

useEffect(()=>{

 fetchBanking();
 fetchRecipients();

},[]);
if(!banking){

 return(

  <Layout>

   Loading Banking Data...

  </Layout>

 );

}
 

 return(

 <Layout>

  <PageHeader
   title="My Banking"
   subtitle="
   Manage your account
   and transfers
   "
  />

  {/* Banking Card */}

  <div className="
bg-gradient-to-r
from-blue-600
to-indigo-700
text-white
rounded-3xl
p-8
shadow-lg
mb-6
">

<div className="
flex
justify-between
items-center
">

<div>

<p className="
text-blue-100
">
Available Balance
</p>

<h1 className="
text-4xl
font-bold
mt-2
">
{
 showBalance
 ?
 `₹${banking.balance}`
 :
 "••••••"
}
</h1>

</div>

<button

onClick={()=>
setShowBalance(
 !showBalance
)
}

className="
bg-white/20
px-4
py-2
rounded-full
"
>

{
 showBalance
 ?
 "🙈 Hide"
 :
 "👁 Show"
}

</button>

</div>

</div>

   <div className="mt-4">

    Account:

    {
     banking.account_number
    }

   </div>

   <div>

    Trust Score:

    {
     banking.trust_score
    }

   </div>

  {/* Transfer Circle */}

<div className="flex justify-center mb-8">
    <motion.div
      animate={{
        width: transferAnimating ? 320 : 160,
        height: transferAnimating ? 80 : 160,
        borderRadius: transferAnimating ? 24 : 9999,
      }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        setTransferAnimating(true);
        setTimeout(() => {
          navigate("/transfer");
        }, 400);
      }}
      className="h-40 w-40 bg-linear-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-center text-center cursor-pointer shadow-2xl"
    >

 <div>

  <div className="text-4xl">
   ₹
  </div>

  <div>
   Transfer Money
  </div>

 </div>

</motion.div>

  </div>
  <div className="
bg-white
rounded-xl
shadow
p-6
mt-6
">

<h2 className="
font-bold
text-lg
mb-4
">
Recent Recipients
</h2>

<div className="
flex
gap-4
overflow-x-auto
">

{
 recentRecipients.map(
 (user:any)=>(
  <div

 key={user.account_number}

 onClick={()=>
 setSelectedRecipient(user)
 }

 className="
 min-w-[140px]
 bg-slate-50
 rounded-xl
 p-4
 cursor-pointer
 hover:bg-blue-50
 transition
 "
>

   <div className="
   h-10
   w-10
   rounded-full
   bg-blue-600
   text-white
   flex
   items-center
   justify-center
   font-bold
   mb-2
   ">
    {
     user.full_name[0]
    }
   </div>

   <div className="font-medium">
    {user.full_name}
   </div>

   <div className="
   text-xs
   text-gray-500
   ">
    {user.account_number}
   </div>

  </div>
 )
)
}

</div>

</div>
{
 selectedRecipient && (

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

  p-8

  w-[420px]

  shadow-2xl
  "
 >

  <div
   className="
   text-5xl
   text-center
   mb-4
   "
  >
   👤
  </div>

  <h2
   className="
   text-2xl
   font-bold
   text-center
   "
  >
   Recent Recipient
  </h2>

  <div className="mt-6 space-y-3">

   <div>
    <span className="font-medium">
     Name:
    </span>

    {
     selectedRecipient.full_name
    }
   </div>

   <div>
    <span className="font-medium">
     Account:
    </span>

    {
     selectedRecipient.account_number
    }
   </div>

   <div>
    <span className="font-medium">
     Last Amount:
    </span>

    ₹{
      selectedRecipient.last_amount
    }
   </div>

   <div>
    <span className="font-medium">
     Remark:
    </span>

    {
      selectedRecipient.last_remark
      || "-"
    }
   </div>

   <div>
    <span className="font-medium">
     Last Transfer:
    </span>

    {
     new Date(
      selectedRecipient
      .last_transfer_date
     ).toLocaleDateString()
    }
   </div>

  </div>

  <div
   className="
   flex
   gap-3
   mt-8
   "
  >

   <button

    onClick={()=>
     setSelectedRecipient(
      null
     )
    }

    className="
    flex-1

    bg-gray-200

    py-3

    rounded-xl
    "
   >

    Cancel

   </button>

   <button

    onClick={()=>{
     navigate(
      "/transfer-money",
      {
       state:{
        accountNumber:
        selectedRecipient
        .account_number
       }
      }
     );
    }}

    className="
    flex-1

    bg-gradient-to-r
    from-blue-600
    to-indigo-700

    text-white

    py-3

    rounded-xl
    "
   >

    Send Again

   </button>

  </div>

 </div>

</div>

 )
}

  {/* Quick Stats */}

  <div
   className="
   grid
   md:grid-cols-3
   gap-6
   mb-6
   "
  >

   <div
    className="
    bg-white
    rounded-2xl
    shadow
    p-6
    "
   >

    <h3>
     Trust Score
    </h3>

    <div
     className="
     text-3xl
     font-bold
     "
    >
     {banking.trust_score}
    </div>

   </div>

   <div
    className="
    bg-white
    rounded-2xl
    shadow
    p-6
    "
   >

    <h3>
     Security
    </h3>

    <div
     className="
     text-green-600
     font-bold
     "
    >
     Secure
    </div>

   </div>

   <div
    className="
    bg-white
    rounded-2xl
    shadow
    p-6
    "
   >

    <h3>
     Account
    </h3>

    <div
     className="
     text-blue-600
     font-bold
     "
    >
     Active
    </div>

   </div>

  </div>

  {/* Banking Services */}

  <div
   className="
   grid
   grid-cols-2
   md:grid-cols-4
   gap-6
   "
  >

   {
    [
     "📱 Recharge",
     "🏦 Loans",
     "🎁 Offers",
     "🤖 AI Assistant"
    ]
    .map(item=>(

     <div

      key={item}

      className="
      bg-white
      rounded-2xl
      shadow
      p-6

      text-center

      cursor-pointer

      hover:shadow-lg

      transition
      "
     >

      {item}

     </div>

    ))
   }

  </div>

 </Layout>

);

}

export default MyBanking;