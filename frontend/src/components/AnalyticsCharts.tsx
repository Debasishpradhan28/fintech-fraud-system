import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

function AnalyticsCharts({
  riskData,
  fraudTrend,
  topUsers
}: any) {


  return (

    <div className="grid lg:grid-cols-2 gap-6 mt-8">

      {/* Risk Distribution */}

      <div className="bg-white p-6 rounded-2xl shadow">

        <h2 className="font-bold mb-4">
          Risk Distribution
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <PieChart
 width={350}
 height={300}
>

<Pie

 data={riskData}

 dataKey="count"

 nameKey="risk_level"

 outerRadius={110}

 label
/>

<Tooltip/>

<Legend/>

</PieChart>

        </ResponsiveContainer>

      </div>

      {/* Transactions */}

      <div className="bg-white p-6 rounded-2xl shadow">

        <h2 className="font-bold mb-4">
          Transaction Volume
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <LineChart

 width={500}

 height={300}

 data={fraudTrend}

>

<CartesianGrid
 strokeDasharray="3 3"
/>

<XAxis
 dataKey="day"
/>

<YAxis/>

<Tooltip/>

<Line

 type="monotone"

 dataKey="alerts"

 stroke="#2563eb"

 strokeWidth={4}

/>

</LineChart>

        </ResponsiveContainer>

      </div>
      <div
className="
bg-white
rounded-2xl
shadow
p-6
mt-6
"
>

<h2
className="
text-xl
font-bold
mb-4
"
>

Top Suspicious Accounts

</h2>

<div
className="space-y-4"
>

{
topUsers.map(
(user:any)=>(
<div

key={
 user.account_number
}

className="
border
rounded-xl
p-4

hover:bg-red-50

cursor-pointer

transition
"
>

<div
className="
flex
justify-between
"
>

<div>

<div
className="
font-bold
"
>
{user.full_name}
</div>

<div
className="
text-sm
text-gray-500
"
>
{user.account_number}
</div>

</div>

<div
className="
text-right
"
>

<div
className="
text-red-600
font-bold
"
>

Risk:
{
 user.highest_risk
}

</div>

<div
className="
text-sm
text-gray-500
"
>

Trust:
{
 user.score
}

</div>

</div>

</div>

</div>
))
}

</div>

</div>

    </div>

  );

}

export default AnalyticsCharts;