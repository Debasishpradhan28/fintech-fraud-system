import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from "react";

import ForceGraph2D from "react-force-graph-2d";



/* ===========================
   TYPES
=========================== */

export interface NetworkNode{

    id:string;

    label:string;

    type?:"MAIN"|"CONNECTED";

    riskScore?:number;

    trustScore?:number;

    connections?:number;

    totalSent?:number;

    totalReceived?:number;

}

export interface NetworkEdge{

    id:string;

    source:string;

    target:string;

    amount:number;

    risk:number;

    created_at?:string;

}



export interface GraphMethods{

    zoomIn:()=>void;

    zoomOut:()=>void;

    center:()=>void;

    reset:()=>void;

}



interface Props{

    nodes:NetworkNode[];

    edges:NetworkEdge[];

    selectedNode:any;

    setSelectedNode:(node:any)=>void;

}



/* ===========================
   COMPONENT
=========================== */

const FraudNetworkGraph = forwardRef<GraphMethods,Props>(({

    nodes,

    edges,

    selectedNode,

    setSelectedNode

},ref)=>{

    const graphRef = useRef<any>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const [graphSize,setGraphSize]=useState({

        width:900,

        height:650

    });




    /* ===========================
       RESPONSIVE
    =========================== */

    useEffect(()=>{

        if(!containerRef.current) return;

        const resize=()=>{

            setGraphSize({

                width:containerRef.current!.clientWidth,

                height:650

            });

        };

        resize();

        window.addEventListener("resize",resize);

        return()=>{

            window.removeEventListener("resize",resize);

        };

    },[]);




    /* ===========================
       GRAPH DATA
    =========================== */

    const graphData=useMemo(()=>({

        nodes,

        links:edges

    }),[nodes,edges]);




    /* ===========================
       INITIAL FIT
    =========================== */

    useEffect(()=>{

        if(

            !graphRef.current ||

            nodes.length===0

        ) return;

        const timer=setTimeout(()=>{

            graphRef.current.zoomToFit(

                1000,

                80

            );

        },700);

        return()=>clearTimeout(timer);

    },[nodes]);




    /* ===========================
       GRAPH CONTROLS
    =========================== */

    useImperativeHandle(ref,()=>({

        zoomIn(){

            if(!graphRef.current) return;

            graphRef.current.zoom(

                graphRef.current.zoom()*1.25,

                500

            );

        },

        zoomOut(){

            if(!graphRef.current) return;

            graphRef.current.zoom(

                graphRef.current.zoom()*0.75,

                500

            );

        },

        center(){

            if(!graphRef.current) return;

            graphRef.current.zoomToFit(

                800,

                80

            );

        },

        reset(){

            if(!graphRef.current) return;

            graphRef.current.zoomToFit(

                800,

                80

            );

        }

    }));



    /* ===========================
       HELPERS
    =========================== */

    const getNodeColor=(node:any)=>{

        if(node.type==="MAIN")
            return "#2563eb";

        if(node.riskScore>=120)
            return "#dc2626";

        if(node.riskScore>=70)
            return "#f59e0b";

        return "#22c55e";

    };



    const getNodeRadius=(node:any)=>{

        if(node.type==="MAIN")
            return 18;

        if(node.connections){

            return Math.min(

                14,

                8+node.connections

            );

        }

        return 10;

    };



    const getLinkWidth=(link:any)=>{

        return Math.min(

            8,

            Math.max(

                2,

                Number(link.amount)/25000

            )

        );

    };



    const getLinkColor=(link:any)=>{

        if(link.risk>=120)
            return "#dc2626";

        if(link.risk>=70)
            return "#f59e0b";

        return "#94a3b8";

    };
        return (

        <div
            ref={containerRef}
            className="relative w-full h-full bg-slate-50 rounded-3xl overflow-hidden"
        >

            {/* Legend */}

            <div
                className="
                absolute
                top-5
                left-5
                z-20

                bg-white/95
                backdrop-blur

                rounded-2xl

                shadow-xl

                border

                p-4

                text-sm

                space-y-2
                "
            >

                <h3 className="font-bold text-slate-700">

                    Graph Legend

                </h3>

                <div className="flex items-center gap-2">

                    <span className="w-3 h-3 rounded-full bg-blue-600"></span>

                    Main Account

                </div>

                <div className="flex items-center gap-2">

                    <span className="w-3 h-3 rounded-full bg-red-500"></span>

                    High Risk

                </div>

                <div className="flex items-center gap-2">

                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>

                    Medium Risk

                </div>

                <div className="flex items-center gap-2">

                    <span className="w-3 h-3 rounded-full bg-green-500"></span>

                    Normal

                </div>

            </div>

            <ForceGraph2D

                ref={graphRef}

                width={graphSize.width}

                height={graphSize.height}

                graphData={graphData}

                backgroundColor="#f8fafc"

                cooldownTicks={80}

                d3AlphaDecay={0.08}

                d3VelocityDecay={0.45}

                nodeRelSize={8}

                enableNodeDrag

                enableZoomInteraction

                enablePanInteraction

                linkDirectionalArrowLength={8}

                linkDirectionalArrowRelPos={1}

                linkCurvature={0.15}

                onNodeClick={(node:any)=>{

                    setSelectedNode({
                       id: node.id,
                       label: node.label,
                       type: node.type,
                       riskScore: node.riskScore,
                       connections: node.connections,
                       totalSent: node.totalSent,
                      totalReceived: node.totalReceived,
                       trustScore: node.trustScore
                    });

                }}

                nodeCanvasObject={(node:any,ctx,scale)=>{

                    const radius=getNodeRadius(node);

                    const color=getNodeColor(node);

                    ctx.beginPath();

                    ctx.arc(

                        node.x,

                        node.y,

                        radius,

                        0,

                        Math.PI*2

                    );

                    ctx.fillStyle=color;

                    ctx.shadowBlur=node===selectedNode ? 25 : 10;

                    ctx.shadowColor=color;

                    ctx.fill();

                    ctx.shadowBlur=0;

                    ctx.lineWidth=node===selectedNode ? 4 : 2;

                    ctx.strokeStyle="#ffffff";

                    ctx.stroke();

                    ctx.fillStyle="#111827";

                    ctx.font=`${12/scale}px Inter`;

                    ctx.fillText(

                        node.label,

                        node.x+radius+5,

                        node.y+4

                    );

                }}

                linkColor={(link:any)=>

                    getLinkColor(link)

                }

                linkWidth={(link:any)=>

                    getLinkWidth(link)

                }

                linkLabel={(link:any)=>

`Transaction

₹${Number(link.amount).toLocaleString()}

Risk Score : ${link.risk}`

                }

                nodeLabel={(node:any)=>

`${node.label}

Risk : ${node.riskScore ?? 0}

Connections : ${node.connections ?? 0}

Trust : ${node.trustScore ?? "--"}`

                }

                onEngineStop={()=>{

                    graphRef.current?.zoomToFit(

                        1000,

                        80

                    );

                }}

            />

        </div>

    );

});

FraudNetworkGraph.displayName="FraudNetworkGraph";

export default FraudNetworkGraph;