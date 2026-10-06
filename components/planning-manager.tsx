"use client";
import{useEffect,useRef,useState}from"react";
import{Archive,ArrowRight,CalendarDays,Car,CheckCircle2,ChevronLeft,ChevronRight,GraduationCap,Home,Plane,Plus,ShieldCheck,Target}from"lucide-react";
import{Button}from"@/components/ui/button";
import{Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle}from"@/components/ui/dialog";
import{MoneyInput}from"@/components/ui/money-input";
import{EmptyState}from"@/components/ui/empty-state";
import{loadState,saveState}from"@/lib/storage/store";
import{formatINR}from"@/lib/domain/money";
import{goalProgress}from"@/lib/domain/planning";
import{formatShortDate}from"@/lib/domain/date";
import type{FinanceState,GoalItem,RecurringItem}from"@/types/finance";

const goalPalette=["#1f6b52","#b17a38","#4c7899","#765f8f","#68747d","#8a5d52"];

function goalVisual(name:string,index:number){
 const n=name.toLowerCase();
 if(/emergency|rainy|safety/.test(n))return{Icon:ShieldCheck,color:"#1f6b52",label:"Safety"};
 if(/travel|trip|vacation|holiday/.test(n))return{Icon:Plane,color:"#b17a38",label:"Experience"};
 if(/home|house|property|deposit/.test(n))return{Icon:Home,color:"#4c7899",label:"Home"};
 if(/car|vehicle/.test(n))return{Icon:Car,color:"#68747d",label:"Mobility"};
 if(/education|study|college|school/.test(n))return{Icon:GraduationCap,color:"#765f8f",label:"Education"};
 return{Icon:Target,color:goalPalette[index%goalPalette.length],label:"Goal"};
}
function nextMilestone(pct:number){for(const m of[25,50,75,100])if(pct<m)return m;return 100}
function amountToMilestone(g:GoalItem,pct:number){return Math.max(0,Math.ceil(g.targetMinor*pct/100)-g.savedMinor)}
function monthsTo(date?:string){if(!date)return null;const d=new Date(date+"T00:00:00"),now=new Date();const months=(d.getFullYear()-now.getFullYear())*12+(d.getMonth()-now.getMonth())+(d.getDate()>=now.getDate()?1:0);return Math.max(1,months)}
function requiredMonthly(g:GoalItem){const months=monthsTo(g.targetDate);return months?Math.ceil(Math.max(0,g.targetMinor-g.savedMinor)/months):null}

