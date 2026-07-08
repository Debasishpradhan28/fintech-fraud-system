import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaExchangeAlt,
    FaChartLine,
    FaUser,
    FaHistory,
    FaCog,
    FaUniversity,
    FaProjectDiagram
} from "react-icons/fa";
import { MdManageSearch } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
const navItems = [
    {
        name: "Home",
        path: "/dashboard",
        icon: FaHome
    },
    {
        name: "Transactions",
        path: "/transactions",
        icon: FaExchangeAlt
    },
    {
        name: "Investigation",
        path: "/investigations",
        icon: MdManageSearch
    },
    {
        name: "Analytics",
        path: "/analytics",
        icon: FaChartLine
    },
    {
    name: "Network",
    path: "/network/2",
    icon: FaProjectDiagram
    }
];
function BottomNav() {
    const [profileOpen, setProfileOpen] = useState(false);
    return (

        <div
            className="
fixed
bottom-4
left-1/2
-translate-x-1/2

z-50

w-[95%]
max-w-3xl

bg-white/70
backdrop-blur-2xl

border
border-white/40

shadow-[0_8px_40px_rgba(0,0,0,0.12)]
rounded-full
px-3
py-2
transition-all
duration-300
"
        >
            <div className="flex items-center justify-evenly gap-1">

    {navItems.map((item) => {

        const Icon = item.icon;

        return (

            <NavLink
                key={item.name}
                to={item.path}
                className="relative"
            >
                {({ isActive }) => (

                    <motion.div

                        layout

                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30
                        }}

                        className={`
                            relative

                            flex
                            items-center
                            gap-2

                            px-3
                            md:px-5
                            py-3

                            rounded-full

                            overflow-hidden

                            transition-all
                            duration-300

                            ${
                                isActive
                                    ? "text-white"
                                    : "text-slate-500 hover:text-slate-800"
                            }
                        `}
                    >

                        {/* Active Background Pill */}

                        {isActive && (

                            <motion.div

                                layoutId="active-pill"

                                className="
                                    absolute
                                    inset-0

                                    bg-linear-to-r
                                    from-blue-500
                                    to-blue-600
                                    
                                    shadow-lg

                                    rounded-full

                                    -z-10
                                "

                                transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 34
                                }}

                            />

                        )}

                        {/* Icon */}

                        <motion.div

                        whileHover={{scale:1.05}}
                        whileTap={{scale:0.96}}

                            animate={{
                                scale: isActive ? 1.18 : 1,
                                y : isActive ? -2 : 0
                            }}

                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30
                            }}

                        >

                            <Icon className="text-[18px] md:text-[20px]" />

                        </motion.div>

                        {/* Label */}

                        <motion.span

                            initial={false}

                            animate={{
                                opacity: isActive ? 1 : 0,
                                x : isActive ?0.8 : -10,
                                width: isActive ? "auto" : 0,
                            }}

                            transition={{
                                duration: 0.25
                            }}

                            className="
                                hidden md:block
                                text-sm
                                font-semibold
                                whitespace-nowrap
                                overflow-hidden
                            "

                        >

                            {item.name}

                        </motion.span>

                    </motion.div>

                )}

            </NavLink>

        );

    })
    }
<div className="relative">

    <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setProfileOpen(!profileOpen)}
        className="
            flex
            items-center
            justify-center

            h-12
            w-12

            rounded-full

            text-slate-500

            hover:bg-slate-100
            hover:text-blue-600
        "
    >
        <FaUser />
    </motion.button>

    <AnimatePresence>

        {profileOpen && (

            <motion.div

                initial={{
                    opacity: 0,
                    y: 10,
                    scale: 0.95
                }}

                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                }}

                exit={{
                    opacity: 0,
                    y: 10,
                    scale: 0.95
                }}

                transition={{
                    duration: 0.2
                }}

                className="
                    absolute

                    bottom-16
                    right-0

                    w-52

                    bg-white

                    rounded-2xl

                    shadow-2xl

                    border

                    overflow-hidden
                "

            > 
            <NavLink
    to="/profile"
    onClick={() => setProfileOpen(false)}
    className="
        flex
        items-center
        gap-3

        px-4
        py-3

        hover:bg-slate-100
    "
>
    <FaUser />
    Profile
</NavLink>

<div className="border-t border-slate-200" />

                <NavLink
                    to="/my-banking"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100"
                >
                    <FaUniversity />
                    My Banking
                </NavLink>

                <NavLink
                    to="/history"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100"
                >
                    <FaHistory />
                    History
                </NavLink>

                <NavLink
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100"
                >
                    <FaCog />
                    Settings
                </NavLink>

            </motion.div>

        )}

    </AnimatePresence>

</div>
</div>

        </div>

    );

}

export default BottomNav;