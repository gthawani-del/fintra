"use client";
import{useEffect,useMemo,useState}from"react";
import{ArrowRight,Check,ChevronRight,FileSpreadsheet,Landmark,Pencil,Plus,Target,Upload}from"lucide-react";
import{Button}from"@/components/ui/button";
import{Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle}from"@/components/ui/dialog";
import{MoneyInput}from"@/components/ui/money-input";
import{EmptyState}from"@/components/ui/empty-state";
import{AllocationChart}from"@/components/charts/allocation-chart";
import{PortfolioPerformanceChart}from"@/components/charts/portfolio-performance-chart";
import{loadState,saveState}from"@/lib/storage/store";
import{formatINR}from"@/lib/domain/money";
import{portfolioCost,portfolioGain,portfolioValue}from"@/lib/domain/portfolio";
import{formatShortDate,localDateKey}from"@/lib/domain/date";
import{parseCsv}from"@/lib/import/csv";
import type{Account,FinanceState,Holding,InvestmentPlan}from"@/types/finance";

const ASSET_CLASSES=["Mutual fund","Stock","ETF","Deposit","Bond","Gold","PPF / NPS","Other"];
const MILESTONES=[10000000,25000000,50000000,100000000,250000000,500000000,1000000000,2500000000,5000000000];

function parseMoney(value:unknown){
 const cleaned=String(value??"").replace(/[₹,$£€\s]/g,"").replace(/,/g,"");
 const n=Number(cleaned);return Number.isFinite(n)?Math.max(0,Math.round(n*100)):0;
}
function allValuationDates(holdings:Holding[]){return new Set(holdings.flatMap(h=>(h.valuations?.length?h.valuations:[{date:h.valuedAt,valueMinor:h.valueMinor}]).map(p=>p.date))).size}
function nextMilestone(value:number,target?:number){
 const candidates=target&&target>value?[...MILESTONES.filter(x=>x>value&&x<target),target]:MILESTONES.filter(x=>x>value);
 return candidates[0]||target||null;
}
function monthsToTarget(value:number,plan?:InvestmentPlan){
 if(!plan?.targetMinor||!plan.monthlyContributionMinor||plan.targetMinor<=value)return null;
 return Math.ceil((plan.targetMinor-value)/plan.monthlyContributionMinor);
}
function accountValue(accounts:Account[]){return accounts.filter(a=>!a.archived&&a.type==="investment").reduce((n,a)=>n+a.balanceMinor,0)}

