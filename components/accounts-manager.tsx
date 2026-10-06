"use client";
import{useEffect,useMemo,useState}from"react";
import{Archive,ArrowRight,ArrowUpRight,Banknote,Building2,CreditCard,Landmark,MoreHorizontal,Plus,RefreshCw,WalletCards}from"lucide-react";
import{Button}from"@/components/ui/button";
import{Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle}from"@/components/ui/dialog";
import{MoneyInput}from"@/components/ui/money-input";
import{EmptyState}from"@/components/ui/empty-state";
import{AccountFlowSparkline,accountRecordedFlow}from"@/components/charts/account-flow-sparkline";
import{loadState,saveState}from"@/lib/storage/store";
import{formatINR}from"@/lib/domain/money";
import{formatShortDate,localMonthKey}from"@/lib/domain/date";
import type{Account,FinanceState,AccountType,Transaction}from"@/types/finance";

const types=[["bank","Bank",Building2,"#2f7d61"],["cash","Cash",Banknote,"#4f9278"],["credit_card","Credit card",CreditCard,"#b86f52"],["investment","Investment",Landmark,"#447fa4"],["loan","Loan",WalletCards,"#8f5d55"]] as const;
function balanceLabel(type:AccountType){return type==="credit_card"?"Amount owed":type==="loan"?"Outstanding balance":type==="investment"?"Current value":"Current balance"}
function typeLabel(type:AccountType){return types.find(x=>x[0]===type)?.[1]||type}
function icon(type:AccountType){return types.find(x=>x[0]===type)?.[2]||WalletCards}
function color(type:AccountType){return types.find(x=>x[0]===type)?.[3]||"#2f7d61"}

function monthActivity(transactions:Transaction[],accountId:string,month:string){
 const rows=transactions.filter(t=>t.date.startsWith(month)&&(t.accountId===accountId||t.transferAccountId===accountId));
 let inflow=0,outflow=0;
 for(const t of rows){
  if(t.type==="income"&&t.accountId===accountId)inflow+=t.amountMinor;
  if(t.type==="expense"&&t.accountId===accountId)outflow+=t.amountMinor;
  if(t.type==="transfer"){
   if(t.accountId===accountId)outflow+=t.amountMinor;
   if(t.transferAccountId===accountId)inflow+=t.amountMinor;
  }
 }
 return{rows:rows.slice().sort((a,b)=>b.date.localeCompare(a.date)),inflow,outflow,net:inflow-outflow};
}

