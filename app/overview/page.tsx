"use client";
import{useEffect,useMemo,useState}from"react";
import Link from"next/link";
import{ArrowUpRight,CalendarDays,ChevronRight}from"lucide-react";
import{AppShell}from"@/components/app-shell";
import{PageHeader}from"@/components/ui/page-header";
import{EmptyState}from"@/components/ui/empty-state";
import{CashFlowChart}from"@/components/charts/cash-flow-chart";
import{AllocationChart}from"@/components/charts/allocation-chart";
import{formatINR}from"@/lib/domain/money";
import{loadState,profile}from"@/lib/storage/store";
import{netWorth}from"@/lib/domain/ledger";
import{goalProgress,recurringMonthlyTotal}from"@/lib/domain/planning";
import{formatShortDate,localMonthKey,monthLabel}from"@/lib/domain/date";
import type{FinanceState}from"@/types/finance";

export default function Overview(){
 const[s,setS]=useState<FinanceState|null>(null),[name,setName]=useState("");
 useEffect(()=>{setS(loadState());setName(profile()?.name||"")},[]);
 const data=useMemo(()=>{
  if(!s)return null;
  const month=localMonthKey();
  const monthly=s.transactions.filter(t=>t.date.startsWith(month));
  const income=monthly.filter(t=>t.type==="income").reduce((n,t)=>n+t.amountMinor,0);
  const expenses=monthly.filter(t=>t.type==="expense").reduce((n,t)=>n+t.amountMinor,0);
  const saved=income-expenses;
  const rate=income?Math.round(saved/income*100):0;
  const assets=s.accounts.filter(a=>!a.archived&&!["credit_card","loan"].includes(a.type)).reduce((n,a)=>n+a.balanceMinor,0);
  const liabilities=s.accounts.filter(a=>!a.archived&&["credit_card","loan"].includes(a.type)).reduce((n,a)=>n+a.balanceMinor,0);
  const groups=[
   {name:"Bank & cash",value:s.accounts.filter(a=>!a.archived&&["bank","cash"].includes(a.type)).reduce((n,a)=>n+a.balanceMinor,0)},
   {name:"Investment accounts",value:s.accounts.filter(a=>!a.archived&&a.type==="investment").reduce((n,a)=>n+a.balanceMinor,0)},
   {name:"Other assets",value:s.accounts.filter(a=>!a.archived&&!["bank","cash","investment","credit_card","loan"].includes(a.type)).reduce((n,a)=>n+a.balanceMinor,0)}
  ].filter(x=>x.value>0);
  const categoryMap=new Map<string,number>();
  for(const t of monthly.filter(t=>t.type==="expense")){const label=s.categories.find(c=>c.id===t.categoryId)?.name||"Uncategorised";categoryMap.set(label,(categoryMap.get(label)||0)+t.amountMinor)}
  const categories=[...categoryMap.entries()].map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
  const goals=(s.goals||[]).filter(g=>g.status==="active").slice(0,3);
  const recent=s.transactions.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
  const upcoming=(s.recurring||[]).filter(x=>x.active).slice().sort((a,b)=>a.dueDay-b.dueDay).slice(0,4);
  return{month,income,expenses,saved,rate,assets,liabilities,groups,categories,goals,recent,upcoming,nw:netWorth(s)};
 },[s]);
 if(!s||!data)return <AppShell><section className="content" aria-busy="true">Loading overview…</section></AppShell>;
 const totalSpend=Math.max(1,data.categories.reduce((n,x)=>n+x.value,0));
 const dateLabel=new Intl.DateTimeFormat("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date());
 return <AppShell active="Overview"><section className="content appPage">
  <PageHeader eyebrow={dateLabel} title={"Good morning"+(name?", "+name:"")+". "} description={s.transactions.length?"Your financial position and this month’s movement, in one view.":"Your workspace is ready. Add activity when you’re ready."}/>
  <section className="netWorthBand">
   <div className="netWorthMain"><span>Net worth</span><strong>{formatINR(data.nw)}</strong><small>Assets minus liabilities</small></div>
   <div className="netWorthStat"><span>Total assets</span><strong>{formatINR(data.assets)}</strong></div>
   <div className="netWorthStat"><span>Total liabilities</span><strong>{formatINR(data.liabilities)}</strong></div>
   <Link href="/accounts" className="bandLink" aria-label="View accounts"><ChevronRight/></Link>
  </section>

  <section className="overviewGrid">
   <div className="surface moneyMonth">
    <div className="surfaceHead"><div><span className="sectionKicker">MONEY THIS MONTH</span><h2>{monthLabel(data.month)}</h2></div><Link href="/reports">View reports <ArrowUpRight size={15}/></Link></div>
    <div className="monthMetrics"><Metric label="Income" value={formatINR(data.income)} tone="positive"/><Metric label="Expenses" value={formatINR(data.expenses)} tone="negative"/><Metric label="Saved" value={formatINR(data.saved)} tone={data.saved>=0?"positive":"negative"}/><Metric label="Savings rate" value={data.rate+"%"} /></div>
    {s.transactions.length?<CashFlowChart transactions={s.transactions}/>:<EmptyState title="No cash-flow history yet" body="Add transactions to build your monthly trend."/>}
   </div>
   <div className="surface allocationPanel">
    <div className="surfaceHead"><div><span className="sectionKicker">WHERE YOUR MONEY IS</span><h2>Asset mix</h2></div></div>
    {data.groups.length?<AllocationChart items={data.groups}/>:<EmptyState title="No asset accounts yet" body="Add a bank, cash or investment account." action={<Link href="/accounts">Add account</Link>}/>}
   </div>
  </section>

  <section className="overviewLower">
   <div className="surface spendingPanel">
    <div className="surfaceHead"><div><span className="sectionKicker">SPENDING</span><h2>By category</h2></div><span>{monthLabel(data.month)}</span></div>
    {data.categories.length?<div className="categoryList">{data.categories.slice(0,6).map(x=>{const pct=Math.round(x.value/totalSpend*100);return <div key={x.name} className="categoryRow"><span>{x.name}</span><div className="categoryTrack"><i style={{width:pct+"%"}}/></div><b>{pct}%</b><strong>{formatINR(x.value)}</strong></div>})}</div>:<EmptyState title="No spending this month" body="Expense transactions will appear here."/>}
   </div>
   <div className="surface goalsPanel">
    <div className="surfaceHead"><div><span className="sectionKicker">GOALS</span><h2>Progress</h2></div><Link href="/goals">View all</Link></div>
    {data.goals.length?<div className="goalList">{data.goals.map(g=>{const pct=goalProgress(g.savedMinor,g.targetMinor);return <div key={g.id} className="goalItem"><div><b>{g.name}</b><span>{formatINR(g.savedMinor)} of {formatINR(g.targetMinor)}</span></div><strong>{pct}%</strong><div className="goalTrack"><i style={{width:pct+"%"}}/></div></div>})}</div>:<EmptyState title="No active goals" body="Create one when you have something specific to fund." action={<Link href="/goals">Add goal</Link>}/>}
   </div>
   <aside className="overviewSide">
    <div className="surface upcomingPanel"><div className="surfaceHead"><div><span className="sectionKicker">UPCOMING</span><h2>Commitments</h2></div><CalendarDays size={17}/></div>{data.upcoming.length?<div className="compactList">{data.upcoming.map(x=><div key={x.id}><span><b>{x.name}</b><small>Due day {x.dueDay}</small></span><strong>{formatINR(x.amountMinor)}</strong></div>)}</div>:<EmptyState title="Nothing scheduled" body="Add bills or subscriptions from Budget."/>}<div className="panelTotal"><span>Monthly total</span><b>{formatINR(recurringMonthlyTotal(s))}</b></div></div>
    <div className="surface recentPanel"><div className="surfaceHead"><div><span className="sectionKicker">RECENT</span><h2>Transactions</h2></div><Link href="/transactions">View all</Link></div>{data.recent.length?<div className="compactList">{data.recent.map(x=><div key={x.id}><span><b>{x.description}</b><small>{formatShortDate(x.date)} · {s.accounts.find(a=>a.id===x.accountId)?.name||"Account"}</small></span><strong className={x.type==="income"?"positiveText":x.type==="expense"?"negativeText":""}>{x.type==="expense"?"-":x.type==="income"?"+":""}{formatINR(x.amountMinor)}</strong></div>)}</div>:<EmptyState title="No transactions yet" body="Your latest activity will appear here."/>}</div>
   </aside>
  </section>
 </section></AppShell>
}
function Metric({label,value,tone}:{label:string;value:string;tone?:"positive"|"negative"}){return <div className="monthMetric"><span>{label}</span><strong className={tone==="positive"?"positiveText":tone==="negative"?"negativeText":""}>{value}</strong></div>}