export function PortfolioManager(){
 const[s,setS]=useState<FinanceState|null>(null),[addOpen,setAddOpen]=useState(false),[assetPreset,setAssetPreset]=useState("Mutual fund"),[importOpen,setImportOpen]=useState(false),[edit,setEdit]=useState<Holding|null>(null),[allocationFilter,setAllocationFilter]=useState<string|null>(null),[planOpen,setPlanOpen]=useState(false),[milestoneFlash,setMilestoneFlash]=useState(false);
 useEffect(()=>setS(loadState()),[]);
 const allocation=useMemo(()=>{if(!s)return[];const map=new Map<string,number>();for(const h of s.holdings||[])map.set(h.assetClass,(map.get(h.assetClass)||0)+h.valueMinor);return[...map].map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value)},[s]);
 if(!s)return <div className="surface" aria-busy="true">Loading investments…</div>;

 const state=s,h=state.holdings||[],value=portfolioValue(h),cost=portfolioCost(h),gain=portfolioGain(h),gainPct=cost?Math.round(gain/cost*1000)/10:0,commit=(n:FinanceState)=>{setS(n);saveState(n)};
 const investmentAccounts=state.accounts.filter(a=>!a.archived&&a.type==="investment"),recordedAccountValue=accountValue(state.accounts),valuationDates=allValuationDates(h),filtered=allocationFilter?h.filter(x=>x.assetClass===allocationFilter):h;
 const lastUpdated=h.length?h.map(x=>x.valuedAt).sort().at(-1):null,plan=state.investmentPlan,next=nextMilestone(value,plan?.targetMinor),nextGap=next?Math.max(0,next-value):0,planPct=plan?.targetMinor?Math.min(100,Math.round(value/plan.targetMinor*100)):0,months=monthsToTarget(value,plan);
 const mapped=recordedAccountValue>0&&value>=recordedAccountValue*.95,completedTarget=!!plan?.targetMinor&&value>=plan.targetMinor;

 function openAdd(assetClass:string){setAssetPreset(assetClass);setAddOpen(true)}
 function addHoldings(rows:Holding[]){commit({...state,holdings:[...h,...rows]});setImportOpen(false)}
 function savePlan(nextPlan:InvestmentPlan){const crossed=nextPlan.targetMinor>0&&value>=nextPlan.targetMinor&&!completedTarget;commit({...state,investmentPlan:nextPlan});setPlanOpen(false);if(crossed){setMilestoneFlash(true);window.setTimeout(()=>setMilestoneFlash(false),2600)}}
 function updateHolding(holding:Holding,newValue:number){
  const today=localDateKey(),points=[...(holding.valuations||[{date:holding.valuedAt,valueMinor:holding.valueMinor}])];
  const existing=points.findIndex(p=>p.date===today);
  if(existing>=0)points[existing]={date:today,valueMinor:newValue};else points.push({date:today,valueMinor:newValue});
  const nextHolding={...holding,valueMinor:newValue,valuedAt:today,valuations:points.sort((a,b)=>a.date.localeCompare(b.date))};
  const nextState={...state,holdings:h.map(x=>x.id===holding.id?nextHolding:x)};
  commit(nextState);setEdit(null);
  if(plan?.targetMinor&&value<plan.targetMinor&&portfolioValue(nextState.holdings||[])>=plan.targetMinor){setMilestoneFlash(true);window.setTimeout(()=>setMilestoneFlash(false),2600)}
 }

 return <>
  {h.length===0&&recordedAccountValue>0&&<section className="investmentFirstUse">
   <div className="investmentFirstUseIcon"><Landmark size={22}/></div>
   <div><span className="sectionKicker">BUILD YOUR PORTFOLIO VIEW</span><h2>You already have {formatINR(recordedAccountValue)} recorded as investments.</h2><p>Tell Fintra what makes up this amount to unlock allocation, gain/loss, recorded performance and milestones.</p></div>
   <div className="investmentFirstActions"><Button onClick={()=>openAdd("Mutual fund")}><Plus size={16}/> Add first holding</Button><Button variant="secondary" onClick={()=>setImportOpen(true)}><FileSpreadsheet size={16}/> Paste holdings</Button></div>
  </section>}

  <section className="portfolioHero">
   <div className="portfolioHeroValue"><span className="sectionKicker">PORTFOLIO VALUE</span><strong>{formatINR(value)}</strong><p className={gain>=0?"positiveText":"negativeText"}>{h.length?(gain>=0?"+":"")+formatINR(gain)+" · "+(gain>=0?"+":"")+gainPct+"% overall":"Add holdings to start tracking performance"}</p></div>
   <div className="portfolioHeroStats"><div><span>Invested</span><b>{formatINR(cost)}</b><small>Recorded cost basis</small></div><div><span>Holdings</span><b>{h.length}</b><small>{allocation.length} asset class{allocation.length===1?"":"es"}</small></div><div><span>Updated</span><b>{lastUpdated?formatShortDate(lastUpdated):"—"}</b><small>{valuationDates>1?valuationDates+" valuation dates":"Current values only"}</small></div></div>
   <div className="portfolioHeroActions"><Button onClick={()=>openAdd("Mutual fund")}><Plus size={16}/> Add holding</Button><Button variant="secondary" onClick={()=>setImportOpen(true)}><Upload size={15}/> Import</Button></div>
  </section>

  {milestoneFlash&&<div className="portfolioMilestoneReached" role="status"><Check size={18}/><div><b>Portfolio milestone reached</b><span>Your recorded portfolio value has crossed the target you set.</span></div></div>}

  <section className="portfolioWorkspace">
   <div className="portfolioMain">
    <div className="surface portfolioPerformance">
     <div className="surfaceHead"><div><span className="sectionKicker">RECORDED PERFORMANCE</span><h2>Value vs cost basis</h2></div><span>{valuationDates>1?"Based on your valuation updates":"Record another valuation to build history"}</span></div>
     {valuationDates>1?<PortfolioPerformanceChart holdings={h}/>:h.length?<div className="portfolioPerformanceEmpty"><div><span>Current value</span><strong>{formatINR(value)}</strong></div><ArrowRight size={18}/><div><span>Cost basis</span><strong>{formatINR(cost)}</strong></div><p>Fintra will draw a trend after you update a holding on another date.</p></div>:<EmptyState title="No recorded performance yet" body="Add holdings first. Fintra never invents market history."/>}
    </div>

    <div className="surface holdingsSurface holdingsSurfaceV2">
     <div className="surfaceHead"><div><span className="sectionKicker">HOLDINGS</span><h2>{allocationFilter?allocationFilter:"What you own"}</h2></div>{allocationFilter&&<button className="clearFilter" onClick={()=>setAllocationFilter(null)}>Clear filter</button>}</div>
     {filtered.length?<><table className="dataTable desktopOnly"><thead><tr><th>Holding</th><th>Class</th><th>Invested</th><th>Current value</th><th>Gain / loss</th><th>Updated</th><th aria-label="Actions"/></tr></thead><tbody>{filtered.map(x=>{const g=x.valueMinor-x.costMinor,p=x.costMinor?Math.round(g/x.costMinor*1000)/10:0;return <tr key={x.id} onClick={()=>setEdit(x)} className="holdingRow"><td><b>{x.name}</b><small className="cellSub">{investmentAccounts.find(a=>a.id===x.accountId)?.name||"Unlinked account"}</small></td><td>{x.assetClass}</td><td>{formatINR(x.costMinor)}</td><td>{formatINR(x.valueMinor)}</td><td className={g>=0?"positiveText":"negativeText"}>{g>=0?"+":""}{formatINR(g)} <small>{g>=0?"+":""}{p}%</small></td><td>{formatShortDate(x.valuedAt)}</td><td><button className="tableIcon" aria-label={"Update "+x.name} onClick={e=>{e.stopPropagation();setEdit(x)}}><Pencil size={15}/></button></td></tr>})}</tbody></table><div className="holdingCards mobileOnly">{filtered.map(x=>{const g=x.valueMinor-x.costMinor,p=x.costMinor?Math.round(g/x.costMinor*1000)/10:0;return <button key={x.id} onClick={()=>setEdit(x)}><span><b>{x.name}</b><small>{x.assetClass} · {formatShortDate(x.valuedAt)}</small></span><span><strong>{formatINR(x.valueMinor)}</strong><small className={g>=0?"positiveText":"negativeText"}>{g>=0?"+":""}{formatINR(g)} · {g>=0?"+":""}{p}%</small></span></button>})}</div></>:<EmptyState title={allocationFilter?"No matching holdings":"No holdings yet"} body={allocationFilter?"Clear the allocation filter to see the full portfolio.":"Add investments manually or paste a portfolio list."} action={!allocationFilter?<Button onClick={()=>openAdd("Mutual fund")}><Plus size={15}/> Add holding</Button>:undefined}/>}
    </div>
   </div>

   <aside className="portfolioSide">
    <div className="surface allocationSurface allocationSurfaceV2"><div className="surfaceHead"><div><span className="sectionKicker">ALLOCATION</span><h2>By asset class</h2></div></div>{allocation.length?<AllocationChart items={allocation} activeName={allocationFilter} onSelect={setAllocationFilter}/>:<EmptyState title="No allocation yet" body="Asset allocation appears after you add holdings."/>}</div>

    <div className={"surface portfolioMilestone "+(completedTarget?"completed":"")}>
     <div className="surfaceHead"><div><span className="sectionKicker">PORTFOLIO MILESTONE</span><h2>{plan?.targetMinor?"Your target":"Set a target"}</h2></div><Target size={17}/></div>
     {plan?.targetMinor?<><div className="portfolioTargetRing" style={{background:"conic-gradient(var(--green) 0 "+planPct+"%, #e7ece8 "+planPct+"% 100%)"}}><span>{planPct}%</span></div><strong>{formatINR(value)} <small>of {formatINR(plan.targetMinor)}</small></strong><p>{completedTarget?"Target reached. Fintra rewards the milestone, not investment risk.":formatINR(Math.max(0,plan.targetMinor-value))+" remaining"}</p>{months&&<div className="portfolioProjection"><span>At {formatINR(plan.monthlyContributionMinor||0)}/month</span><b>~{months} months</b><small>Contribution-only projection; excludes market movement.</small></div>}<Button variant="secondary" size="sm" onClick={()=>setPlanOpen(true)}>Edit target</Button></>:<><p>Set a portfolio-value target and an optional monthly contribution. Fintra will show contribution-only progress without assuming returns.</p><Button variant="secondary" size="sm" onClick={()=>setPlanOpen(true)}>Set portfolio target</Button></>}
    </div>

    <div className="surface portfolioHabits"><div className="surfaceHead"><div><span className="sectionKicker">DISCIPLINE MILESTONES</span><h2>Progress worth noticing</h2></div></div><div className="portfolioHabitList"><div className={mapped?"done":""}><span>{mapped?<Check size={14}/>:<ChevronRight size={14}/>}</span><p><b>Portfolio mapped</b><small>{mapped?"Holdings broadly reconcile to your investment accounts.":"Map holdings to the investment value already recorded in Accounts."}</small></p></div><div className={h.length>=5?"done":""}><span>{h.length>=5?<Check size={14}/>:<ChevronRight size={14}/>}</span><p><b>5 holdings tracked</b><small>{h.length>=5?"Milestone reached.":Math.max(0,5-h.length)+" more to this tracking milestone."}</small></p></div><div className={valuationDates>=2?"done":""}><span>{valuationDates>=2?<Check size={14}/>:<ChevronRight size={14}/>}</span><p><b>Performance history started</b><small>{valuationDates>=2?"You have values recorded on multiple dates.":"Update a holding on another date to begin a real history."}</small></p></div></div></div>
   </aside>
  </section>

  {h.length===0&&<section className="investmentQuickStart"><div><span className="sectionKicker">QUICK ADD</span><h2>What do you own?</h2><p>Choose a type and Fintra will prefill the rest of the form where it can.</p></div><div>{ASSET_CLASSES.map(a=><button key={a} onClick={()=>openAdd(a)}>{a}</button>)}</div></section>}

  <HoldingDialog open={addOpen} onOpenChange={setAddOpen} assetPreset={assetPreset} investmentAccounts={investmentAccounts} onSave={holding=>{commit({...state,holdings:[...h,holding]});setAddOpen(false)}}/>
  <HoldingsImportDialog open={importOpen} onOpenChange={setImportOpen} accounts={investmentAccounts} existing={h} onImport={addHoldings}/>
  <ValuationDialog holding={edit} open={!!edit} onOpenChange={v=>{if(!v)setEdit(null)}} onSave={v=>{if(edit)updateHolding(edit,v)}}/>
  <PortfolioPlanDialog open={planOpen} onOpenChange={setPlanOpen} current={plan} onSave={savePlan}/>
 </>;
}

