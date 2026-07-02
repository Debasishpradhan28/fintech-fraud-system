import{
FaLock,
FaFileExport,
FaBell,
FaUserShield,
FaSearch
}
from "react-icons/fa";

interface Props{

selectedNode:any;

}

function QuickActionsCard({

selectedNode

}:Props){

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
mb-5
">

⚡ Quick Actions

</h2>

<div className="grid gap-3">

<button className="
flex
items-center
gap-3
bg-red-600
hover:bg-red-700
text-white
rounded-xl
p-3
transition
">

<FaLock/>

Freeze Account

</button>

<button className="
flex
items-center
gap-3
bg-blue-600
hover:bg-blue-700
text-white
rounded-xl
p-3
transition
">

<FaSearch/>

Open Investigation

</button>

<button className="
flex
items-center
gap-3
bg-green-600
hover:bg-green-700
text-white
rounded-xl
p-3
transition
">

<FaBell/>

Notify Customer

</button>

<button className="
flex
items-center
gap-3
bg-slate-700
hover:bg-slate-800
text-white
rounded-xl
p-3
transition
">

<FaFileExport/>

Export Report

</button>

<button className="
flex
items-center
gap-3
bg-purple-600
hover:bg-purple-700
text-white
rounded-xl
p-3
transition
">

<FaUserShield/>

Assign Investigator

</button>

</div>

</div>

);

}

export default QuickActionsCard;