export function AccountsManager(){
 const[s,setS]=useState<FinanceState|null>(null),[addOpen,setAddOpen]=useState(false),[selectedId,setSelectedId]=useState<string|null>(null),[archiveId,setArchiveId]=useState<string|null>(null),[flashId,setFlashId]=useState<string|null>(null);
 useEffect(()=>setS(loadState()),[]);
 if(!s)return <div className="surface" aria-busy="true">Loading accounts…</div>;

 const commit=(n:FinanceState)=>{setS(n);saveState(n)};
 const active=s.accounts.filter(a=>!a.archived),assets=active.filter(a=>!["credit_card","loan"].includes(a.type)),liabilities=active.filter(a=>["credit_card","loan"].includes(a.type));
 const assetTotal=assets.reduce((n,a)=>n+a.balanceMinor,0),liabilityTotal=liabilities.reduce((n,a)=>n+a.balanceMinor,0),net=assetTotal-liabilityTotal;
 const liquid=active.filter(a=>["bank","cash"].includes(a.type)).reduce((n,a)=>n+a.balanceMinor,0),invested=active.filter(a=>a.type==="investment").reduce((n,a)=>n+a.balanceMinor,0),debtRatio=assetTotal?Math.round(liabilityTotal/assetTotal*100):0;
 const selected=selectedId?s.accounts.find(a=>a.id===selectedId)||null:null,archive=archiveId?s.accounts.find(a=>a.id===archiveId)||null:null;

 const groups=[
  {title:"Cash & bank",accounts:assets.filter(a=>["bank","cash"].includes(a.type)),total:assetTotal},
  {title:"Investments",accounts:assets.filter(a=>a.type==="investment"),total:assetTotal},
  {title:"Credit cards",accounts:liabilities.filter(a=>a.type==="credit_card"),total:liabilityTotal},
  {title:"Loans",accounts:liabilities.filter(a=>a.type==="loan"),total:liabilityTotal}
 ].filter(g=>g.accounts.length);

 return <>
  <section className="positionHero">
   <div className="positionPrimary">
    <span className="sectionKicker">NET POSITION</span>
    <strong className="positionValue">{formatINR(net)}</strong>
    <p>{formatINR(assetTotal)} assets less {formatINR(liabilityTotal)} liabilities</p>
    <div className="positionBridge" aria-label="Assets and liabilities">
     <div className="positionBarRow"><span>Assets</span><div><i className="assetBar" style={{width:"100%"}}/></div><b>{formatINR(assetTotal)}</b></div>
     <div className="positionBarRow"><span>Debt</span><div><i className="debtBar" style={{width:Math.min(100,debtRatio)+"%"}}/></div><b>{formatINR(liabilityTotal)}</b></div>
    </div>
   </div>
   <div className="positionStats">
    <div><span>Liquid assets</span><strong>{formatINR(liquid)}</strong><small>Bank + cash</small></div>
    <div><span>Invested assets</span><strong>{formatINR(invested)}</strong><small>Investment accounts</small></div>
    <div><span>Debt / assets</span><strong>{debtRatio}%</strong><small>{liabilities.length} liability account{liabilities.length===1?"":"s"}</small></div>
   </div>
   <Button onClick={()=>setAddOpen(true)}><Plus size={16}/> Add account</Button>
  </section>

  {liabilityTotal>0&&<div className={"positionNote "+(debtRatio>=50?"positionNoteWarn":"")}>
   <span className="positionPulse" aria-hidden="true"/>
   <b>Position snapshot</b>
   <span>Liabilities are {debtRatio}% of recorded assets · {formatINR(liabilityTotal)} outstanding.</span>
  </div>}

  {active.length===0?<div className="surface"><EmptyState title="No accounts yet" body="Add a bank, cash, credit card, investment or loan account." action={<Button onClick={()=>setAddOpen(true)}><Plus size={15}/> Add account</Button>}/></div>:<div className="accountGroups accountGroupsV2">
   {groups.map(g=><AccountSection key={g.title} title={g.title} accounts={g.accounts} groupTotal={g.total} transactions={s.transactions} selectedId={flashId} onOpen={setSelectedId}/>)}
  </div>}

  <AccountDialog open={addOpen} onOpenChange={setAddOpen} onSave={a=>{commit({...s,accounts:[...s.accounts,a]});setFlashId(a.id);window.setTimeout(()=>setFlashId(null),2200);setAddOpen(false)}}/>

  <AccountInspector account={selected} transactions={s.transactions} open={!!selected} onOpenChange={v=>{if(!v)setSelectedId(null)}} onReconcile={amount=>{if(!selected)return;commit({...s,accounts:s.accounts.map(x=>x.id===selected.id?{...x,balanceMinor:amount}:x)});setFlashId(selected.id)}} onArchive={()=>{if(selected){setArchiveId(selected.id);setSelectedId(null)}}}/>

  <Dialog open={!!archive} onOpenChange={v=>{if(!v)setArchiveId(null)}}><DialogContent><DialogHeader><DialogTitle>Archive account?</DialogTitle><DialogDescription>{archive?.name} will leave active views while its record remains in this demo workspace.</DialogDescription></DialogHeader><DialogFooter><Button variant="secondary" onClick={()=>setArchiveId(null)}>Cancel</Button><Button variant="danger" onClick={()=>{if(archive)commit({...s,accounts:s.accounts.map(x=>x.id===archive.id?{...x,archived:true}:x)});setArchiveId(null)}}>Archive account</Button></DialogFooter></DialogContent></Dialog>
 </>;
}

function AccountSection({title,accounts,groupTotal,transactions,selectedId,onOpen}:{title:string;accounts:Account[];groupTotal:number;transactions:Transaction[];selectedId:string|null;onOpen:(id:string)=>void}){
 const month=localMonthKey();
 return <section className="accountGroup accountGroupV2"><div className="groupHeader"><h2>{title}</h2><span>{accounts.length}</span></div><div className="accountGrid accountGridV2">{accounts.map((a,index)=>{
  const Icon=icon(a.type),accent=color(a.type),activity=monthActivity(transactions,a.id,month),share=groupTotal?Math.round(a.balanceMinor/groupTotal*100):0,netFlow=accountRecordedFlow(transactions,a.id);
  return <button type="button" className={"accountCard accountCardV2 "+(selectedId===a.id?"accountCardFlash":"")} style={{animationDelay:(index*45)+"ms"} as React.CSSProperties} key={a.id} onClick={()=>onOpen(a.id)}>
   <div className="accountCardTop"><span className="accountIcon" style={{color:accent,background:accent+"12"}}><Icon size={20}/></span><span className="accountType">{typeLabel(a.type)}</span><ArrowRight size={16}/></div>
   <div className="accountCardBody"><h3>{a.name}</h3><span>{balanceLabel(a.type)}</span><strong>{formatINR(a.balanceMinor)}</strong></div>
   <div className="accountCardMeta"><span className={activity.net>=0?"positiveText":"negativeText"}>{activity.rows.length?(activity.net>=0?"+":"")+formatINR(activity.net)+" recorded this month":"No recorded activity this month"}</span><small>{activity.rows.length} transaction{activity.rows.length===1?"":"s"}</small></div>
   {activity.rows.length>=2?<AccountFlowSparkline transactions={transactions} accountId={a.id} color={accent}/>:<div className="accountShare"><span><i style={{width:share+"%",background:accent}}/></span><small>{share}% of {title.toLowerCase()}</small></div>}
   <div className="accountCardFoot"><span>View details</span><ArrowUpRight size={14}/></div>
  </button>
 })}</div></section>
}

