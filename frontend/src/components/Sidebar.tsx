import { useState } from "react";
import {
  FaChartPie,
  FaExchangeAlt,
  FaUsers,
  FaChartLine,
  FaUser,
  FaProjectDiagram
} from "react-icons/fa";
import { Link, NavLink }from "react-router-dom";
import {FaChevronDown, FaChevronRight} from "react-icons/fa";
import { motion, AnimatePresence} from "framer-motion";
import { MdManageSearch } from "react-icons/md";

function Sidebar() {
  const [profileOpen,setProfileOpen] = useState(false);

  const menuItems = [
  {
    name: "Dashboard",
    path: "/Dashboard",
    icon: <FaChartPie />
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: <FaExchangeAlt />
  },
  // {
  //   name: "Fraud Alerts",
  //   path: "/fraud-alerts",
  //   icon: <FaExclamationTriangle />
  // },
  {
   name:"Investigations",
   path:"/investigations",
   icon:<MdManageSearch />
  },
  {
    name: "Risky Users",
    path: "/risky-users",
    icon: <FaUsers />
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: <FaChartLine />
  },
  {
    name:"Network Graph",
    path:"/network/2",
    icon:<FaProjectDiagram />
  },
  
];

  return (

    <div className="
      w-64
      bg-slate-900
      text-white
      min-h-screen
      p-6
      shadow-xl
    ">

      <h1 className="
        text-2xl
        font-bold
        mb-10
      ">
        🛡 TrustGuard
      </h1>

      <div className="space-y-2">

        {menuItems.map((item) => (

          <NavLink
           to={item.path}
           key={item.name}
           className={({ isActive }) =>
    `
    flex
    items-center
    gap-3
    w-full
    px-4
    py-3
    rounded-xl
    transition-all
    duration-200
    cursor-pointer

    ${
      isActive
      ? "bg-blue-600 text-white shadow-lg scale-[1.02]"
      : "hover:bg-slate-800 hover:translate-x-1"
    }
    `
  }
>

            {item.icon}

            <span>
              {item.name}
            </span>

          </NavLink>

        ))}
        <div
 className="
 flex
 items-center
 justify-between
 w-full
 "
>

 <Link
  to="/profile"
  className="
  flex
  items-center
  gap-3
  flex-1
  px-4
  py-3
  rounded-xl
  hover:bg-slate-800
  "
 >
  <FaUser />
  <span>Profile</span>
 </Link>

 <button
  onClick={()=>
   setProfileOpen(
    !profileOpen
   )
  }
  className="
  px-2
  text-xs
  text-slate-400
  hover:text-white
  "
 >
  {
 profileOpen
 ?
 <FaChevronDown size={12}/>
 :
 <FaChevronRight size={12}/>
}
 </button>

</div>
<AnimatePresence>

{
 profileOpen && (

  <motion.div

   initial={{
    height:0,
    opacity:0
   }}

   animate={{
    height:"auto",
    opacity:1
   }}

   exit={{
    height:0,
    opacity:0
   }}

   transition={{
    duration:0.25
   }}

   className="
   overflow-hidden
   ml-8
   mt-2
   space-y-2
   "
  >

   <Link
    to="/my-banking"
    className="
    block
    px-3
    py-2
    rounded-lg
    text-sm
    hover:bg-slate-800
    "
   >
    💳 My Banking
   </Link>

   <Link
    to="/history"
    className="
    block
    px-3
    py-2
    rounded-lg
    text-sm
    hover:bg-slate-800
    "
   >
    📜 History
   </Link>

   <Link
    to="/settings"
    className="
    block
    px-3
    py-2
    rounded-lg
    text-sm
    hover:bg-slate-800
    "
   >
    ⚙️ Settings
   </Link>

  </motion.div>

 )

}

</AnimatePresence>

      </div>

    </div>

  );

}

export default Sidebar;