"use client";
import{useEffect,useMemo,useState}from"react";
import{Pencil,Plus,Trash2}from"lucide-react";
import{Button}from"@/components/ui/button";
import{Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle}from"@/components/ui/dialog";
import{MoneyInput}from"@/components/ui/money-input";
import{EmptyState}from"@/components/ui/empty-state";
import{loadState,saveState}from"@/lib/storage/store";
import{formatINR}from"@/lib/domain/money";
import{formatShortDate,localDateKey}from"@/lib/domain/date";
import type{FinanceState,Transaction,TxType}from"@/types/finance";

export function Ledger(){
 const[s,setS]=useState<FinanceState|null>(null),[edit,setEdit]=useState<Transaction|null|undefined>(undefined),[remove,setRemove]=useState<Transaction|null>(null),[q,setQ]=useState(""),[type,setType]=useState("all"),[accountFilter,setAccountFilter]=useState("all");
 useEffect(()=>{setS(loadState());const params=new URLSearchParams(window.location.search);setQ(params.get("q")||"")},[]);
 const rows=useMemo(()=>s?.transactions.filter(t=>(type==="all"||t.type===type)&&(accountFilter==="all"||t.accountId===accountFilter)&&t.description.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>b.date.localeCompare(a.date))??[],[s,q,type,accountFilter]);
 if(!s)return <div className="surface" aria-busy="true">Loading transactions…</div>;
 const commit=(n:FinanceState)=>{setS(n);saveState(n)};
 const totalIncome=rows.filter(x=>x.type==="income").reduce((n,x)=>n+x.amountMinor,0),totalExpense=rows.filter(x=>x.type==="expense").reduce((n,x)=>n+x.amountMinor,0);
 return <>
  <div className="transactionToolbar">
   <div className="filterSearch"><input aria-label="Search transactions" placeholder="Search merchant or description" value={q} onChange={e=>setQ(e.target.value)}/></div>
   <div className="filterGroup" role="group" aria-label="Transaction type">{[["all","All"],["income","Income"],["expense","Expenses"],["transfer","Transfers"]].map(([v,l])=><button key={v} className={type===v?"active":""} onClick={()=>setType(v)}>{l}</button>)}</div>
   <select aria-label="Filter by account" value={accountFilter} onChange={e=>setAccountFilter(e.target.value)}><option value="all">All accounts</option>{s.accounts.filter(a=>!a.archived).map(a=><option value={a.id} key={a.id}>{a.name}</option>)}</select>
   <Button onClick={()=>setEdit(null)}><Plus size={16}/> Add transaction</Button>
  </div>

  <div className="transactionSummary"><span><small>Filtered income</small><b className="positiveText">{formatINR(totalIncome)}</b></span><span><small>Filtered expenses</small><b className="negativeText">{formatINR(totalExpense)}</b></span><span><small>Transactions</small><b>{rows.length}</b></span></div>

  <div className="surface transactionTableWrap">
   {rows.length===0?<EmptyState title="No transactions found" body="Change the filters or add a new transaction." action={<Button onClick={()=>setEdit(null)}><Plus size={15}/> Add transaction</Button>}/>:<>
    <table className="dataTable desktopOnly"><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Account</th><th className="amount">Amount</th><th aria-label="Actions"/></tr></thead><tbody>{rows.map(t=>{const a=s.accounts.find(x=>x.id===t.accountId),cat=s.categories.find(x=>x.id===t.categoryId);return <tr key={t.id}><td>{formatShortDate(t.date)}</td><td><b>{t.description}</b></td><td>{cat?.name|| (t.type==="transfer"?"Transfer":"Uncategorised")}</td><td>{a?.name||"—"}</td><td className={"amount "+(t.type==="income"?"positiveText":t.type==="expense"?"negativeText":"")}>{t.type==="expense"?"-":t.type==="income"?"+":""}{formatINR(t.amountMinor)}</td><td><div className="rowActions"><button aria-label={"Edit "+t.description} onClick={()=>setEdit(t)}><Pencil size={15}/></button><button aria-label={"Delete "+t.description} onClick={()=>setRemove(t)}><Trash2 size={15}/></button></div></td></tr>})}</tbody></table>
    <div className="mobileTxList mobileOnly">{rows.map(t=>{const a=s.accounts.find(x=>x.id===t.accountId),cat=s.categories.find(x=>x.id===t.categoryId);return <button key={t.id} className="mobileTx" onClick={()=>setEdit(t)}><span><b>{t.description}</b><small>{cat?.name||t.type} · {a?.name||"Account"} · {formatShortDate(t.date)}</small></span><strong className={t.type==="income"?"positiveText":t.type==="expense"?"negativeText":""}>{t.type==="expense"?"-":t.type==="income"?"+":""}{formatINR(t.amountMinor)}</strong></button>})}</div>
   </>}
  </div>

  <TransactionDialog open={edit!==undefined} state={s} initial={edit??null} onOpenChange={v=>{if(!v)setEdit(undefined)}} onSave={t=>{const exists=s.transactions.some(x=>x.id===t.id);commit({...s,transactions:exists?s.transactions.map(x=>x.id===t.id?t:x):[t,...s.transactions]});setEdit(undefined)}}/>

  <Dialog open={!!remove} onOpenChange={v=>{if(!v)setRemove(null)}}><DialogContent><DialogHeader><DialogTitle>Delete transaction?</DialogTitle><DialogDescription>{remove?remove.description:"This transaction"} will be removed from this demo workspace. This cannot be undone.</DialogDescription></DialogHeader><DialogFooter><Button variant="secondary" onClick={()=>setRemove(null)}>Cancel</Button><Button variant="danger" onClick={()=>{if(remove)commit({...s,transactions:s.transactions.filter(x=>x.id!==remove.id)});setRemove(null)}}>Delete transaction</Button></DialogFooter></DialogContent></Dialog>
 </>;
}

