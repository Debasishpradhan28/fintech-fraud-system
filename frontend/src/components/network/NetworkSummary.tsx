import {
    FaProjectDiagram,
    FaExchangeAlt,
    FaExclamationTriangle,
    FaRupeeSign,
    FaShieldAlt
} from "react-icons/fa";

interface Props{
    metrics:any;
    account:any;
}

function NetworkSummary({
    metrics,
    account
}:Props){

    const cards=[

        {
            title:"Connected Accounts",
            value:metrics?.totalAccounts || 0,
            icon:<FaProjectDiagram size={22}/>,
            color:"from-blue-500 to-cyan-500",
            subtitle:"Network Nodes"
        },

        {
            title:"Transactions",
            value:metrics?.totalTransactions || 0,
            icon:<FaExchangeAlt size={22}/>,
            color:"from-indigo-500 to-violet-500",
            subtitle:"Connected Transfers"
        },

        {
            title:"High Risk",
            value:metrics?.highRiskTransactions || 0,
            icon:<FaExclamationTriangle size={22}/>,
            color:"from-red-500 to-orange-500",
            subtitle:"Suspicious Links"
        },

        {
            title:"Transaction Amount",
            value:`₹${Number(metrics?.totalAmount || 0).toLocaleString()}`,
            icon:<FaRupeeSign size={22}/>,
            color:"from-emerald-500 to-green-600",
            subtitle:"Observed Volume"
        },

        {
            title:"Trust Score",
            value:account?.trust_score || "--",
            icon:<FaShieldAlt size={22}/>,
            color:"from-sky-500 to-blue-600",
            subtitle:"Primary Account"
        }

    ];

    return(

        <div className="grid xl:grid-cols-5 md:grid-cols-2 gap-5 mt-6">

            {cards.map((card,index)=>(

                <div
                    key={index}
                    className="
                    bg-white
                    rounded-3xl
                    shadow-lg
                    border
                    overflow-hidden
                    hover:-translate-y-1
                    hover:shadow-xl
                    transition
                    "
                >

                    <div
                        className={`
                        bg-linear-to-r
                        ${card.color}
                        text-white
                        p-4
                        flex
                        justify-between
                        items-center
                        `}
                    >

                        <div>

                            <p className="text-sm opacity-90">

                                {card.title}

                            </p>

                            <h2 className="text-2xl font-bold mt-1">

                                {card.value}

                            </h2>

                        </div>

                        <div className="bg-white/20 rounded-full p-3">

                            {card.icon}

                        </div>

                    </div>

                    <div className="px-4 py-3 text-sm text-slate-500">

                        {card.subtitle}

                    </div>

                </div>

            ))}

        </div>

    );

}

export default NetworkSummary;