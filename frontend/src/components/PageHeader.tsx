function PageHeader({
 title,
 subtitle
}: any){

 return(

  <div
   className="
   bg-white
   rounded-3xl
   shadow-sm
   p-8
   mb-8
   bg-linear-to-r
 from-blue-600
 via-blue-700
 to-indigo-800

  bg-clip-text
  text-transparent
  "
  >

   <h1
    className="
    text-4xl
    font-bold
   "
   >
    {title}
   </h1>

   <p
    className="
    text-slate-500
    mt-2
   "
   >
    {subtitle}
   </p>

  </div>

 );

}

export default PageHeader;