export function GoalsManager(){
 const[s,setS]=useState<FinanceState|null>(null),[addOpen,setAddOpen]=useState(false),[contribute,setContribute]=useState<GoalItem|null>(null),[activeIndex,setActiveIndex]=useState(0),[flashId,setFlashId]=useState<string|null>(null),[completedId,setCompletedId]=useState<string|null>(null);
 const trackRef=useRef<HTMLDivElement|null>(null);
 useEffect(()=>setS(loadState()),[]);
 if(!s)return <div className="surface" aria-busy="true">Loading goals…</div>;
 const goals=s.goals||[],active=goals.filter(g=>g.status==="active"),target=active.reduce((n,g)=>n+g.targetMinor,0),saved=active.reduce((n,g)=>n+g.savedMinor,0),overall=target?Math.round(saved/target*100):0,commit=(n:FinanceState)=>{setS(n);saveState(n)};
 const closest=active.map(g=>{const pct=goalProgress(g.savedMinor,g.targetMinor),milestone=nextMilestone(pct);return{g,pct,milestone,gap:amountToMilestone(g,milestone)}}).sort((a,b)=>a.gap-b.gap)[0];

 function scrollTo(index:number){
  const track=trackRef.current;if(!track||!active.length)return;
  const next=Math.max(0,Math.min(active.length-1,index)),child=track.children[next] as HTMLElement|undefined;
  child?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"start"});setActiveIndex(next);
 }
 function updateIndex(){
  const track=trackRef.current;if(!track)return;
  const children=[...track.children] as HTMLElement[];if(!children.length)return;
  const left=track.scrollLeft;
  let best=0,diff=Infinity;
  children.forEach((el,i)=>{const d=Math.abs(el.offsetLeft-left);if(d<diff){diff=d;best=i}});
  setActiveIndex(best);
 }

 return <>
  <section className="goalsEmotionSummary goalsEmotionSummaryCompact">
   <div className="goalsEmotionMain"><span className="sectionKicker">SAVED TOWARD GOALS</span><strong>{formatINR(saved)}</strong><p>{active.length} active goal{active.length===1?"":"s"}</p></div>
   <div className="goalsMetric"><span>Total target</span><strong>{formatINR(target)}</strong><small>{overall}% funded overall</small></div>
   <div className="goalsMetric goalsMetricProgress"><span>Combined progress</span><strong>{overall}%</strong><div className="goalsOverallTrack"><i style={{width:Math.min(100,overall)+"%"}}/></div></div>
   <Button onClick={()=>setAddOpen(true)}><Plus size={16}/> Add goal</Button>
  </section>

  <div className="goalsDesktopLayout">
   <section className="goalExperience">
    <div className="goalExperienceHead"><div><span className="sectionKicker">ACTIVE GOALS</span><h2>Watch the distance shrink.</h2><p>Each contribution moves the future closer.</p></div>{active.length>1&&<div className="goalCarouselControls"><button aria-label="Previous goal" disabled={activeIndex===0} onClick={()=>scrollTo(activeIndex-1)}><ChevronLeft size={18}/></button><span>{activeIndex+1} of {active.length}</span><button aria-label="Next goal" disabled={activeIndex===active.length-1} onClick={()=>scrollTo(activeIndex+1)}><ChevronRight size={18}/></button></div>}</div>
    {active.length?<><div ref={trackRef} className={"goalCarousel "+(active.length===1?"singleGoal":"")} onScroll={updateIndex}>{active.map((g,index)=><GoalStoryCard key={g.id} goal={g} index={index} flash={flashId===g.id} completed={completedId===g.id} onContribute={()=>setContribute(g)}/>)}</div>{active.length>1&&<div className="goalDots" aria-label="Goal position">{active.map((g,i)=><button key={g.id} className={i===activeIndex?"active":""} aria-label={"Show goal "+(i+1)} onClick={()=>scrollTo(i)}/>)}</div>}</>:<div className="surface"><EmptyState title="What are you building toward?" body="Create a goal and Fintra will turn the target into visible milestones." action={<Button onClick={()=>setAddOpen(true)}><Plus size={15}/> Add goal</Button>}/></div>}
   </section>

   <aside className="goalsSidePanel">
    <span className="sectionKicker">NEXT MILESTONE</span>
    {closest?<><div className="goalsMilestoneRing" style={{background:"conic-gradient(#1f6b52 0 "+Math.min(100,closest.pct)+"%, #e7ece8 "+Math.min(100,closest.pct)+"% 100%)"}}><span>{closest.pct}%</span></div><h3>{closest.g.name}</h3><p>{closest.gap?formatINR(closest.gap)+" to reach "+closest.milestone+"%":"Milestone reached"}</p>{closest.g.targetDate&&<div className="goalsSideMeta"><span>Target</span><b>{formatShortDate(closest.g.targetDate)}</b></div>}<Button variant="secondary" size="sm" onClick={()=>setContribute(closest.g)}>Add contribution</Button></>:<><h3>Your first milestone starts here.</h3><p>Create a goal and Fintra will show the next meaningful checkpoint.</p><Button variant="secondary" size="sm" onClick={()=>setAddOpen(true)}>Add goal</Button></>}
   </aside>
  </div>

  <AddGoalDialog open={addOpen} onOpenChange={setAddOpen} onSave={g=>{commit({...s,goals:[...goals,g]});setAddOpen(false);setFlashId(g.id);window.setTimeout(()=>setFlashId(null),1800)}}/>
  <ContributionDialog goal={contribute} open={!!contribute} onOpenChange={v=>{if(!v)setContribute(null)}} onSave={amount=>{
   if(!contribute)return;
   const before=contribute.savedMinor,newSaved=Math.min(contribute.targetMinor,before+amount),done=newSaved>=contribute.targetMinor;
   commit({...s,goals:goals.map(x=>x.id===contribute.id?{...x,savedMinor:newSaved,status:done?"completed":"active"}:x)});
   setFlashId(contribute.id);if(done)setCompletedId(contribute.id);
   window.setTimeout(()=>setFlashId(null),1900);if(done)window.setTimeout(()=>setCompletedId(null),2600);
   setContribute(null);
  }}/>
 </>;
}

