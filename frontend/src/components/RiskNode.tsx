function RiskNode({ data }: any){

 const color =
 data.riskScore > 70
 ? "#ef4444"
 :
 data.riskScore > 30
 ? "#f59e0b"
 :
 "#22c55e";

 return(

  <div
   style={{
    border:`3px solid ${color}`
   }}
   className="
   bg-white

   rounded-full

   w-24
   h-24

   flex
   flex-col

   justify-center
   items-center

   shadow-lg
   "
  >

   <div className="font-bold">
    {data.label}
   </div>

   <div className="text-xs">
    {data.riskScore}
   </div>

  </div>

 );

}

export default RiskNode;