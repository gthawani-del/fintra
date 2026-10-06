"use client";
import{useEffect,useState}from"react";
import{Download,Upload}from"lucide-react";
import{Button}from"@/components/ui/button";
import{loadState,saveState}from"@/lib/storage/store";
import{parseCsv,normalizeRows,removeDuplicates}from"@/lib/import/csv";
import{transactionsCsv}from"@/lib/export/csv";
import{formatINR}from"@/lib/domain/money";
import type{FinanceState,Transaction}from"@/types/finance";
export function DataPortability(){
 const[s,setS]=useState<FinanceState|null>(null),[preview,setPreview]=useState<Transaction[]>([]),[status,setStatus]=useState(""),[paste,setPaste]=useState("");
 useEffect(()=>setS(loadState()),[]);
 if(!s)return <div className="surface" aria-busy="true">Loading data tools…</div>;
 const state=s;
 function read(text:string){setPaste(text);if(!text.trim()){setPreview([]);setStatus("");return}const normalized=normalizeRows(parseCsv(text),state),clean=removeDuplicates(normalized.transactions,state.transactions);setPreview(clean.unique);setStatus(clean.unique.length+" ready · "+clean.duplicates+" possible duplicates skipped · "+normalized.errors.length+" invalid")}
 async function pick(file:File){read(await file.text())}
 function exportFile(){const blob=new Blob([transactionsCsv(state)],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="fintra-transactions.csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url)}
 return <div className="settingsSection"><div className="settingsSectionHead"><div><h2>Import & export</h2><p>Move transaction data without locking it into Fintra.</p></div><Button variant="secondary" size="sm" onClick={exportFile}><Download size={15}/> Export CSV</Button></div><div className="importFormat"><b>Accepted columns</b><code>date, description, amount, type, account, category</code><small>Example: 2026-10-06,Blue Tokai,460,expense,HDFC Salary,Food & Drinks</small></div><label className="settingsPaste"><span>Paste rows</span><textarea value={paste} onChange={e=>read(e.target.value)} placeholder={"date,description,amount,type,account,category\n2026-10-06,Blue Tokai,460,expense,HDFC Salary,Food & Drinks"}/></label><div className="importActions"><label className="uploadButton"><Upload size={15}/> Upload CSV<input hidden type="file" accept=".csv,text/csv" onChange={e=>{const f=e.target.files?.[0];if(f)pick(f)}}/></label><span>{status||"Preview before importing. Nothing is written automatically."}</span></div>{preview.length>0&&<div className="importPreview">{preview.slice(0,5).map(t=><div key={t.id}><span>{t.date}</span><b>{t.description}</b><strong>{formatINR(t.amountMinor)}</strong></div>)}<Button onClick={()=>{const next={...state,transactions:[...preview,...state.transactions]};setS(next);saveState(next);setPreview([]);setPaste("");setStatus("Import complete")}}>Import {preview.length} transactions</Button></div>}</div>;
}