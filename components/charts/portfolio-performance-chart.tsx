"use client";
import{Area,CartesianGrid,ComposedChart,Line,ResponsiveContainer,Tooltip,XAxis,YAxis}from"recharts";
import{formatINR}from"@/lib/domain/money";
import type{Holding}from"@/types/finance";

function series(holdings:Holding[]){
 const dates=new Set<string>();
 for(const h of holdings){
  const points=h.valuations?.length?h.valuations:[{date:h.valuedAt,valueMinor:h.valueMinor}];
  points.forEach(p=>dates.add(p.date));
 }
 const ordered=[...dates].sort();
 return ordered.map(date=>{
  let value=0,cost=0;
  for(const h of holdings){
   cost+=h.costMinor;
   const points=(h.valuations?.length?h.valuations:[{date:h.valuedAt,valueMinor:h.valueMinor}]).slice().sort((a,b)=>a.date.localeCompare(b.date));
   const latest=points.filter(p=>p.date<=date).at(-1);
   value+=latest?.valueMinor??0;
  }
  return{date,label:new Intl.DateTimeFormat("en-IN",{day:"numeric",month:"short"}).format(new Date(date+"T00:00:00")),value,cost};
 });
}

export function PortfolioPerformanceChart({holdings}:{holdings:Holding[]}){
 const data=series(holdings);
 if(data.length<2)return null;
 return <div className="portfolioPerformanceChart" aria-label="Recorded portfolio value compared with cost basis">
  <ResponsiveContainer width="100%" height={250}>
   <ComposedChart data={data}>
    <CartesianGrid vertical={false} stroke="var(--line)"/>
    <XAxis dataKey="label" axisLine={false} tickLine={false} fontSize={10}/>
    <YAxis axisLine={false} tickLine={false} fontSize={10} width={58} tickFormatter={v=>"₹"+Math.round(Number(v)/10000000)+"L"}/>
    <Tooltip formatter={(v,name)=>[formatINR(Number(v)),name==="value"?"Portfolio value":"Cost basis"]}/>
    <Area type="monotone" dataKey="value" stroke="var(--green)" fill="rgba(47,125,97,.10)" strokeWidth={2} dot={false} isAnimationActive animationDuration={620}/>
    <Line type="monotone" dataKey="cost" stroke="#8e9b95" strokeDasharray="4 4" strokeWidth={1.4} dot={false} isAnimationActive={false}/>
   </ComposedChart>
  </ResponsiveContainer>
 </div>
}