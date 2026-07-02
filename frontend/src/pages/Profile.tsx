import {
 useEffect,
 useState
}
from "react";

import Layout
from "../components/Layout";

import PageHeader
from "../components/PageHeader";

import api
from "../services/api";

function Profile(){

 const [
  profile,
  setProfile
 ]
 =
 useState<any>(null);
 

 const fetchProfile =
 async ()=>{

  try{

   const token =
   localStorage.getItem(
    "token"
   );

   const response =
   await api.get(
    "/profile/me",
    {
      headers:{
       Authorization:
       `Bearer ${token}`
      }
    }
   );

   setProfile(
    response.data
   );
   console.log(response.data);

  }catch(error){

   console.log(error);

  }

 };

 useEffect(()=>{

  fetchProfile();

 },[]);

 if(!profile){

  return(
   <Layout>
    Loading...
   </Layout>
  );

 }

 return(

  <Layout>

   <PageHeader

    title="Profile"

    subtitle="
    Manage account security
    and trust information
    "

   />

   <div
 className="
 bg-gradient-to-r
 from-blue-600
 to-indigo-700
 text-white
 rounded-3xl
 p-8
 mb-6
 shadow-lg
 "
>

 <h1 className="text-3xl font-bold">
  Welcome Back 👋
 </h1>

 <p className="mt-2 text-blue-100">
  {profile?.user?.full_name}
 </p>

 <p className="text-blue-200">
  {profile?.user?.email}
 </p>

 <div className="mt-4">

  <span
   className="
   bg-white/20
   px-4
   py-2
   rounded-full
   "
  >
   Trust Score:
   {profile?.trustScore || 500}
  </span>

 </div>

</div>
<div
 className="
 bg-white
 rounded-2xl
 shadow
 p-6
 mb-6
 "
>

 <h2 className="text-xl font-bold mb-4">
  Search User
 </h2>

 <input

  type="text"

  placeholder="
  Search email or account number
  "

  className="
  w-full
  border
  rounded-xl
  p-4
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500
  "

 />

</div>
<div
 className="
 bg-white
 rounded-2xl
 shadow
 p-6
 mb-6
 "
>

 <h2 className="text-xl font-bold mb-6">
  Quick Actions
 </h2>

 <div
  className="
  grid
  grid-cols-2
  md:grid-cols-4
  gap-6
  "
 >

  {[
   {
    icon:"📱",
    title:"Recharge"
   },
   {
    icon:"🏦",
    title:"Loans"
   },
   {
    icon:"🎁",
    title:"Offers"
   },
   {
    icon:"🤖",
    title:"AI Assistant"
   }
  ].map((item)=>(
   <div
    key={item.title}
    className="
    flex
    flex-col
    items-center
    "
   >

    <div
     className="
     h-24
     w-24
     rounded-full

     bg-slate-100

     flex
     items-center
     justify-center

     text-3xl

     cursor-pointer

     hover:scale-105
     hover:shadow-lg

     transition
     "
    >

     {item.icon}

    </div>

    <p className="mt-3 font-medium">
     {item.title}
    </p>

   </div>
  ))}

 </div>

</div>
<div
 className="
 bg-white
 rounded-2xl
 shadow
 p-6
 mb-6
 "
>

 <h2 className="text-xl font-bold mb-4">
  Security Alerts
 </h2>

 <div className="space-y-3">

  <div
   className="
   bg-yellow-50
   p-4
   rounded-xl
   "
  >
   ⚠ Trust Score Updated
  </div>

  <div
   className="
   bg-blue-50
   p-4
   rounded-xl
   "
  >
   🔐 Device Monitoring Active
  </div>

  <div
   className="
   bg-green-50
   p-4
   rounded-xl
   "
  >
   ✅ Account Protected
  </div>

 </div>

</div>
<div
 className="
 grid
 md:grid-cols-3
 gap-6
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
  🎁 Cashback Offers
 </div>

 <div
  className="
  bg-white
  rounded-2xl
  shadow
  p-6
  "
 >
  📈 Improve Trust Score
 </div>

 <div
  className="
  bg-white
  rounded-2xl
  shadow
  p-6
  "
 >
  💡 Financial Tips
 </div>

</div>
   

   <button

    onClick={()=>{
      localStorage.removeItem(
       "token"
      );

      window.location.href="/";
    }}

    className="
    mt-6
    bg-red-500
    text-white
    px-6
    py-3
    rounded-xl
    hover:bg-red-600
    "
   >

    Logout

   </button>

  </Layout>

 );

}

export default Profile;