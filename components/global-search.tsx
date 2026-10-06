"use client";
import{useEffect,useMemo,useState}from"react";
import{Search}from"lucide-react";
import{useRouter}from"next/navigation";
import{Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger}from"@/components/ui/dialog";
import{loadState}from"@/lib/storage/store";
import{formatINR}from"@/lib/domain/money";
import type{FinanceState}from"@/types/finance";

export function GlobalSearch(){
 const router=useRouter(),[open,setOpen]=useState(false),[q,setQ]=useState(""),[state,setState]=useState<FinanceState|null>(null);
 useEffect(()=>{if(open)setState(loadState())},[open]);
 const results=useMemo(()=>{
  if(!state||q.trim().length<2)return[];
  const needle=q.trim().toLowerCase();
  const tx=state.transactions.filter(x=>x.description.toLowerCase().includes(needle)).slice(0,5).map(x=>({id:x.id,label:x.description,meta:(x.type==="expense"?"-":x.type==="income"?"+":"")+formatINR(x.amountMinor),route:"/transactions?q="+encodeURIComponent(x.description),kind:"Transaction"}));
  const accounts=state.accounts.filter(x=>!x.archived&&x.name.toLowerCase().includes(needle)).slice(0,3).map(x=>({id:x.id,label:x.name,meta:formatINR(x.balanceMinor),route:"/accounts",kind:"Account"}));
  const goals=(state.goals||[]).filter(x=>x.status==="active"&&x.name.toLowerCase().includes(needle)).slice(0,3).map(x=>({id:x.id,label:x.name,meta:formatINR(x.targetMinor),route:"/goals",kind:"Goal"}));
  const holdings=(state.holdings||[]).filter(x=>x.name.toLowerCase().includes(needle)).slice(0,3).map(x=>({id:x.id,label:x.name,meta:formatINR(x.valueMinor),route:"/investments",kind:"Investment"}));
  return[...tx,...accounts,...goals,...holdings];
 },[state,q]);
 function go(route:string){setOpen(false);setQ("");router.push(route)}
 return <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild><button className="globalSearchTrigger"><Search size={17}/><span>Search transactions, accounts, goals…</span><kbd>⌘ K</kbd></button></DialogTrigger>
  <DialogContent className="searchDialog">
   <DialogHeader><DialogTitle>Search Fintra</DialogTitle><DialogDescription>Find transactions, accounts, goals and investments in this workspace.</DialogDescription></DialogHeader>
   <div className="searchInputWrap"><Search size={18}/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Start typing…" aria-label="Search Fintra"/></div>
   <div className="searchResults">{q.trim().length<2?<div className="searchHint">Type at least 2 characters.</div>:results.length?results.map(x=><button key={x.kind+x.id} onClick={()=>go(x.route)}><span><small>{x.kind}</small><b>{x.label}</b></span><strong>{x.meta}</strong></button>):<div className="searchHint">No matching records.</div>}</div>
  </DialogContent>
 </Dialog>
}