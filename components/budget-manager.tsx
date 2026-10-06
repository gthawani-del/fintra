"use client";
import{useEffect,useMemo,useState}from"react";
import{Calculator,Check,Pencil}from"lucide-react";
import{Button}from"@/components/ui/button";
import{Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle}from"@/components/ui/dialog";
import{MoneyInput}from"@/components/ui/money-input";
import{EmptyState}from"@/components/ui/empty-state";
import{loadState,saveState}from"@/lib/storage/store";
import{formatINR}from"@/lib/domain/money";
import{localMonthKey,monthLabel}from"@/lib/domain/date";
import type{BudgetItem,Category,FinanceState}from"@/types/finance";

const STARTING_WEIGHTS:Record<string,number>={
 "housing":35,
 "groceries":18,
 "food & drinks":14,
 "food and drinks":14,
 "dining":14,
 "transport":12,
 "health":8,
 "shopping":5,
 "entertainment":4,
 "other":4
};
const CATEGORY_COLORS=["#2f7d61","#4f9278","#78a990","#3f7ea6","#b06b58","#9a7bb8","#b38a3b","#71827a"];

function startingSplit(categories:Category[],total:number):BudgetItem[]{
 if(total<=0||!categories.length)return[];
 const weights=categories.map(c=>STARTING_WEIGHTS[c.name.trim().toLowerCase()]??6);
 const weightTotal=weights.reduce((n,w)=>n+w,0)||1;
 const step=50000; // ₹500 in minor units
 let allocated=0;
 return categories.map((c,index)=>{
  let limit:number;
  if(index===categories.length-1){
   limit=Math.max(0,total-allocated);
  }else{
   const raw=total*weights[index]/weightTotal;
   limit=Math.max(0,Math.round(raw/step)*step);
   allocated+=limit;
  }
  return{categoryId:c.id,limitMinor:limit};
 });
}

export function BudgetManager(){
 const[s,setS]=useState<FinanceState|null>(null),[overallOpen,setOverallOpen]=useState(false),[categoryId,setCategoryId]=useState<string|null>(null),[justApplied,setJustApplied]=useState(false);
 useEffect(()=>setS(loadState()),[]);
 if(!s)return <div className="surface" aria-busy="true">Loading budget…</div>;

 const month=s.budget?.month||localMonthKey(),b=s.budget||{month,limitMinor:0,items:[],rollover:false};
 const expenses=s.transactions.filter(t=>t.type==="expense"&&t.date.startsWith(month)),spent=expenses.reduce((n,t)=>n+t.amountMinor,0),remaining=b.limitMinor-spent;
 const commit=(n:FinanceState)=>{setS(n);saveState(n)};
 const categories=s.categories.filter(c=>c.type==="expense"&&!c.archived);
 const hasSavedCategoryPlan=b.items.some(i=>i.limitMinor>0);
 const suggestions=useMemo(()=>startingSplit(categories,b.limitMinor),[categories,b.limitMinor]);
 const suggestionMap=useMemo(()=>new Map(suggestions.map(i=>[i.categoryId,i.limitMinor])),[suggestions]);
 const suggestionMode=b.limitMinor>0&&!hasSavedCategoryPlan&&categories.length>0;

 function applySuggestedSplit(){
  commit({...s,budget:{...b,items:suggestions}});
  setJustApplied(true);
  window.setTimeout(()=>setJustApplied(false),2800);
 }

 function saveCategoryLimit(limit:number){
  if(!categoryId)return;
  const baseItems=suggestionMode?suggestions:b.items;
  const items=[...baseItems.filter(i=>i.categoryId!==categoryId),{categoryId,limitMinor:limit}];
  commit({...s,budget:{...b,items}});
  setCategoryId(null);
 }

 return <>
  <section className="budgetHero">
   <div><span>{monthLabel(month)}</span><h2>{b.limitMinor?formatINR(b.limitMinor):"No budget set"}</h2><p>{b.limitMinor?formatINR(Math.max(0,remaining))+" remaining":"Set one monthly limit, then refine categories if useful."}</p></div>
   <div className="budgetHeroMetrics"><span><small>Spent</small><b>{formatINR(spent)}</b></span><span><small>Remaining</small><b className={remaining<0?"negativeText":""}>{b.limitMinor?formatINR(remaining):"—"}</b></span><span><small>Used</small><b>{b.limitMinor?Math.round(spent/b.limitMinor*100)+"%":"—"}</b></span></div>
   <Button variant="secondary" onClick={()=>setOverallOpen(true)}><Pencil size={15}/>{b.limitMinor?"Edit budget":"Set budget"}</Button>
  </section>

  {suggestionMode&&<section className="budgetSuggestion" aria-label="Suggested starting budget">
   <div className="budgetSuggestionIcon"><Calculator size={20}/></div>
   <div className="budgetSuggestionCopy">
    <span className="sectionKicker">SUGGESTED STARTING BUDGET</span>
    <h2>Fintra has split {formatINR(b.limitMinor)} for you.</h2>
    <p>Fintra has created a practical starting split using a simple category model. It is a starting estimate, not personalised financial advice, and every amount is editable.</p>
   </div>
   <Button onClick={applySuggestedSplit}>Use suggested split</Button>
  </section>}

  {justApplied&&<div className="budgetAppliedNotice" role="status"><Check size={16}/><span>Suggested category split applied. You can edit any amount below.</span></div>}

  <div className="surface budgetCategories">
   <div className="surfaceHead"><div><span className="sectionKicker">CATEGORY LIMITS</span><h2>{suggestionMode?"A practical starting split":"Where the month is going"}</h2></div><label className="rolloverToggle"><input type="checkbox" checked={b.rollover} onChange={e=>commit({...s,budget:{...b,rollover:e.target.checked}})}/><span>Rollover unused budget</span></label></div>
   {categories.length?<div className={"budgetRows "+(suggestionMode?"isSuggestionMode":"")}>{categories.map((c,index)=>{
    const item=b.items.find(i=>i.categoryId===c.id),suggested=suggestionMap.get(c.id)||0,limit=item?.limitMinor||suggested,used=expenses.filter(t=>t.categoryId===c.id).reduce((n,t)=>n+t.amountMinor,0),usedPct=limit?Math.round(used/limit*100):0,sharePct=b.limitMinor&&limit?Math.round(limit/b.limitMinor*100):0,color=CATEGORY_COLORS[index%CATEGORY_COLORS.length];
    return <button className={"budgetRow "+(suggestionMode?"budgetRowSuggested":"")} style={{"--budget-accent":color} as React.CSSProperties} key={c.id} onClick={()=>setCategoryId(c.id)}>
     <span className="budgetCategoryName"><span className="budgetCategoryLabel"><i style={{background:color}}/><b>{c.name}</b></span><small>{suggestionMode?"Suggested · "+sharePct+"% of budget":limit?formatINR(limit)+" limit":"No category limit"}</small></span>
     <span className={suggestionMode?"budgetAllocationBar":"budgetRowBar"}><i style={{width:(suggestionMode?sharePct:Math.min(100,usedPct))+"%",background:color}}/></span>
     <span className="budgetRowValue"><b>{suggestionMode?formatINR(limit):formatINR(used)}</b><small>{suggestionMode?"Suggested amount":limit?usedPct+"% used":"Set limit"}</small></span>
     <Pencil size={15}/>
    </button>
   })}</div>:<EmptyState title="No expense categories" body="Create categories in Settings before assigning category budgets."/>}
  </div>

  <OverallBudgetDialog open={overallOpen} onOpenChange={setOverallOpen} current={b.limitMinor} onSave={limit=>{commit({...s,budget:{...b,limitMinor:limit}});setOverallOpen(false);setJustApplied(false)}}/>
  <CategoryBudgetDialog open={!!categoryId} onOpenChange={v=>{if(!v)setCategoryId(null)}} name={categories.find(c=>c.id===categoryId)?.name||""} current={b.items.find(i=>i.categoryId===categoryId)?.limitMinor||suggestionMap.get(categoryId||"")||0} suggested={suggestionMode} onSave={saveCategoryLimit}/>
 </>;
}

