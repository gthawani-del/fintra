"use client";
import{useEffect,useState}from"react";
import{Pencil}from"lucide-react";
import{Button}from"@/components/ui/button";
import{Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle}from"@/components/ui/dialog";
import{MoneyInput}from"@/components/ui/money-input";
import{EmptyState}from"@/components/ui/empty-state";
import{loadState,saveState}from"@/lib/storage/store";
import{formatINR}from"@/lib/domain/money";
import{localMonthKey,monthLabel}from"@/lib/domain/date";
import type{FinanceState}from"@/types/finance";

export function BudgetManager(){
 const[s,setS]=useState<FinanceState|null>(null),[overallOpen,setOverallOpen]=useState(false),[categoryId,setCategoryId]=useState<string|null>(null);
 useEffect(()=>setS(loadState()),[]);
 if(!s)return <div className="surface" aria-busy="true">Loading budget…</div>;
 const month=s.budget?.month||localMonthKey(),b=s.budget||{month,limitMinor:0,items:[],rollover:false};
 const expenses=s.transactions.filter(t=>t.type==="expense"&&t.date.startsWith(month)),spent=expenses.reduce((n,t)=>n+t.amountMinor,0),remaining=b.limitMinor-spent;
 const commit=(n:FinanceState)=>{setS(n);saveState(n)};
 const categories=s.categories.filter(c=>c.type==="expense"&&!c.archived);
 return <>
  <section className="budgetHero">
   <div><span>{monthLabel(month)}</span><h2>{b.limitMinor?formatINR(b.limitMinor):"No budget set"}</h2><p>{b.limitMinor?formatINR(Math.max(0,remaining))+" remaining":"Set one monthly limit, then refine categories if useful."}</p></div>
   <div className="budgetHeroMetrics"><span><small>Spent</small><b>{formatINR(spent)}</b></span><span><small>Remaining</small><b className={remaining<0?"negativeText":""}>{b.limitMinor?formatINR(remaining):"—"}</b></span><span><small>Used</small><b>{b.limitMinor?Math.round(spent/b.limitMinor*100)+"%":"—"}</b></span></div>
   <Button variant="secondary" onClick={()=>setOverallOpen(true)}><Pencil size={15}/>{b.limitMinor?"Edit budget":"Set budget"}</Button>
  </section>
  <div className="surface budgetCategories">
   <div className="surfaceHead"><div><span className="sectionKicker">CATEGORY LIMITS</span><h2>Where the month is going</h2></div><label className="rolloverToggle"><input type="checkbox" checked={b.rollover} onChange={e=>commit({...s,budget:{...b,rollover:e.target.checked}})}/><span>Rollover unused budget</span></label></div>
   {categories.length?<div className="budgetRows">{categories.map(c=>{const item=b.items.find(i=>i.categoryId===c.id),used=expenses.filter(t=>t.categoryId===c.id).reduce((n,t)=>n+t.amountMinor,0),limit=item?.limitMinor||0,pct=limit?Math.round(used/limit*100):0;return <button className="budgetRow" key={c.id} onClick={()=>setCategoryId(c.id)}><span className="budgetCategoryName"><b>{c.name}</b><small>{limit?formatINR(limit)+" limit":"No category limit"}</small></span><span className="budgetRowBar"><i style={{width:Math.min(100,pct)+"%"}}/></span><span className="budgetRowValue"><b>{formatINR(used)}</b><small>{limit?pct+"% used":"Set limit"}</small></span><Pencil size={15}/></button>})}</div>:<EmptyState title="No expense categories" body="Create categories in Settings before assigning category budgets."/>}
  </div>
  <OverallBudgetDialog open={overallOpen} onOpenChange={setOverallOpen} current={b.limitMinor} onSave={limit=>{commit({...s,budget:{...b,limitMinor:limit}});setOverallOpen(false)}}/>
  <CategoryBudgetDialog open={!!categoryId} onOpenChange={v=>{if(!v)setCategoryId(null)}} name={categories.find(c=>c.id===categoryId)?.name||""} current={b.items.find(i=>i.categoryId===categoryId)?.limitMinor||0} onSave={limit=>{if(!categoryId)return;const items=[...b.items.filter(i=>i.categoryId!==categoryId),{categoryId,limitMinor:limit}];commit({...s,budget:{...b,items}});setCategoryId(null)}}/>
 </>;
}

function OverallBudgetDialog({open,onOpenChange,current,onSave}:{open:boolean;onOpenChange:(v:boolean)=>void;current:number;onSave:(v:number)=>void}){const[value,setValue]=useState("");useEffect(()=>{if(open)setValue(current?String(current/100):"")},[open,current]);return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Monthly budget</DialogTitle><DialogDescription>Set one total spending limit for the month. Category limits remain optional.</DialogDescription></DialogHeader><label className="dialogLabel"><span>Monthly limit</span><MoneyInput value={value} onChange={e=>setValue(e.target.value)} placeholder="100000"/></label><DialogFooter><Button variant="secondary" onClick={()=>onOpenChange(false)}>Cancel</Button><Button onClick={()=>onSave(Math.round(Math.max(0,Number(value||0))*100))}>Save budget</Button></DialogFooter></DialogContent></Dialog>}

function CategoryBudgetDialog({open,onOpenChange,name,current,onSave}:{open:boolean;onOpenChange:(v:boolean)=>void;name:string;current:number;onSave:(v:number)=>void}){const[value,setValue]=useState("");useEffect(()=>{if(open)setValue(current?String(current/100):"")},[open,current]);return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>{name||"Category"} limit</DialogTitle><DialogDescription>Use a category limit only when it improves the way you plan.</DialogDescription></DialogHeader><label className="dialogLabel"><span>Limit</span><MoneyInput value={value} onChange={e=>setValue(e.target.value)} placeholder="0"/></label><DialogFooter><Button variant="secondary" onClick={()=>onOpenChange(false)}>Cancel</Button><Button onClick={()=>onSave(Math.round(Math.max(0,Number(value||0))*100))}>Save limit</Button></DialogFooter></DialogContent></Dialog>}