import {
    FaHistory,
    FaCircle
} from "react-icons/fa";

interface Props{

    timeline:any[];

}

function InvestigationTimeline({

    timeline

}:Props){

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
justify-between
mb-6
">

<h2 className="
text-xl
font-bold
">

🕒 Investigation Timeline

</h2>

<span className="
text-sm
text-slate-500
">

{timeline.length} Events

</span>

</div>

{

timeline.length===0

?

<div className="text-slate-500">

No timeline found.

</div>

:

<div className="space-y-5">

{

timeline.map((item,index)=>(

<div

key={item.id}

className="
flex
gap-5
"

>

<div className="
flex
flex-col
items-center
">

<div
className={`
w-4
h-4
rounded-full

${
item.risk>=100

?

"bg-red-500"

:

item.risk>=50

?

"bg-orange-500"

:

"bg-green-500"

}
`}
/>

{

index!==timeline.length-1

&&

<div className="
w-[2px]
flex-1
bg-slate-300
mt-2
"/>

}

</div>

<div className="flex-1">

<div className="
flex
justify-between
">

<h3 className="
font-semibold
">

{item.title}

</h3>

<span className="
text-sm
text-slate-500
">

{

new Date(

item.created_at

).toLocaleString()

}

</span>

</div>

<p className="
text-slate-600
mt-1
">

{item.description}

</p>

<div className="
inline-block
mt-3

px-3
py-1

rounded-full

bg-slate-100

text-sm
">

Risk

<strong>

 {item.risk}

</strong>

</div>

</div>

</div>

))

}

</div>

}

</div>

    );

}

export default InvestigationTimeline;