function AccountInspector({account,transactions,open,onOpenChange,onReconcile,onArchive}:{account:Account|null;transactions:Transaction[];open:boolean;onOpenChange:(v:boolean)=>void;onReconcile:(amount:number)=>void;onArchive:()=>void}){
 const[reconciling,setReconciling]=useState(false),[value,setValue]=useState("");
 useEffect(()=>{if(account){setValue(String(account.balanceMinor/100));setReconciling(false)}},[account]);
 if(!account)return <Dialog open={false}><></></Dialog>;
 const Icon=icon(account.type),accent=color(account.type),activity=monthActivity(transactions,account.id,localMonthKey()),recent=transactions.filter(t=>t.accountId===account.id||t.transferAccountId===account.id).slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6);
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="accountInspector">
  <div className="accountInspectorHero">
   <span className="accountInspectorIcon" style={{color:accent,background:accent+"12"}}><Icon size={22}/></span>
   <div><small>{typeLabel(account.type)}</small><h2>{account.name}</h2><span>{balanceLabel(account.type)}</span><strong>{formatINR(account.balanceMinor)}</strong></div>
  </div>

  <div className="accountInspectorStats"><div><span>Recorded inflow</span><b className="positiveText">{formatINR(activity.inflow)}</b></div><div><span>Recorded outflow</span><b className="negativeText">{formatINR(activity.outflow)}</b></div><div><span>Net recorded flow</span><b className={activity.net>=0?"positiveText":"negativeText"}>{activity.net>=0?"+":""}{formatINR(activity.net)}</b></div></div>

  <section className="accountInspectorTrend"><div className="surfaceHead"><div><span className="sectionKicker">RECORDED FLOW</span><h3>Activity trend</h3></div></div>{recent.length>=2?<AccountFlowSparkline transactions={transactions} accountId={account.id} color={accent} height={135}/>:<div className="accountInspectorEmpty">Add more transactions to build a trend.</div>}<small>Based on transactions recorded in Fintra. This is not a reconciled bank balance history.</small></section>

  <section className="accountInspectorRecent"><div className="surfaceHead"><div><span className="sectionKicker">RECENT ACTIVITY</span><h3>Transactions</h3></div></div>{recent.length?<div className="compactList">{recent.map(t=><div key={t.id}><span><b>{t.description}</b><small>{formatShortDate(t.date)} · {t.type}</small></span><strong className={t.type==="income"?"positiveText":t.type==="expense"?"negativeText":""}>{t.type==="expense"?"-":t.type==="income"?"+":""}{formatINR(t.amountMinor)}</strong></div>)}</div>:<div className="accountInspectorEmpty">No transactions recorded for this account.</div>}</section>

  <section className="accountInspectorActions">
   {!reconciling?<><Button variant="secondary" onClick={()=>setReconciling(true)}><RefreshCw size={15}/> Reconcile balance</Button><Button variant="ghost" onClick={onArchive}><MoreHorizontal size={15}/> Archive account</Button></>:<div className="reconcileBox"><div><b>Reconcile balance</b><span>For this demo, reconciliation updates the stored account balance directly. Transactions are unchanged.</span></div><MoneyInput value={value} onChange={e=>setValue(e.target.value)} /><div><Button variant="secondary" size="sm" onClick={()=>setReconciling(false)}>Cancel</Button><Button size="sm" onClick={()=>{const n=Math.round(Math.max(0,Number(value||0))*100);onReconcile(n);setReconciling(false)}}>Update balance</Button></div></div>}
  </section>
 </DialogContent></Dialog>
}

function AccountDialog({open,onOpenChange,onSave}:{open:boolean;onOpenChange:(v:boolean)=>void;onSave:(a:Account)=>void}){
 const[name,setName]=useState(""),[type,setType]=useState<AccountType>("bank"),[bal,setBal]=useState("");
 useEffect(()=>{if(open){setName("");setType("bank");setBal("")}},[open]);
 function submit(e:React.FormEvent){e.preventDefault();if(!name.trim())return;onSave({id:crypto.randomUUID(),name:name.trim(),type,balanceMinor:Math.round(Math.max(0,Number(bal||0))*100),currency:"INR"})}
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><form onSubmit={submit}><DialogHeader><DialogTitle>Add account</DialogTitle><DialogDescription>Use today’s balance. Liability amounts are entered as positive values.</DialogDescription></DialogHeader><div className="accountTypePicker">{types.map(([value,text,Icon,accent])=><button type="button" key={value} className={type===value?"active":""} aria-pressed={type===value} onClick={()=>setType(value)}><Icon size={17} style={{color:accent}}/><span>{text}</span></button>)}</div><div className="dialogFields"><label className="span2"><span>Account name</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. HDFC Salary"/></label><label className="span2"><span>{balanceLabel(type)}</span><MoneyInput value={bal} onChange={e=>setBal(e.target.value)} placeholder="0"/></label></div><DialogFooter><Button type="button" variant="secondary" onClick={()=>onOpenChange(false)}>Cancel</Button><Button type="submit">Add account</Button></DialogFooter></form></DialogContent></Dialog>
}