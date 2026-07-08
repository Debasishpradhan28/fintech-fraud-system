import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import api from "../services/api";
import RoleManagementCard from "../components/settings/RoleManagementCard";
import { useAuth } from "../context/AuthContext";

function Settings(){
    const [emailAlerts,setEmailAlerts] = useState(true);
    const [deviceAlerts,setDeviceAlerts] = useState(true);
    const [criticalAlerts,setCriticalAlerts] = useState(true);
    const [investigationUpdates,setInvestigationUpdates] = useState(true);
    const [riskThreshold,setRiskThreshold] = useState(70);
    const [showBanner,setShowBanner] = useState(true);
    const [showAnalytics,setShowAnalytics] = useState(true);
    const [aiSummaryEnabled,setAiSummaryEnabled] = useState(true);
    const [patternDetection] = useState(true);
    const [fullName,setFullName] = useState("");
    const [email,setEmail] = useState("");
    const [showPasswordModal, setShowPasswordModal]= useState(false);
    const [currentPassword,setCurrentPassword]= useState("");
    const [newPassword, setNewPassword]= useState("");
    const [confirmPassword, setConfirmPassword]= useState("");
    const { user } = useAuth();

const saveSettings = ()=>{

 const settings = {

  fullName,
  email,

  showBanner,
  showAnalytics,

  aiSummaryEnabled,
  patternDetection,

  riskThreshold,

  criticalAlerts,
  investigationUpdates,

  emailAlerts,
  deviceAlerts

 };

 localStorage.setItem(

  "trustguardSettings",

  JSON.stringify(settings)

 );

 alert(
  "Settings Saved"
 );

};
const updateProfile =
async()=>{

 try{

  const token =
  localStorage.getItem(
   "token"
  );

  await api.put(

   "/profile",

   {
    fullName,
    email
   },

   {
    headers:{
     Authorization:
     `Bearer ${token}`
    }
   }

  );

  alert(
   "Profile Updated"
  );

 }catch(error){

  console.log(error);

 }

};
const handleChangePassword =
async()=>{

 if(
  newPassword !==
  confirmPassword
 ){

  alert(
   "Passwords do not match"
  );

  return;

 }

 try{

  const token =
  localStorage.getItem(
   "token"
  );

  await api.put(

   "/profile/change-password",

   {
    currentPassword,
    newPassword
   },

   {
    headers:{
     Authorization:
     `Bearer ${token}`
    }
   }

  );

  alert(
   "Password Updated"
  );

  setShowPasswordModal(
   false
  );

 }catch(error){

  console.log(error);

 }

};
useEffect(()=>{

 const saved =
 localStorage.getItem(
  "trustguardSettings"
 );

 if(!saved) return;

 const settings = JSON.parse(saved);

 setFullName(
  settings.fullName || ""
 );

 setEmail(
  settings.email || ""
 );

 setShowBanner(
  settings.showBanner ?? true
 );
 setShowAnalytics(
 settings.showAnalytics ?? true
);
setAiSummaryEnabled(
  settings.aiSummary ?? true
 );
 setRiskThreshold(
  settings.riskThreshold ?? 70
 );

},[]);
 return(

  <Layout>

   <PageHeader
    title="Settings"
    subtitle="Manage your account and platform preferences"
   />

   <div className="grid lg:grid-cols-2 gap-6 mt-8">

    {/* Profile */}
    <div className="bg-white rounded-2xl shadow p-6">

     <h2 className="text-xl font-bold mb-4">
      👤 Profile Settings
     </h2>

     <div className="space-y-4">

<input

 value={fullName}

 onChange={(e)=>
 setFullName(
  e.target.value
 )
 }

 placeholder="Full Name"

 className="
 w-full
 border
 rounded-xl
 p-3
 "
/>

<input

 value={email}

 onChange={(e)=>
 setEmail(
  e.target.value
 )
 }

 placeholder="Email"

 className="
 w-full
 border
 rounded-xl
 p-3
 "
/>


<button

 onClick={
  updateProfile
 }

 className="
 bg-blue-600
 text-white
 px-5
 py-3
 rounded-xl
 "
>

Save Changes

</button>

</div>

    </div>

    {/* Security */}
    <div className="bg-white rounded-2xl shadow p-6">

     <h2 className="text-xl font-bold mb-4">
      🔐 Security Settings
     </h2>

     <div className="space-y-4">

<div className="flex justify-between">

<span>Email Login Alerts</span>

<input
 type="checkbox"
 checked={emailAlerts}
 onChange={()=>
 setEmailAlerts(
  !emailAlerts
 )
 }
/>

</div>

<div className="flex justify-between">

<span>Device Login Alerts</span>

<input
 type="checkbox"
 checked={deviceAlerts}
 onChange={()=>
 setDeviceAlerts(
  !deviceAlerts
 )
 }
/>

</div>

<button
 className="
 bg-red-600
 text-white
 px-4
 py-2
 rounded-xl
 "
 onClick={()=>
 setShowPasswordModal(
  true
 )
}
>

Change Password

</button>

</div>

    </div>

    {/* Notifications */}
    <div className="bg-white rounded-2xl shadow p-6">

     <h2 className="text-xl font-bold mb-4">
      🔔 Notification Settings
     </h2>

     <div className="space-y-4">

<div className="flex justify-between">

 <span>Critical Fraud Alerts</span>

 <input
  type="checkbox"
  checked={criticalAlerts}
  onChange={()=>
   setCriticalAlerts(
    !criticalAlerts
   )
  }
 />

</div>

<div className="flex justify-between">

 <span>Investigation Updates</span>

 <input
  type="checkbox"
  checked={investigationUpdates}
  onChange={()=>
   setInvestigationUpdates(
    !investigationUpdates
   )
  }
 />

</div>

</div>

    </div>

    {/* Investigation */}
    <div className="bg-white rounded-2xl shadow p-6">

     <h2 className="text-xl font-bold mb-4">
      🕵 Investigation Preferences
     </h2>

     <div>

<p className="font-semibold mb-3">

Alert Risk Threshold

</p>

<input

 type="range"

 min="50"

 max="100"

 value={riskThreshold}

 onChange={(e)=>
 setRiskThreshold(
  Number(
   e.target.value
  )
 )
 }

 className="w-full"
/>

<div
 className="
 mt-3

 text-xl

 font-bold

 text-red-600
 "
>

{riskThreshold}

</div>

<p className="text-gray-500 mt-2">

Generate alerts only when
risk exceeds this threshold.

</p>

</div>

    </div>


   </div>
<button

 onClick={saveSettings}

 className="
 bg-blue-600

 text-white

 px-8

 py-3

 rounded-xl

 shadow-lg
 "
>

💾 Save Settings

</button>
{user?.role === "ADMIN" && (

    <div className="mt-6">

        <RoleManagementCard />

    </div>

)}
{
 showPasswordModal && (

<div
 className="
 fixed
 inset-0

 bg-black/50

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

 w-125

 max-w-[95%]
 "
>

<h2
 className="
 text-2xl
 font-bold
 mb-6
 "
>

🔐 Change Password

</h2>

<input

 type="password"

 placeholder="Current Password"

 value={currentPassword}

 onChange={(e)=>
 setCurrentPassword(
  e.target.value
 )
 }

 className="
 w-full
 border
 rounded-xl
 p-3
 mb-4
 "
/>

<input

 type="password"

 placeholder="New Password"

 value={newPassword}

 onChange={(e)=>
 setNewPassword(
  e.target.value
 )
 }

 className="
 w-full
 border
 rounded-xl
 p-3
 mb-4
 "
/>

<input

 type="password"

 placeholder="Confirm Password"

 value={confirmPassword}

 onChange={(e)=>
 setConfirmPassword(
  e.target.value
 )
 }

 className="
 w-full
 border
 rounded-xl
 p-3
 mb-6
 "
/>

<div
 className="
 flex
 justify-end
 gap-3
 "
>

<button

 onClick={()=>
 setShowPasswordModal(
  false
 )
 }

 className="
 px-4
 py-2
 border
 rounded-xl
 "
>

Cancel

</button>

<button

 onClick={
  handleChangePassword
 }

 className="
 bg-red-600
 text-white
 px-5
 py-2
 rounded-xl
 "
>

Update Password

</button>

</div>

</div>

</div>


 )
 
}

  </Layout>

 );

}

export default Settings;