function HoldingDialog({open,onOpenChange,assetPreset,investmentAccounts,onSave}:{open:boolean;onOpenChange:(v:boolean)=>void;assetPreset:string;investmentAccounts:Account[];onSave:(h:Holding)=>void}){
 const[name,setName]=useState(""),[assetClass,setAssetClass]=useState(assetPreset),[cost,setCost]=useState(""),[value,setValue]=useState(""),[accountId,setAccountId]=useState("");
 useEffect(()=>{if(open){setName("");setAssetClass(assetPreset);setCost("");setValue("");setAccountId(investmentAccounts[0]?.id||"")}},[open,assetPreset,investmentAccounts]);
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><form onSubmit={e=>{e.preventDefault();const costMinor=parseMoney(cost),valueMinor=parseMoney(value||cost);if(!name.trim()||costMinor<=0||valueMinor<=0)return;const date=localDateKey();onSave({id:crypto.randomUUID(),name:name.trim(),assetClass,quantity:1,costMinor,valueMinor,valuedAt:date,accountId:accountId||undefined,valuations:[{date,valueMinor}]})}}><DialogHeader><DialogTitle>Add investment</DialogTitle><DialogDescription>Fintra tracks what you record. It does not connect to a broker or place trades.</DialogDescription></DialogHeader><div className="investmentAssetChips">{ASSET_CLASSES.map(a=><button type="button" key={a} className={assetClass===a?"active":""} onClick={()=>setAssetClass(a)}>{a}</button>)}</div><div className="dialogFields"><label className="span2"><span>Holding name</span><input value={name} onChange={e=>setName(e.target.value)} placeholder={assetClass==="Mutual fund"?"e.g. Nifty 50 Index Fund":"Investment name"}/></label>{investmentAccounts.length>0&&<label className="span2"><span>Investment account</span><select value={accountId} onChange={e=>setAccountId(e.target.value)}>{investmentAccounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></label>}<label><span>Amount invested</span><MoneyInput value={cost} onChange={e=>setCost(e.target.value)} placeholder="0"/></label><label><span>Current value</span><MoneyInput value={value} onChange={e=>setValue(e.target.value)} placeholder="Defaults to invested"/></label></div><DialogFooter><Button type="button" variant="secondary" onClick={()=>onOpenChange(false)}>Cancel</Button><Button type="submit">Add holding</Button></DialogFooter></form></DialogContent></Dialog>
}

function HoldingsImportDialog({open,onOpenChange,accounts,existing,onImport}:{open:boolean;onOpenChange:(v:boolean)=>void;accounts:Account[];existing:Holding[];onImport:(h:Holding[])=>void}){
 const[text,setText]=useState(""),[preview,setPreview]=useState<Holding[]>([]),[errors,setErrors]=useState(0);
 useEffect(()=>{if(open){setText("");setPreview([]);setErrors(0)}},[open]);
 function read(value:string){
  setText(value);if(!value.trim()){setPreview([]);setErrors(0);return}
  const rows=parseCsv(value),items:Holding[]=[];let bad=0;
  for(const row of rows){
   const name=String(row.name||row.holding||"").trim(),assetClass=String(row["asset class"]||row.assetclass||row.class||"Other").trim()||"Other",costMinor=parseMoney(row.invested??row.cost??row["cost basis"]),valueMinor=parseMoney(row["current value"]??row.value??row.current),accountName=String(row.account||"").trim();
   if(!name||costMinor<=0){bad++;continue}
   const account=accounts.find(a=>a.name.toLowerCase()===accountName.toLowerCase())||accounts[0],current=valueMinor||costMinor,key=name.toLowerCase()+"|"+assetClass.toLowerCase();
   if(existing.some(h=>(h.name.toLowerCase()+"|"+h.assetClass.toLowerCase())===key)||items.some(h=>(h.name.toLowerCase()+"|"+h.assetClass.toLowerCase())===key)){bad++;continue}
   const date=localDateKey();items.push({id:crypto.randomUUID(),name,assetClass,quantity:1,costMinor,valueMinor:current,valuedAt:date,accountId:account?.id,valuations:[{date,valueMinor:current}]});
  }
  setPreview(items);setErrors(bad);
 }
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="investmentImportDialog"><DialogHeader><DialogTitle>Paste portfolio holdings</DialogTitle><DialogDescription>Paste from Excel, Sheets or CSV. Preview everything before it is added.</DialogDescription></DialogHeader><div className="investmentImportFormat"><b>Accepted columns</b><code>name, asset class, invested, current value, account</code><small>Nifty 50 Index Fund, Mutual fund, 300000, 342500, Investment Account</small></div><textarea value={text} onChange={e=>read(e.target.value)} placeholder={"name,asset class,invested,current value,account\nNifty 50 Index Fund,Mutual fund,300000,342500,Investment Account"}/><div className="investmentImportStatus"><span>{preview.length} ready</span><span>{errors} skipped / invalid</span></div>{preview.length>0&&<div className="investmentImportPreview">{preview.slice(0,6).map(x=><div key={x.id}><span><b>{x.name}</b><small>{x.assetClass}</small></span><strong>{formatINR(x.valueMinor)}</strong></div>)}</div>}<DialogFooter><Button variant="secondary" onClick={()=>onOpenChange(false)}>Cancel</Button><Button onClick={()=>preview.length&&onImport(preview)}>Import {preview.length||""} holdings</Button></DialogFooter></DialogContent></Dialog>
}

function ValuationDialog({holding,open,onOpenChange,onSave}:{holding:Holding|null;open:boolean;onOpenChange:(v:boolean)=>void;onSave:(v:number)=>void}){
 const[value,setValue]=useState("");useEffect(()=>{if(open&&holding)setValue(String(holding.valueMinor/100))},[open,holding]);
 if(!holding)return null;
 const gain=holding.valueMinor-holding.costMinor,pct=holding.costMinor?Math.round(gain/holding.costMinor*1000)/10:0,history=holding.valuations||[{date:holding.valuedAt,valueMinor:holding.valueMinor}];
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="investmentInspector"><DialogHeader><DialogTitle>{holding.name}</DialogTitle><DialogDescription>{holding.assetClass} · Updated {formatShortDate(holding.valuedAt)}</DialogDescription></DialogHeader><div className="investmentInspectorStats"><span><small>Invested</small><b>{formatINR(holding.costMinor)}</b></span><span><small>Current value</small><b>{formatINR(holding.valueMinor)}</b></span><span><small>Gain / loss</small><b className={gain>=0?"positiveText":"negativeText"}>{gain>=0?"+":""}{formatINR(gain)} · {gain>=0?"+":""}{pct}%</b></span></div>{history.length>1&&<div className="investmentHistoryList">{history.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5).map(p=><div key={p.date}><span>{formatShortDate(p.date)}</span><b>{formatINR(p.valueMinor)}</b></div>)}</div>}<label className="dialogLabel"><span>Update current value</span><MoneyInput value={value} onChange={e=>setValue(e.target.value)} placeholder="0"/></label><DialogFooter><Button variant="secondary" onClick={()=>onOpenChange(false)}>Cancel</Button><Button onClick={()=>{const v=parseMoney(value);if(v>0)onSave(v)}}>Record valuation</Button></DialogFooter></DialogContent></Dialog>
}

