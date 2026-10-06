"use client";
import{Area,AreaChart,ResponsiveContainer,Tooltip}from"recharts";
import{formatINR}from"@/lib/domain/money";
import type{Transaction}from"@/types/finance";

function dailyFlow(transactions:Transaction[],accountId:string){
 const map=new Map<string,number>();
 for(const t of transactions){
  let delta=0;
  if(t.type==="income"&&t.accountId===accountId)delta+=t.amountMinor;
  if(t.type==="expense"&&t.accountId===accountId)delta-=t.amountMinor;
  if(t.type==="transfer"){
   if(t.accountId===accountId)delta-=t.amountMinor;
   if(t.transferAccountId===accountId)delta+=t.amountMinor;
  }
  if(delta)map.set(t.date,(map.get(t.date)||0)+delta);
 }
 const rows=[...map.entries()].sort((a,b)=>a[0].localeCompare(b[0]));
 let cumulative=0;
 return rows.map(([date,delta])=>({date,delta,value:(cumulative+=delta)}));
}

export function accountRecordedFlow(transactions:Transaction[],accountId:string){
 return dailyFlow(transactions,accountId).at(-1)?.value||0;
}

export function AccountFlowSparkline({transactions,accountId,color="var(--green)",height=58}:{transactions:Transaction[];accountId:string;color?:string;height?:number}){
 const data=dailyFlow(transactions,accountId);
 if(data.length<2)return null;
 return <div className="accountSparkline" aria-label="Recorded account flow trend">
  <ResponsiveContainer width="100%" height={height}>
   <AreaChart data={data}>
    <defs><linearGradient id={"flow-"+accountId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.22}/><stop offset="100%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
    <Tooltip content={({active,payload,label})=>active&&payload?.[0]?<div className="sparkTooltip"><span>{label}</span><b>{formatINR(Number(payload[0].value))}</b><small>recorded net flow</small></div>:null}/>
    <Area type="monotone" dataKey="value" stroke={color} fill={"url(#flow-"+accountId+")"} strokeWidth={1.7} dot={false} isAnimationActive animationDuration={520}/>
   </AreaChart>
  </ResponsiveContainer>
 </div>
}
