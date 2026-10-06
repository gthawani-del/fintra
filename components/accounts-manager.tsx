"use client";
import{useEffect,useState}from"react";
import{Archive,Plus,Banknote,Building2,CreditCard,Landmark,WalletCards}from"lucide-react";
import{Button}from"@/components/ui/button";
import{Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle}from"@/components/ui/dialog";
import{MoneyInput}from"@/components/ui/money-input";
import{EmptyState}from"@/components/ui/empty-state";
import{loadState,saveState}from"@/lib/storage/store";
import{formatINR}from"@/lib/domain/money";
import type{Account,FinanceState,AccountType}from"@/types/finance";

const types=[["bank","Bank",Building2],["cash","Cash",Banknote],["credit_card","Credit card",CreditCard],["investment","Investment",Landmark],["loan","Loan",WalletCards]] as const;
function label(type:AccountType){return type==="credit_card"?"Amount owed":type==="loan"?"Outstanding balance":type==="investment"?"Current value":"Current balance"}
function icon(type:AccountType){return types.find(x=>x[0]===type)?.[2]||WalletCards}

export function AccountsManager(){
 const[s,setS]=useState<FinanceState|null>(null),[open,setOpen]=useState(false),[archive,setArchive]=useState<Account|null>(null);
 useEffect(()=>setS(loadState()),[]);
 if(!s)return <div className="surface" aria-busy="true">Loading accounts…</div>;
 const commit=(n:FinanceState)=>{setS(n);saveState(n)};
 const active=s.accounts.filter(a=>!a.archived),assets=active.filter(a=>!["credit_card","loan"].includes(a.type)),liabilities=active.filter(a=>["credit_card","loan"].includes(a.type));
 const assetTotal=assets.reduce((n,a)=>n+a.balanceMinor,0),liabilityTotal=liabilities.reduce((n,a)=>n+a.balanceMinor,0);
 return <>
  <div className="accountSummary"><div><span>Assets</span><strong>{formatINR(assetTotal)}</strong><small>{assets.length} accounts</small></div><div><span>Liabilities</span><strong>{formatINR(liabilityTotal)}</strong><small>{liabilities.length} accounts</small></div><div><span>Net position</span><strong>{formatINR(assetTotal-liabilityTotal)}</strong><small>Accounts only</small></div><Button onClick={()=>setOpen(true)}><Plus size={16}/> Add account</Button></div>
  {active.length===0?<div className="surface"><EmptyState title="No accounts yet" body="Add a bank, cash, credit card, investment or loan account." action={<Button onClick={()=>setOpen(true)}><Plus size={15}/> Add account</Button>}/></div>:<div className="accountGroups">
   <AccountGroup title="Assets" accounts={assets} onArchive={setArchive}/>
   <AccountGroup title="Liabilities" accounts={liabilities} onArchive={setArchive}/>
  </div>}
  <AccountDialog open={open} onOpenChange={setOpen} onSave={a=>{commit({...s,accounts:[...s.accounts,a]});setOpen(false)}}/>
  <Dialog open={!!archive} onOpenChange={v=>{if(!v)setArchive(null)}}><DialogContent><DialogHeader><DialogTitle>Archive account?</DialogTitle><DialogDescription>{archive?.name} will leave active views, while its record remains in this demo workspace.</DialogDescription></DialogHeader><DialogFooter><Button variant="secondary" onClick={()=>setArchive(null)}>Cancel</Button><Button variant="danger" onClick={()=>{if(archive)commit({...s,accounts:s.accounts.map(x=>x.id===archive.id?{...x,archived:true}:x)});setArchive(null)}}>Archive account</Button></DialogFooter></DialogContent></Dialog>
 </>;
}

function AccountGroup({title,accounts,onArchive}:{title:string;accounts:Account[];onArchive:(a:Account)=>void}){if(!accounts.length)return null;return <section className="accountGroup"><div className="groupHeader"><h2>{title}</h2><span>{accounts.length}</span></div><div className="accountGrid">{accounts.map(a=>{const Icon=icon(a.type);return <article className="accountCard" key={a.id}><div className="accountIcon"><Icon size={20}/></div><div className="accountCardMain"><span>{a.type.replace("_"," ")}</span><h3>{a.name}</h3><small>{label(a.type)}</small><strong>{formatINR(a.balanceMinor)}</strong></div><button className="accountArchive" aria-label={"Archive "+a.name} onClick={()=>onArchive(a)}><Archive size={16}/></button></article>})}</div></section>}

function AccountDialog({open,onOpenChange,onSave}:{open:boolean;onOpenChange:(v:boolean)=>void;onSave:(a:Account)=>void}){
 const[name,setName]=useState(""),[type,setType]=useState<AccountType>("bank"),[bal,setBal]=useState("");
 useEffect(()=>{if(open){setName("");setType("bank");setBal("")}},[open]);
 function submit(e:React.FormEvent){e.preventDefault();if(!name.trim())return;onSave({id:crypto.randomUUID(),name:name.trim(),type,balanceMinor:Math.round(Math.max(0,Number(bal||0))*100),currency:"INR"})}
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><form onSubmit={submit}><DialogHeader><DialogTitle>Add account</DialogTitle><DialogDescription>Use today’s balance. Liability amounts are entered as positive values.</DialogDescription></DialogHeader><div className="accountTypePicker">{types.map(([value,text,Icon])=><button type="button" key={value} className={type===value?"active":""} aria-pressed={type===value} onClick={()=>setType(value)}><Icon size={17}/><span>{text}</span></button>)}</div><div className="dialogFields"><label className="span2"><span>Account name</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. HDFC Salary"/></label><label className="span2"><span>{label(type)}</span><MoneyInput value={bal} onChange={e=>setBal(e.target.value)} placeholder="0"/></label></div><DialogFooter><Button type="button" variant="secondary" onClick={()=>onOpenChange(false)}>Cancel</Button><Button type="submit">Add account</Button></DialogFooter></form></DialogContent></Dialog>
}