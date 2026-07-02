import { useEffect, useState } from "react";

function DashboardBanner(){

 const banners = [

{
 title:"🚨 Critical Fraud Alert",
 description:
 "3 suspicious accounts detected in a high-risk transaction chain worth ₹2.4 Lakhs.",
 action:"Investigate Now",
 image:"/images/fraud-alert.svg",
 bg:"from-red-600 to-red-800"
},

{
 title:"🔐 Security Recommendation",
 description:
 "Enable Device Fingerprinting to reduce account takeover attempts.",
 action:"View Security",
 image:"/images/security.svg",
 bg:"from-blue-600 to-indigo-700"
},

{
 title:"📈 Trust Score Insight",
 description:
 "Average trust score improved by 12% after fraud detection deployment.",
 action:"View Analytics",
 image:"/images/analytics.svg",
 bg:"from-purple-600 to-violet-700"
},

{
 title:"💡 Fraud Prevention Tip",
 description:
 "Repeated small transactions may indicate money structuring activity.",
 action:"Learn More",
 image:"/images/investigation.svg",
 bg:"from-emerald-600 to-green-700"
}

];

 const [current,setCurrent] =
 useState(0);

 useEffect(()=>{

  const interval =
  setInterval(()=>{

   setCurrent(
    (prev)=>
    (prev + 1) %
    banners.length
   );

  },3000);

  return ()=>clearInterval(interval);

 },[]);

 return(
    <div
className={`
relative
overflow-hidden
rounded-3xl
h-60
bg-gradient-to-r
${banners[current].bg}
text-white
shadow-xl
`}
>

<div
className="
absolute
inset-0
bg-black/10
"
/>

<div
className="
relative
z-10
flex
justify-between
items-center
h-full
px-10
"
>

<div className="max-w-xl">

<div
className="
inline-block
bg-white/20
px-3
py-1
rounded-full
text-sm
font-semibold
"
>
Fraud Intelligence Feed
</div>

<h2
className="
text-4xl
font-bold
mt-4
"
>
{banners[current].title}
</h2>

<p
className="
mt-3
text-lg
text-white/90
"
>
{banners[current].description}
</p>

<button
className="
mt-6
bg-white
text-black
font-semibold
px-6
py-3
rounded-xl
hover:scale-105
transition
"
>
{banners[current].action}
</button>

</div>

<img
src={banners[current].image}
alt=""
className="
h-44
hidden
md:block
drop-shadow-xl
"
/>

</div>
<div
className="
flex
justify-center
gap-2
mt-3
"
>

{
banners.map((_,index)=>(

<div
key={index}
onClick={()=>
setCurrent(index)
}
className={`
h-2
rounded-full
cursor-pointer
transition-all

${
current===index
? "w-8 bg-blue-800"
: "w-2 bg-gray-300"
}
`}
/>

))
}

</div>
</div>


 );

}

export default DashboardBanner;