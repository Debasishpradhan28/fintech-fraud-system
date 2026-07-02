import {
    FaCrosshairs,
    FaRedo,
    FaSearchPlus,
    FaSearchMinus,
    FaDownload
} from "react-icons/fa";

interface Props{

    onReset?:()=>void;

    onCenter?:()=>void;

    onZoomIn?:()=>void;

    onZoomOut?:()=>void;

    onExport?:()=>void;

}

function GraphToolbar({

    onReset,

    onCenter,

    onZoomIn,

    onZoomOut,

    onExport

}:Props){

    return(

        <div
        className="
        bg-white
        rounded-3xl
        shadow
        border
        px-6
        py-4
        flex
        justify-between
        items-center
        "
        >

            <div>

                <h2 className="text-xl font-bold">

                    🌐 Transaction Network

                </h2>

                <p className="text-sm text-slate-500">

                    Explore account relationships and suspicious fund flow

                </p>

            </div>

            <div className="flex gap-2">

                <button
                onClick={onCenter}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
                >

                    <FaCrosshairs/>

                </button>

                <button
                onClick={onReset}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
                >

                    <FaRedo/>

                </button>

                <button
                onClick={onZoomIn}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
                >

                    <FaSearchPlus/>

                </button>

                <button
                onClick={onZoomOut}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
                >

                    <FaSearchMinus/>

                </button>

                <button
                onClick={onExport}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >

                    <FaDownload/>

                </button>

            </div>

        </div>

    );

}

export default GraphToolbar;