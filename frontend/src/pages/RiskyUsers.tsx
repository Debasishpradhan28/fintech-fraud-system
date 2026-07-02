import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import api from "../services/api";

function RiskyUsers() {

 const [users, setUsers] = useState<any[]>([]);
 const [selectedUser, setSelectedUser] = useState<any>(null);
 const [timeline,setTimeline] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 const fetchUsers = async () => {

  try {

   const token =
   localStorage.getItem("token");

   const response =
   await api.get(
    "/fraud/risky-users",
    {
     headers: {
      Authorization:
      `Bearer ${token}`
     }
    }
   );

   setUsers(
    response.data.users
   );

  } catch(error) {

   console.log(error);

  } finally {

   setLoading(false);

  }

 };
 const fetchTimeline =
async(userId:number)=>{

 try{

  const token =
  localStorage.getItem(
   "token"
  );

  const response =
  await api.get(
   `/fraud/timeline/${userId}`,
   {
    headers:{
     Authorization:
     `Bearer ${token}`
    }
   }
  );

  setTimeline(
   response.data.history
  );

 }catch(error){

  console.log(error);

 }

};

 useEffect(() => {

  fetchUsers();

 }, []);

 if(loading){

  return (
   <Layout>
    <div className="p-6">
     Loading Risk Intelligence...
    </div>
   </Layout>
  );

 }

 return (

  <Layout>

   <PageHeader
    title="Risk Intelligence Center"
    subtitle="Monitor and investigate high-risk users"
   />

   <div className="space-y-6">

    {/* Summary Cards */}

    <div className="grid md:grid-cols-3 gap-6">

      <div className="bg-red-50 p-6 rounded-2xl shadow">
        <h3 className="text-red-600 font-semibold">
          Critical Risk
        </h3>

        <p className="text-4xl font-bold mt-2">
          {
            users.filter(
              (u:any)=>
              Number(u.score) < 400
            ).length
          }
        </p>
      </div>

      <div className="bg-yellow-50 p-6 rounded-2xl shadow">
        <h3 className="text-yellow-600 font-semibold">
          Medium Risk
        </h3>

        <p className="text-4xl font-bold mt-2">
          {
            users.filter(
              (u:any)=>
              Number(u.score) >= 400 &&
              Number(u.score) < 500
            ).length
          }
        </p>
      </div>

      <div className="bg-green-50 p-6 rounded-2xl shadow">
        <h3 className="text-green-600 font-semibold">
          Safe Users
        </h3>

        <p className="text-4xl font-bold mt-2">
          {
            users.filter(
              (u:any)=>
              Number(u.score) >= 500
            ).length
          }
        </p>
      </div>

    </div>

    {/* Users List */}

    <div className="bg-white rounded-2xl shadow p-6">

      <h2 className="text-xl font-bold mb-6">
        Risk Assessment
      </h2>

      <div className="space-y-4">

        {
          users.map((user:any)=>{

            const risk =
              Number(user.score) < 400
              ? "HIGH"
              : Number(user.score) < 500
              ? "MEDIUM"
              : "LOW";

            return (

              <div
                key={user.id}

                onClick={()=>{
                setSelectedUser(user);
                fetchTimeline(user.id);
                }}
                 className="
                 flex
                 justify-between
                 items-center
                 p-4
                 border
                 rounded-xl
               hover:bg-slate-50
                 hover:shadow-md
                 transition
                 cursor-pointer
                 "
                >
          
                <div>

                  <h3 className="font-semibold">
                    {user.full_name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>

                </div>

                <div className="text-right">

                  <div className="font-bold">
                    Trust Score:
                    {" "}
                    {user.score}
                  </div>

                  <div>

                    {
                      risk === "HIGH"
                      ? "🔴 HIGH"
                      : risk === "MEDIUM"
                      ? "🟡 MEDIUM"
                      : "🟢 LOW"
                    }

                  </div>

                </div>

              </div>
              

            );

          })
        }
        {
 selectedUser && (

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
    text-2xl
    font-bold
    mb-6
    "
   >
    User Intelligence
   </h2>

   <div className="grid md:grid-cols-2 gap-6">

    <div>

     <h3 className="font-semibold">
      Name
     </h3>

     <p>
      {selectedUser.full_name}
     </p>

    </div>

    <div>

     <h3 className="font-semibold">
      Email
     </h3>

     <p>
      {selectedUser.email}
     </p>

    </div>

    <div>

     <h3 className="font-semibold">
      Trust Score
     </h3>

     <p className="text-2xl font-bold">
      {selectedUser.score}
     </p>

    </div>

    <div>

     <h3 className="font-semibold">
      Risk Category
     </h3>

     <p>

      {
       Number(selectedUser.score) < 400
       ? "🔴 HIGH"
       : Number(selectedUser.score) < 500
       ? "🟡 MEDIUM"
       : "🟢 LOW"
      }

     </p>

    </div>

   </div>
   <div className="mt-8">

 <h3
  className="
  text-xl
  font-bold
  mb-4
  "
 >
  Fraud Heat Score
 </h3>

 <div
  className="
  w-full
  h-6
  bg-slate-200
  rounded-full
  overflow-hidden
  "
 >

  <div

   className="
   h-full
   bg-red-500
   transition-all
   duration-700
   "

   style={{
    width:
    `${Math.max(
      0,
      Math.min(
       100,
       (1000 -
       Number(
        selectedUser.score
       )) / 10
      )
    )}%`
   }}

  />

 </div>

 <div className="mt-3">

  Risk Exposure:

  <span className="font-bold ml-2">

   {
    Math.round(
     (1000 -
     Number(
      selectedUser.score
     )) / 10
    )
   }%

  </span>

 </div>

</div>
<div className="mt-8">

 <h3
  className="
  text-xl
  font-bold
  mb-4
  "
 >
  AI Risk Explanation
 </h3>

 <div
  className="
  bg-slate-50
  rounded-xl
  p-5
  space-y-3
  "
 >

  {
   Number(selectedUser.score) < 400 && (

    <div>
     🚨 Critical trust score detected.
    </div>

   )
  }

  {
   Number(selectedUser.score) >= 400 &&
   Number(selectedUser.score) < 500 && (

    <div>
     ⚠ Elevated fraud probability.
    </div>

   )
  }

  {
   Number(selectedUser.score) < 500 && (

    <div>
     📊 Increased monitoring recommended.
    </div>

   )
  }

  {
   Number(selectedUser.score) < 450 && (

    <div>
     🔍 Manual investigation advised.
    </div>

   )
  }

  {
   Number(selectedUser.score) >= 500 && (

    <div>
     ✅ User behavior currently appears stable.
    </div>

   )
  }
  <div className="mt-8">

 <h3
  className="
  text-xl
  font-bold
  mb-4
  "
 >
  Risk Timeline
 </h3>

 <div className="space-y-4">

  {
   timeline.map(
    (item:any,index:number)=>(

     <div
      key={index}
      className="
      border-l-4
      border-blue-500
      pl-4
      "
     >

      <div className="font-semibold">
       Trust Score:
       {item.score}
      </div>

      <div className="text-gray-500">
       {item.reason}
      </div>

      <div className="text-sm text-gray-400">
       {
        new Date(
         item.created_at
        ).toLocaleString()
       }
      </div>

     </div>

    )
   )
  }

 </div>

</div>

 </div>

</div>

  </div>
  

 )
}

      </div>

    </div>

   </div>

  </Layout>

 );

}

export default RiskyUsers;