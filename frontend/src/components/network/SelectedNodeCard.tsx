import {
    FaUserCircle,
    FaShieldAlt,
    FaProjectDiagram,
    FaArrowUp,
    FaArrowDown
} from "react-icons/fa";

interface Props{
    node:any;
    edges?: any[];
}

function SelectedNodeCard({ node, edges }:Props){

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

    // Support both camelCase and snake_case fields and compute
    // connections / totals from edges if they're not present on the node.
    const risk = node.riskScore ?? node.risk_score ?? 0;

    const nodeId = node.id ?? node.label ?? node.account_number;

    const edgeList = Array.isArray(edges) ? edges : [];

    const computedConnections = edgeList.filter(
        (e:any) => e.source === nodeId || e.target === nodeId
    ).length;

    const computedTotalSent = edgeList
        .filter((e:any) => e.source === nodeId)
        .reduce((s:any, e:any) => s + Number(e.amount || 0), 0);

    const computedTotalReceived = edgeList
        .filter((e:any) => e.target === nodeId)
        .reduce((s:any, e:any) => s + Number(e.amount || 0), 0);

    const riskColor =
    risk >= 120
    ? "text-red-600"

    : risk >= 70
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

                               {risk}

                        </h3>

                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">

                        <FaProjectDiagram className="mb-2"/>

                        <p className="text-sm text-slate-500">

                            Connections

                        </p>

                        <h3 className="font-bold">

                            {node.connections ?? node.num_connections ?? computedConnections}

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

                            ₹{Number(node.totalSent ?? node.total_sent ?? computedTotalSent).toLocaleString()}

                        </h3>

                    </div>

                    <div className="bg-green-50 rounded-xl p-4">

                        <FaArrowDown className="mb-2 text-green-500"/>

                        <p className="text-sm text-slate-500">

                            Received

                        </p>

                        <h3 className="font-bold">

                            ₹{Number(node.totalReceived ?? node.total_received ?? computedTotalReceived).toLocaleString()}

                        </h3>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default SelectedNodeCard;