function GoalStoryCard({goal,index,flash,completed,onContribute}:{goal:GoalItem;index:number;flash:boolean;completed:boolean;onContribute:()=>void}){
 const pct=goalProgress(goal.savedMinor,goal.targetMinor),milestone=nextMilestone(pct),gap=amountToMilestone(goal,milestone),monthly=requiredMonthly(goal),remaining=Math.max(0,goal.targetMinor-goal.savedMinor),{Icon,color,label}=goalVisual(goal.name,index);
 return <article className={"goalStoryCard "+(flash?"goalStoryFlash ":"")+(completed?"goalStoryComplete":"")} style={{borderTopColor:color}}>
  <div className="goalStoryTop"><span className="goalStoryIcon" style={{background:color+"14",color}}><Icon size={21}/></span><div><small>{label}</small><h3>{goal.name}</h3></div><strong>{pct}%</strong></div>
  <div className="goalStoryMoney"><strong>{formatINR(goal.savedMinor)}</strong><span>of {formatINR(goal.targetMinor)}</span></div>
  <div className="goalStoryTrack" aria-label={pct+"% funded"}><i style={{width:pct+"%",background:color}}/><b className={pct>=25?"hit":""}>25</b><b className={pct>=50?"hit":""}>50</b><b className={pct>=75?"hit":""}>75</b><b className={pct>=100?"hit":""}>100</b></div>
  <div className="goalStoryInsight">
   <span><small>{pct>=100?"GOAL REACHED":"NEXT MILESTONE"}</small><b>{pct>=100?"Fully funded":milestone+"% · "+formatINR(gap)+" away"}</b></span>
   <span><small>{goal.targetDate?"TARGET PACE":"REMAINING"}</small><b>{goal.targetDate?(monthly?formatINR(monthly)+"/month":"Funded") : formatINR(remaining)}</b></span>
  </div>
  <div className="goalStoryFoot"><span>{goal.targetDate?"Target "+formatShortDate(goal.targetDate):"No deadline — move at your own pace."}</span><Button size="sm" variant="secondary" onClick={onContribute}>Add contribution</Button></div>
  {completed&&<div className="goalReached"><CheckCircle2 size={18}/><span>Goal reached</span></div>}
 </article>
}

function AddGoalDialog({open,onOpenChange,onSave}:{open:boolean;onOpenChange:(v:boolean)=>void;onSave:(g:GoalItem)=>void}){
 const[name,setName]=useState(""),[target,setTarget]=useState(""),[date,setDate]=useState("");
 useEffect(()=>{if(open){setName("");setTarget("");setDate("")}},[open]);
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><form onSubmit={e=>{e.preventDefault();const amount=Math.round(Number(target)*100);if(!name.trim()||amount<=0)return;onSave({id:crypto.randomUUID(),name:name.trim(),targetMinor:amount,savedMinor:0,targetDate:date||undefined,status:"active"})}}><DialogHeader><DialogTitle>What are you building toward?</DialogTitle><DialogDescription>Give the goal a name, a target and an optional date. Fintra will turn it into visible milestones.</DialogDescription></DialogHeader><div className="goalSuggestionChips"><button type="button" onClick={()=>setName("Emergency Fund")}>Emergency fund</button><button type="button" onClick={()=>setName("Travel")}>Travel</button><button type="button" onClick={()=>setName("Home Deposit")}>Home deposit</button><button type="button" onClick={()=>setName("New Car")}>New car</button></div><div className="dialogFields"><label className="span2"><span>Goal name</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Emergency fund"/></label><label><span>Target amount</span><MoneyInput value={target} onChange={e=>setTarget(e.target.value)} placeholder="500000"/></label><label><span>Target date <small>optional</small></span><input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label></div><DialogFooter><Button type="button" variant="secondary" onClick={()=>onOpenChange(false)}>Cancel</Button><Button type="submit">Create goal</Button></DialogFooter></form></DialogContent></Dialog>
}

