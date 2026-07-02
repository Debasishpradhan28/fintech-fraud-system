interface Props {

  title:string;

  value:any;

}

function SummaryCard({
  title,
  value
}:Props){

  return (

    <div className="
      bg-white
      p-6
      rounded-2xl
      shadow
    ">

      <h3>
        {title}
      </h3>

      <p className="
        text-3xl
        font-bold
        mt-3
      ">
        {value}
      </p>

    </div>

  );

}

export default SummaryCard;