import {
FaRobot,
FaCheckCircle,
FaExclamationTriangle,
FaShieldAlt,
FaLock,
FaEye
}
from "react-icons/fa";

interface Props{

 node:any;

}

function AiInvestigationCard({

 node

}:Props){

 if(!node){

  return(

<div className="
bg-white
rounded-3xl
shadow-lg
border
p-6
">

<h2 className="
font-bold
text-lg
mb-4
">

🧠 AI Investigation

</h2>

<div className="
text-slate-500
text-center
py-8
">

Select a node to start AI analysis.

</div>

</div>

  );

 }

 let verdict="LOW";

 let color="text-green-600";

 let bg="bg-green-100";

 let confidence=58;

 let explanation=

"Normal behaviour detected.";

 let recommendation=[

"Continue Monitoring"

 ];

 if(node.riskScore>=120){

  verdict="CRITICAL";

  color="text-red-600";

  bg="bg-red-100";

  confidence=96;

  explanation=

"Large high-risk transfers with suspicious behaviour indicating possible money mule activity.";

 recommendation=[

"Freeze Account",

"Escalate Investigation",

"Notify Customer",

"Generate SAR"

 ];

 }

 else if(node.riskScore>=70){

 verdict="HIGH";

 color="text-orange-600";

 bg="bg-orange-100";

 confidence=86;

 explanation=

"Multiple risky transfers detected with unusual transaction velocity.";

 recommendation=[

"Increase Monitoring",

"Verify Identity",

"Manual Review"

 ];

 }

 return(

<div className="
bg-white
rounded-3xl
shadow-lg
border
p-6
space-y-5
">

<div className="
flex
justify-between
items-center
">

<h2 className="
font-bold
text-lg
">

🧠 AI Investigation

</h2>

<FaRobot
className="
text-blue-600
"
size={24}
/>

</div>

<div className={`
${bg}
rounded-xl
p-4
`}>

<p className="text-sm">

Verdict

</p>

<h2 className={`
text-2xl
font-bold
${color}
`}>

{verdict}

</h2>

<p className="text-sm mt-2">

Confidence

<strong>

 {confidence}%

</strong>

</p>

</div>

<div>

<h3 className="font-semibold">

Detected Pattern

</h3>

<p className="text-slate-600 mt-1">

{

verdict==="CRITICAL"

?

"Money Mule Activity"

:

verdict==="HIGH"

?

"Rapid Fund Movement"

:

"Normal Activity"

}

</p>

</div>

<div>

<h3 className="font-semibold">

Explanation

</h3>

<p className="
text-slate-600
mt-2
leading-6
">

{explanation}

</p>

</div>

<div>

<h3 className="font-semibold mb-3">

Recommendations

</h3>

<div className="space-y-2">

{

recommendation.map((item,index)=>(

<div

key={index}

className="
flex
items-center
gap-3
"

>

{

item==="Freeze Account"

?

<FaLock className="text-red-600"/>

:

item==="Continue Monitoring"

?

<FaEye className="text-blue-600"/>

:

<FaShieldAlt className="text-orange-600"/>

}

<span>

{item}

</span>

</div>

))

}

</div>

</div>

</div>

 );

}

export default AiInvestigationCard;