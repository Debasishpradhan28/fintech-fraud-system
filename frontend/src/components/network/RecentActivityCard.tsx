import { FaClock } from "react-icons/fa";

function RecentActivityCard({ timeline }: any) {

    return (

        <div className="bg-white rounded-3xl shadow-lg border p-5">

            <div className="flex items-center justify-between mb-4">

                <h2 className="font-bold flex items-center gap-2">

                    <FaClock />

                    Recent Activity

                </h2>

            </div>

            <div className="space-y-3">

                {timeline.slice(0,3).map((item:any)=>{

                    const color =
                        item.risk >= 100
                        ? "bg-red-500"
                        : item.risk >= 50
                        ? "bg-orange-500"
                        : "bg-green-500";

                    return(

                        <div
                            key={item.id}
                            className="flex gap-3 items-start"
                        >

                            <div className={`w-3 h-3 rounded-full mt-2 ${color}`}/>

                            <div className="flex-1">

                                <div className="font-medium text-sm">

                                    {item.description}

                                </div>

                                <div className="text-xs text-slate-500">

                                    {new Date(item.created_at).toLocaleString()}

                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}

export default RecentActivityCard;