function ContributionDialog({goal,open,onOpenChange,onSave}:{goal:GoalItem|null;open:boolean;onOpenChange:(v:boolean)=>void;onSave:(amount:number)=>void}){
 const[value,setValue]=useState("");
 useEffect(()=>{if(open)setValue("")},[open]);
 const amount=Math.max(0,Number(value||0))*100,after=goal?Math.min(goal.targetMinor,goal.savedMinor+amount):0,afterPct=goal?goalProgress(after,goal.targetMinor):0;
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Add to {goal?.name||"goal"}</DialogTitle><DialogDescription>This demo treats contributions as earmarked progress; it does not move cash between accounts.</DialogDescription></DialogHeader>{goal&&<div className="contributionPreview"><span><small>Current</small><b>{formatINR(goal.savedMinor)}</b></span><ArrowRight size={16}/><span><small>After this</small><b>{formatINR(after)}</b></span><strong>{afterPct}%</strong></div>}<div className="contributionQuick"><button onClick={()=>setValue("5000")} type="button">₹5K</button><button onClick={()=>setValue("10000")} type="button">₹10K</button><button onClick={()=>setValue("25000")} type="button">₹25K</button></div><label className="dialogLabel"><span>Contribution</span><MoneyInput value={value} onChange={e=>setValue(e.target.value)} placeholder="10000"/></label><DialogFooter><Button variant="secondary" onClick={()=>onOpenChange(false)}>Cancel</Button><Button onClick={()=>{const n=Math.round(Number(value)*100);if(n>0)onSave(n)}}>{amount?"Add "+formatINR(amount):"Add contribution"}</Button></DialogFooter></DialogContent></Dialog>
}

export function RecurringManager(){
 const[s,setS]=useState<FinanceState|null>(null),[open,setOpen]=useState(false);
 useEffect(()=>setS(loadState()),[]);
 if(!s)return <div className="surface" aria-busy="true">Loading commitments…</div>;
 const items=s.recurring||[],active=items.filter(x=>x.active),commit=(n:FinanceState)=>{setS(n);saveState(n)};
 return <div className="surface recurringSurface"><div className="surfaceHead"><div><span className="sectionKicker">UPCOMING COMMITMENTS</span><h2>Bills & subscriptions</h2></div><Button variant="secondary" size="sm" onClick={()=>setOpen(true)}><Plus size={15}/> Add recurring</Button></div>{active.length?<div className="recurringList">{active.slice().sort((a,b)=>a.dueDay-b.dueDay).map(x=><div className="recurringRow" key={x.id}><div className="recurringIcon"><CalendarDays size={18}/></div><div><b>{x.name}</b><span>{x.kind==="subscription"?"Subscription":"Bill"} · due day {x.dueDay}</span></div><strong>{formatINR(x.amountMinor)}</strong><button aria-label={"Archive "+x.name} onClick={()=>commit({...s,recurring:items.map(y=>y.id===x.id?{...y,active:false}:y)})}><Archive size={15}/></button></div>)}</div>:<EmptyState title="No recurring commitments" body="Add bills or subscriptions to keep upcoming outflows visible."/>}<AddRecurringDialog open={open} onOpenChange={setOpen} onSave={item=>{commit({...s,recurring:[...items,item]});setOpen(false)}}/></div>;
}

function AddRecurringDialog({open,onOpenChange,onSave}:{open:boolean;onOpenChange:(v:boolean)=>void;onSave:(i:RecurringItem)=>void}){const[name,setName]=useState(""),[amount,setAmount]=useState(""),[dueDay,setDueDay]=useState("1"),[kind,setKind]=useState<"bill"|"subscription">("bill");useEffect(()=>{if(open){setName("");setAmount("");setDueDay("1");setKind("bill")}},[open]);return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><form onSubmit={e=>{e.preventDefault();const value=Math.round(Number(amount)*100),day=Math.max(1,Math.min(31,Number(dueDay)||1));if(!name.trim()||value<=0)return;onSave({id:crypto.randomUUID(),name:name.trim(),kind,amountMinor:value,dueDay:day,active:true})}}><DialogHeader><DialogTitle>Add recurring commitment</DialogTitle><DialogDescription>Keep regular bills and subscriptions visible before they are due.</DialogDescription></DialogHeader><div className="dialogFields"><label className="span2"><span>Name</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Electricity"/></label><label><span>Type</span><select value={kind} onChange={e=>setKind(e.target.value as "bill"|"subscription")}><option value="bill">Bill</option><option value="subscription">Subscription</option></select></label><label><span>Due day</span><input type="number" min="1" max="31" value={dueDay} onChange={e=>setDueDay(e.target.value)}/></label><label className="span2"><span>Amount</span><MoneyInput value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0"/></label></div><DialogFooter><Button type="button" variant="secondary" onClick={()=>onOpenChange(false)}>Cancel</Button><Button type="submit">Add commitment</Button></DialogFooter></form></DialogContent></Dialog>}
