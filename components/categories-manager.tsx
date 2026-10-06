"use client";
import{useEffect,useState}from"react";
import{Archive,Plus}from"lucide-react";
import{Button}from"@/components/ui/button";
import{Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle}from"@/components/ui/dialog";
import{EmptyState}from"@/components/ui/empty-state";
import{loadState,saveState}from"@/lib/storage/store";
import type{FinanceState}from"@/types/finance";
export function CategoriesManager(){
 const[s,setS]=useState<FinanceState|null>(null),[open,setOpen]=useState(false),[name,setName]=useState(""),[type,setType]=useState<"income"|"expense">("expense");
 useEffect(()=>setS(loadState()),[]);
 if(!s)return <div className="surface" aria-busy="true">Loading categories…</div>;
 const commit=(n:FinanceState)=>{setS(n);saveState(n)},active=s.categories.filter(c=>!c.archived);
 return <div className="settingsSection"><div className="settingsSectionHead"><div><h2>Categories</h2><p>Keep transaction labels predictable and easy to scan.</p></div><Button variant="secondary" size="sm" onClick={()=>setOpen(true)}><Plus size={15}/> Add category</Button></div>{active.length?<div className="settingsRows">{active.map(c=><div className="settingsRow" key={c.id}><span><b>{c.name}</b><small>{c.type==="income"?"Income":"Expense"}</small></span><button aria-label={"Archive "+c.name} onClick={()=>commit({...s,categories:s.categories.map(x=>x.id===c.id?{...x,archived:true}:x)})}><Archive size={15}/></button></div>)}</div>:<EmptyState title="No categories" body="Add categories to organise income and expenses."/>}
 <Dialog open={open} onOpenChange={setOpen}><DialogContent><form onSubmit={e=>{e.preventDefault();if(!name.trim())return;commit({...s,categories:[...s.categories,{id:crypto.randomUUID(),name:name.trim(),type}]});setName("");setType("expense");setOpen(false)}}><DialogHeader><DialogTitle>Add category</DialogTitle><DialogDescription>Use short, familiar labels that will make sense in reports.</DialogDescription></DialogHeader><div className="dialogFields"><label className="span2"><span>Name</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Dining"/></label><label className="span2"><span>Type</span><select value={type} onChange={e=>setType(e.target.value as "income"|"expense")}><option value="expense">Expense</option><option value="income">Income</option></select></label></div><DialogFooter><Button type="button" variant="secondary" onClick={()=>setOpen(false)}>Cancel</Button><Button type="submit">Add category</Button></DialogFooter></form></DialogContent></Dialog></div>;
}