function OverallBudgetDialog({open,onOpenChange,current,onSave}:{open:boolean;onOpenChange:(v:boolean)=>void;current:number;onSave:(v:number)=>void}){const[value,setValue]=useState("");useEffect(()=>{if(open)setValue(current?String(current/100):"")},[open,current]);return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Monthly budget</DialogTitle><DialogDescription>Set one total spending limit for the month. If you have no category limits yet, Fintra can suggest a starting split.</DialogDescription></DialogHeader><label className="dialogLabel"><span>Monthly limit</span><MoneyInput value={value} onChange={e=>setValue(e.target.value)} placeholder="100000"/></label><DialogFooter><Button variant="secondary" onClick={()=>onOpenChange(false)}>Cancel</Button><Button onClick={()=>onSave(Math.round(Math.max(0,Number(value||0))*100))}>Save budget</Button></DialogFooter></DialogContent></Dialog>}

function CategoryBudgetDialog({open,onOpenChange,name,current,suggested,onSave}:{open:boolean;onOpenChange:(v:boolean)=>void;name:string;current:number;suggested:boolean;onSave:(v:number)=>void}){const[value,setValue]=useState("");useEffect(()=>{if(open)setValue(current?String(current/100):"")},[open,current]);return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>{name||"Category"} limit</DialogTitle><DialogDescription>{suggested?"Fintra has prefilled its suggested starting amount. Change it to whatever works for you.":"Use a category limit only when it improves the way you plan."}</DialogDescription></DialogHeader><label className="dialogLabel"><span>Limit</span><MoneyInput value={value} onChange={e=>setValue(e.target.value)} placeholder="0"/></label><DialogFooter><Button variant="secondary" onClick={()=>onOpenChange(false)}>Cancel</Button><Button onClick={()=>onSave(Math.round(Math.max(0,Number(value||0))*100))}>Save limit</Button></DialogFooter></DialogContent></Dialog>}