import {
    FaArrowDown
} from "react-icons/fa";

interface Props{

    edges:any[];

}

function TransactionFlowExplorer({

    edges

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
justify-between
items-center
mb-6
">

<h2 className="
text-xl
font-bold
">

🌐 Transaction Flow Explorer

</h2>

<div className="
text-slate-500
">

{edges.length} Transfers

</div>

</div>

{

edges.length===0

?

<div className="
text-slate-500
">

No transaction flow found.

</div>

:

<div className="space-y-5">

{

edges.map((edge:any)=>(

<div

key={edge.id}

className="
border
rounded-2xl
p-5

hover:shadow-lg

transition

cursor-pointer
"

>

<div className="
grid
grid-cols-3
items-center
gap-4
">

<div>

<p className="
text-xs
text-slate-500
">

FROM

</p>

<h3 className="
font-semibold
break-all
">

{edge.source}

</h3>

</div>

<div className="
flex
flex-col
items-center
">

<FaArrowDown
className="
text-blue-600
mb-2
"/>

<div className="
font-bold
text-green-600
">

₹{Number(edge.amount).toLocaleString()}

</div>

</div>

<div>

<p className="
text-xs
text-slate-500
">

TO

</p>

<h3 className="
font-semibold
break-all
">

{edge.target}

</h3>

</div>

</div>

<div className="
flex
justify-between
items-center
mt-5
">

<div
className={`
px-3
py-1
rounded-full
text-sm

${
edge.risk>=100

?

"bg-red-100 text-red-700"

:

edge.risk>=50

?

"bg-orange-100 text-orange-700"

:

"bg-green-100 text-green-700"

}
`}
>

Risk

<strong>

 {edge.risk}

</strong>

</div>

<div className="
text-sm
text-slate-500
">

{

new Date(

edge.created_at

).toLocaleString()

}

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

export default TransactionFlowExplorer;