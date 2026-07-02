import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSyncAlt, FaDownload } from "react-icons/fa";

function NetworkHeader() {

    const navigate = useNavigate();

    return (

        <div className="bg-white rounded-3xl shadow border p-6 flex justify-between items-center">

            <div>

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-3"
                >
                    <FaArrowLeft />
                    Back to Investigation
                </button>

                <h1 className="text-3xl font-bold">

                    🌐 Network Investigation

                </h1>

                <p className="text-gray-500 mt-1">

                    Visualize relationships between accounts and detect suspicious transaction patterns.

                </p>

            </div>

            <div className="flex gap-3">

                <button className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center gap-2">

                    <FaSyncAlt />

                    Refresh

                </button>

                <button className="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">

                    <FaDownload />

                    Export

                </button>

            </div>

        </div>

    );

}

export default NetworkHeader;