function PortfolioPlanDialog({open,onOpenChange,current,onSave}:{open:boolean;onOpenChange:(v:boolean)=>void;current?:InvestmentPlan;onSave:(p:InvestmentPlan)=>void}){
 const[target,setTarget]=useState(""),[monthly,setMonthly]=useState("");
 useEffect(()=>{if(open){setTarget(current?.targetMinor?String(current.targetMinor/100):"");setMonthly(current?.monthlyContributionMinor?String(current.monthlyContributionMinor/100):"")}},[open,current]);
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Portfolio target</DialogTitle><DialogDescription>Set a value target and optional monthly contribution. Projections exclude market returns and are not investment advice.</DialogDescription></DialogHeader><div className="dialogFields"><label className="span2"><span>Target portfolio value</span><MoneyInput value={target} onChange={e=>setTarget(e.target.value)} placeholder="1500000"/></label><label className="span2"><span>Monthly contribution <small>optional</small></span><MoneyInput value={monthly} onChange={e=>setMonthly(e.target.value)} placeholder="25000"/></label></div><DialogFooter><Button variant="secondary" onClick={()=>onOpenChange(false)}>Cancel</Button><Button onClick={()=>{const t=parseMoney(target),m=parseMoney(monthly);if(t>0)onSave({targetMinor:t,monthlyContributionMinor:m||undefined})}}>Save target</Button></DialogFooter></DialogContent></Dialog>
}
