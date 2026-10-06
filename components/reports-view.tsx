"use client";
import{useEffect,useMemo,useState}from"react";
import{CashFlowChart}from"@/components/charts/cash-flow-chart";
import{EmptyState}from"@/components/ui/empty-state";
import{loadState}from"@/lib/storage/store";
import{formatINR}from"@/lib/domain/money";
import{netWorth}from"@/lib/domain/ledger";
import type{FinanceState,Transaction}from"@/types/finance";

type Period="1M"|"3M"|"6M"|"YTD"|"1Y";
function filtered(transactions:Transaction[],period:Period){const now=new Date(),cut=new Date(now);if(period==="YTD")cut.setMonth(0,1);else{const months=period==="1M"?1:period==="3M"?3:period==="6M"?6:12;cut.setMonth(cut.getMonth()-months+1,1)}const key=cut.getFullYear()+"-"+String(cut.getMonth()+1).padStart(2,"0")+"-01";return transactions.filter(t=>t.date>=key)}
export function ReportsView(){
 const[s,setS]=useState<FinanceState|null>(null),[period,setPeriod]=useState<Period>("6M");
 useEffect(()=>setS(loadState()),[]);
 const data=useMemo(()=>{if(!s)return null;const tx=filtered(s.transactions,period),income=tx.filter(x=>x.type==="income").reduce((n,x)=>n+x.amountMinor,0),expenses=tx.filter(x=>x.type==="expense").reduce((n,x)=>n+x.amountMinor,0),saved=income-expenses,rate=income?Math.round(saved/income*100):0,map=new Map<string,number>();for(const t of tx.filter(x=>x.type==="expense")){const name=s.categories.find(c=>c.id===t.categoryId)?.name||"Uncategorised";map.set(name,(map.get(name)||0)+t.amountMinor)}const cats=[...map].map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value),total=cats.reduce((n,x)=>n+x.value,0);const now=new Date(),cm=now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0"),prev=new Date(now.getFullYear(),now.getMonth()-1,1),pm=prev.getFullYear()+"-"+String(prev.getMonth()+1).padStart(2,"0"),currentExpense=s.transactions.filter(t=>t.type==="expense"&&t.date.startsWith(cm)).reduce((n,t)=>n+t.amountMinor,0),previousExpense=s.transactions.filter(t=>t.type==="expense"&&t.date.startsWith(pm)).reduce((n,t)=>n+t.amountMinor,0),change=previousExpense?Math.round((currentExpense-previousExpense)/previousExpense*100):null;return{tx,income,expenses,saved,rate,cats,total,change}},[s,period]);
 if(!s||!data)return <div className="surface" aria-busy="true">Loading reports…</div>;
 return <>
  <div className="reportControls"><div className="periodTabs" role="group" aria-label="Report period">{(["1M","3M","6M","YTD","1Y"] as Period[]).map(x=><button key={x} className={period===x?"active":""} onClick={()=>setPeriod(x)}>{x}</button>)}</div><span>Current net worth: <b>{formatINR(netWorth(s))}</b></span></div>
  <div className="reportMetrics"><div><span>Income</span><strong className="positiveText">{formatINR(data.income)}</strong></div><div><span>Expenses</span><strong className="negativeText">{formatINR(data.expenses)}</strong></div><div><span>Net savings</span><strong className={data.saved>=0?"positiveText":"negativeText"}>{formatINR(data.saved)}</strong></div><div><span>Savings rate</span><strong>{data.rate}%</strong></div></div>
  {data.change!==null&&<div className="reportInsight"><span>This month’s expenses are</span><strong className={data.change<=0?"positiveText":"negativeText"}>{Math.abs(data.change)}% {data.change<=0?"lower":"higher"}</strong><span>than last month.</span></div>}
  <div className="reportsGrid">
   <div className="surface"><div className="surfaceHead"><div><span className="sectionKicker">CASH FLOW</span><h2>Income vs expenses</h2></div></div>{data.tx.length?<CashFlowChart transactions={data.tx}/>:<EmptyState title="No activity in this period" body="Choose a wider period or add transactions."/>}</div>
   <div className="surface"><div className="surfaceHead"><div><span className="sectionKicker">SPENDING MIX</span><h2>Categories</h2></div></div>{data.cats.length?<div className="reportCategoryList">{data.cats.slice(0,8).map(x=>{const pct=data.total?Math.round(x.value/data.total*100):0;return <div key={x.name}><span><b>{x.name}</b><small>{pct}% of expenses</small></span><div><i style={{width:pct+"%"}}/></div><strong>{formatINR(x.value)}</strong></div>})}</div>:<EmptyState title="No expense categories yet" body="Categorised spending will appear here."/>}</div>
  </div>
 </>}