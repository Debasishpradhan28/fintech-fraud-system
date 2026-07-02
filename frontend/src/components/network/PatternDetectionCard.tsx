import {
    FaBrain,
    FaCheckCircle,
    FaExclamationTriangle,
    FaTimesCircle
} from "react-icons/fa";

interface Props{

    account:any;
    timeline:any[];

}

function PatternDetectionCard({

    account,
    timeline

}:Props){

    const patterns=[];

    // High Risk

    if(account?.trust_score<500){

        patterns.push({

            title:"Money Mule Activity",

            confidence:96,

            color:"red",

            description:

            "Low trust score with suspicious high value transfers."

        });

    }

    // Velocity

    if(timeline.length>=5){

        patterns.push({

            title:"High Transaction Velocity",

            confidence:84,

            color:"orange",

            description:

            "Large number of transactions detected in short duration."

        });

    }

    // High Value

    const highRisk=

    timeline.some(

        (t:any)=>t.risk>=100

    );

    if(highRisk){

        patterns.push({

            title:"High Risk Transaction",

            confidence:91,

            color:"red",

            description:

            "Critical risk transaction detected."

        });

    }

    // Safe

    if(patterns.length===0){

        patterns.push({

            title:"Normal Behaviour",

            confidence:99,

            color:"green",

            description:

            "No suspicious patterns detected."

        });

    }

    return(

<div className="
bg-white
rounded-3xl
shadow-lg
border
p-6
">

<div className="
flex
items-center
gap-3
mb-6
">

<FaBrain
className="text-blue-600"/>

<h2 className="
text-xl
font-bold
">

Pattern Detection

</h2>

</div>

<div className="space-y-5">

{

patterns.map((item,index)=>{

const icon=

item.color==="red"

?

<FaTimesCircle className="text-red-600"/>

:

item.color==="orange"

?

<FaExclamationTriangle className="text-orange-500"/>

:

<FaCheckCircle className="text-green-600"/>;

const bg=

item.color==="red"

?

"bg-red-50"

:

item.color==="orange"

?

"bg-orange-50"

:

"bg-green-50";

return(

<div

key={index}

className={`
${bg}
rounded-2xl
p-5
border
`}

>

<div className="
flex
justify-between
items-center
">

<div className="
flex
items-center
gap-3
">

{icon}

<h3 className="font-bold">

{item.title}

</h3>

</div>

<div className="
font-semibold
">

{item.confidence}%

</div>

</div>

<p className="
mt-3
text-slate-600
leading-6
">

{item.description}

</p>

</div>

);

})

}

</div>

</div>

);

}

export default PatternDetectionCard;