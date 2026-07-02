import {
    FaUserCircle,
    FaShieldAlt,
    FaProjectDiagram,
    FaArrowUp,
    FaArrowDown
} from "react-icons/fa";

interface Props{
    node:any;
}

function SelectedNodeCard({ node }:Props){

    if(!node){

        return(

            <div className="bg-white rounded-3xl shadow-lg border p-6">

                <h2 className="text-lg font-bold mb-4">

                    🎯 Selected Account

                </h2>

                <div className="text-center py-10 text-slate-500">

                    Click any node on the graph to inspect it.

                </div>

            </div>

        );

    }

    const riskColor =
    node.riskScore >= 120
    ? "text-red-600"

    : node.riskScore >= 70
    ? "text-orange-500"

    : "text-green-600";

    return(

        <div className="bg-white rounded-3xl shadow-lg border p-6">

            <div className="flex items-center justify-between">

                <h2 className="text-lg font-bold">

                    🎯 Selected Account

                </h2>

                <FaUserCircle
                    size={28}
                    className="text-blue-600"
                />

            </div>

            <div className="mt-6 space-y-5">

                <div>

                    <p className="text-slate-500 text-sm">

                        Account Number

                    </p>

                    <h3 className="font-bold text-lg">

                        {node.label}

                    </h3>

                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div className="bg-slate-50 rounded-xl p-4">

                        <FaShieldAlt className="mb-2"/>

                        <p className="text-sm text-slate-500">

                            Risk Score

                        </p>

                        <h3 className={`font-bold ${riskColor}`}>

                            {node.riskScore ?? 0}

                        </h3>

                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">

                        <FaProjectDiagram className="mb-2"/>

                        <p className="text-sm text-slate-500">

                            Connections

                        </p>

                        <h3 className="font-bold">

                            {node.connections ?? 0}

                        </h3>

                    </div>

                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div className="bg-red-50 rounded-xl p-4">

                        <FaArrowUp className="mb-2 text-red-500"/>

                        <p className="text-sm text-slate-500">

                            Sent

                        </p>

                        <h3 className="font-bold">

                            ₹{Number(node.totalSent ?? 0).toLocaleString()}

                        </h3>

                    </div>

                    <div className="bg-green-50 rounded-xl p-4">

                        <FaArrowDown className="mb-2 text-green-500"/>

                        <p className="text-sm text-slate-500">

                            Received

                        </p>

                        <h3 className="font-bold">

                            ₹{Number(node.totalReceived ?? 0).toLocaleString()}

                        </h3>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default SelectedNodeCard;