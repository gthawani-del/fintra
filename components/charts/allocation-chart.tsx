"use client";
import{Cell,Pie,PieChart,ResponsiveContainer,Tooltip}from"recharts";
import{formatINR}from"@/lib/domain/money";

export function AllocationChart({items,activeName,onSelect}:{items:{name:string;value:number}[];activeName?:string|null;onSelect?:(name:string|null)=>void}){
 const data=items.filter(x=>x.value>0);if(!data.length)return null;
 const palette=["var(--green)","var(--green-2)","#78a990","#aac8b7","#ccd8d2","#8d9a94"];
 return <div className="allocationWrap">
  <div className="allocationChart"><ResponsiveContainer width="100%" height={210}><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={84} paddingAngle={1} onClick={(_,i)=>onSelect?.(activeName===data[i]?.name?null:data[i]?.name||null)}>{data.map((x,i)=><Cell key={x.name} fill={palette[i%palette.length]} opacity={activeName&&activeName!==x.name?.toString()?0.28:1}/>)}</Pie><Tooltip formatter={(v)=>formatINR(Number(v))}/></PieChart></ResponsiveContainer></div>
  <div className="allocationLegend">{data.map((x,i)=><button type="button" key={x.name} className={activeName===x.name?"active":""} onClick={()=>onSelect?.(activeName===x.name?null:x.name)}><i style={{background:palette[i%palette.length]}}/><span>{x.name}</span><strong>{formatINR(x.value)}</strong></button>)}</div>
 </div>
}