function TransactionDialog({open,state,initial,onOpenChange,onSave}:{open:boolean;state:FinanceState;initial:Transaction|null;onOpenChange:(v:boolean)=>void;onSave:(t:Transaction)=>void}){
 const[type,setType]=useState<TxType>(initial?.type||"expense"),[desc,setDesc]=useState(initial?.description||""),[amt,setAmt]=useState(initial?String(initial.amountMinor/100):""),[date,setDate]=useState(initial?.date||localDateKey()),[account,setAccount]=useState(initial?.accountId||state.accounts[0]?.id||""),[to,setTo]=useState(initial?.transferAccountId||""),[cat,setCat]=useState(initial?.categoryId||"");
 useEffect(()=>{if(open){setType(initial?.type||"expense");setDesc(initial?.description||"");setAmt(initial?String(initial.amountMinor/100):"");setDate(initial?.date||localDateKey());setAccount(initial?.accountId||state.accounts[0]?.id||"");setTo(initial?.transferAccountId||"");setCat(initial?.categoryId||"")}},[open,initial,state.accounts]);
 function submit(e:React.FormEvent){e.preventDefault();const m=Math.round(Number(amt)*100);if(!desc.trim()||m<=0||!account||(type==="transfer"&&!to))return;onSave({id:initial?.id||crypto.randomUUID(),accountId:account,type,amountMinor:m,date,description:desc.trim(),categoryId:type==="transfer"?undefined:cat||undefined,transferAccountId:type==="transfer"?to:undefined})}
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="transactionDialog"><form onSubmit={submit}><DialogHeader><DialogTitle>{initial?"Edit transaction":"Add transaction"}</DialogTitle><DialogDescription>{initial?"Correct the ledger entry without changing its identity.":"Record an income, expense or transfer."}</DialogDescription></DialogHeader>
  <div className="dialogFields"><label><span>Type</span><select value={type} onChange={e=>setType(e.target.value as TxType)}><option value="expense">Expense</option><option value="income">Income</option><option value="transfer">Transfer</option></select></label><label><span>Date</span><input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><label className="span2"><span>Description</span><input autoComplete="off" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="e.g. Blue Tokai"/></label><label><span>Amount</span><MoneyInput value={amt} onChange={e=>setAmt(e.target.value)} placeholder="0"/></label><label><span>Account</span><select value={account} onChange={e=>setAccount(e.target.value)}>{state.accounts.filter(a=>!a.archived).map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></label>{type==="transfer"?<label className="span2"><span>Transfer to</span><select value={to} onChange={e=>setTo(e.target.value)}><option value="">Choose destination account</option>{state.accounts.filter(a=>a.id!==account&&!a.archived).map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></label>:<label className="span2"><span>Category</span><select value={cat} onChange={e=>setCat(e.target.value)}><option value="">Uncategorised</option>{state.categories.filter(c=>c.type===type&&!c.archived).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>}</div>
  <DialogFooter><Button type="button" variant="secondary" onClick={()=>onOpenChange(false)}>Cancel</Button><Button type="submit">{initial?"Save changes":"Add transaction"}</Button></DialogFooter>
 </form></DialogContent></Dialog>
}