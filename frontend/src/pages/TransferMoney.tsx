import {
    useEffect,
 useState
}
from "react";

import Layout
from "../components/Layout";

import PageHeader
from "../components/PageHeader";
import api from "../services/api";
import {
 useLocation
}
from
"react-router-dom";

function TransferMoney(){
  const [
 transferSuccess,
 setTransferSuccess
]
=
useState(false);
const location = useLocation();
const [
 transactionRef,
 setTransactionRef
]
=
useState("");

 const [
  accountNumber,
  setAccountNumber
 ]
 =
 useState("");
 const [
 banking,
 setBanking
]
=
useState<any>(null);

 const [
  amount,
  setAmount
 ]
 =
 useState("");
 const [
 search,
 setSearch
]
=
useState("");

const [
 users,
 setUsers
]
=
useState([]);

 const [
  remark,
  setRemark
 ]
 =
 useState("");
 const searchUser = async(
 value:string
)=>{

 try{

  const token =
  localStorage.getItem(
   "token"
  );

  const response =
  await api.get(
   `/profile/search?query=${value}`,
   {
    headers:{
     Authorization:
     `Bearer ${token}`
    }
   }
  );

  setUsers(
   response.data.users
  );

 }catch(error){

  console.log(error);

 }

};
 const fetchBanking = async()=>{

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

};
const [
 loading,
 setLoading
]
=
useState(false);

const transferMoney =
async ()=>{

 try{

  setLoading(true);

  const token =
  localStorage.getItem(
   "token"
  );

  const response =
  await api.post(
   "/transactions/transfer",
   {
    receiverAccountNumber:
     accountNumber,

    amount:
     Number(amount),

    remark
   },
   {
    headers:{
     Authorization:
     `Bearer ${token}`
    }
   }
  );
  setTransactionRef(
 response.data.transaction
 .transaction_reference
);

setTransferSuccess(
 true
);

  console.log(
   response.data
  );

 }catch(error:any){

  alert(
   error?.response?.data?.message
   ||
   "Transfer Failed"
  );

 }finally{

  setLoading(false);

 }

};
const [
 showSuccess,
 setShowSuccess
]
=
useState(false);

const [
 transactionData,
 setTransactionData
]
=
useState<any>(null);
useEffect(()=>{
  if(
  location.state
  ?.accountNumber
 ){

  setAccountNumber(
   location.state
   .accountNumber
  );

 }
 fetchBanking();

},[]);

 return(

  <Layout>

   <PageHeader
    title="Transfer Money"
    subtitle="
    Send money securely
    "
   />
   
   <div
 className="
 max-w-xl
 mx-auto
 "
>

 <div
  className="
  bg-white
  rounded-3xl
  shadow
  p-8
  "
 >

  <div
 className="
 bg-slate-50
 border
 rounded-xl
 p-4
 mb-6
 "
>

 <div className="text-sm text-gray-500">
  Sending From
 </div>

 <div className="font-semibold">
  {banking?.account_number}
 </div>

</div>
  <h2
   className="
   text-2xl
   font-bold
   mb-6
   "
  >
   Send Money
  </h2>
  <label>
 Search User
</label>
<div className="relative mb-6">

 <input
  value={search}
  onChange={(e)=>{
   setSearch(e.target.value);
   searchUser(e.target.value);
  }}
  placeholder="Search name, email or account"
  className="
  w-full
  border
  rounded-2xl
  p-4
  bg-white
  shadow-sm
  focus:ring-2
  focus:ring-blue-500
  "
 />

{
 search.trim() !== "" &&
 users.length > 0 && (

  <div
   className="
   absolute
   z-50

   w-full

   bg-white

   rounded-xl

   shadow-xl

   border

   overflow-hidden

   mt-1
   "
  >

   {
    users.map(
     (user:any)=>(
      <div

       key={user.id}

       onClick={()=>{

        setAccountNumber(
         user.account_number
        );

        setSearch(
         user.full_name
        );

        setUsers([]);
       }}

       className="
       p-4

       cursor-pointer

       hover:bg-blue-50

       border-b

       transition
       "
      >

       <div
        className="
        font-semibold
        text-blue-700
        "
       >
        {user.full_name}
       </div>

       <div
        className="
        text-sm
        text-gray-500
        "
       >
        {user.email}
       </div>

      </div>
     )
    )
   }

  </div>

 )
}
</div>

  <label>
   Receiver Account Number
  </label>
  

  <input

   value={accountNumber}

   onChange={(e)=>
    setAccountNumber(
     e.target.value
    )
   }

   placeholder="
   TG0418141016
   "

   className="
   w-full
   border
   p-4
   rounded-xl
   mt-2
   mb-6
   "
  />
  <div
 className="
 bg-slate-50
 rounded-xl
 p-4
 mt-3
 mb-6
 "
>

 <div
 className="
 bg-blue-50

 border
 border-blue-100

 rounded-2xl

 p-4

 mb-6
 "
>

 <div className="font-semibold">
  Recipient
 </div>

 {
  accountNumber
  ? (
   <div className="mt-2">

    <div className="text-blue-700">
     {search}
    </div>

    <div className="text-sm text-gray-500">
     {accountNumber}
    </div>

   </div>
  )
  : (
   <div className="text-gray-500">
    Select a recipient
   </div>
  )
 }

</div>

</div>

  <label>
   Amount
  </label>

  <input

   type="number"

   value={amount}

   onChange={(e)=>
    setAmount(
     e.target.value
    )
   }

   className="
   w-full
   border
   p-4
   rounded-xl
   mt-2
   mb-6
   "
  />

  <label>
   Remark
  </label>

  <input

   value={remark}

   onChange={(e)=>
    setRemark(
     e.target.value
    )
   }

   placeholder="
   Optional
   "

   className="
   w-full
   border
   p-4
   rounded-xl
   mt-2
   mb-6
   "
  />

 </div>

</div>
<div
 className="
 bg-green-50
 rounded-xl
 p-4
 mb-6
 "
>

 Estimated Risk

 🟢 Low

</div>
<button

 onClick={
  transferMoney
 }

 disabled={
  loading
 }

 className="
 w-full

 bg-gradient-to-r
 from-blue-600
 to-indigo-700

 text-white

 py-4

 rounded-2xl

 font-semibold
 "
>

 {
  loading
  ?
  "Processing..."
  :
  "Send Money"
 }

</button>
{
 transferSuccess && (

<div className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
z-50
">

<div className="
bg-white
rounded-3xl
p-8
w-[400px]
text-center
">

<div className="
text-6xl
mb-4
">
✅
</div>

<h2 className="
text-2xl
font-bold
">
Transfer Successful
</h2>

<p className="
mt-4
text-gray-500
">
Reference:
</p>

<p className="
font-mono
">
{transactionRef}
</p>

<button

onClick={()=>
setTransferSuccess(
 false
)
}

className="
mt-6
bg-blue-600
text-white
px-6
py-3
rounded-xl
"
>

Done

</button>

</div>

</div>

)
}

  </Layout>

 );

}

export default TransferMoney;