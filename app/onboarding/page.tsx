"use client";

import {useMemo,useState} from "react";
import {useRouter} from "next/navigation";
import {
  ArrowRight, Banknote, Building2, Check, CreditCard, FileSpreadsheet,
  Landmark, Plus, Target, Trash2, Upload, WalletCards
} from "lucide-react";
import {demoState} from "@/lib/demo-data";
import {saveProfile,saveState,currentDisplayName,currentUser} from "@/lib/storage/store";
import {normalizeRows,parseCsv,removeDuplicates} from "@/lib/import/csv";
import type {AccountType,FinanceState,GoalItem,Transaction} from "@/types/finance";

type SetupAccount={id:string;type:AccountType;name:string;balance:string};
type SetupGoal={id:string;name:string;target:string};

const accountTypes=[
  {value:"bank" as AccountType,label:"Bank",Icon:Building2},
  {value:"cash" as AccountType,label:"Cash",Icon:Banknote},
  {value:"credit_card" as AccountType,label:"Credit card",Icon:CreditCard},
  {value:"investment" as AccountType,label:"Investment",Icon:Landmark},
  {value:"loan" as AccountType,label:"Loan",Icon:WalletCards},
];

const goalSuggestions=["Emergency fund","Travel","Home deposit","New car"];

function balanceLabel(type:AccountType){
  if(type==="credit_card")return "Amount owed";
  if(type==="loan")return "Outstanding balance";
  if(type==="investment")return "Current value";
  return "Current balance";
}
function accountPlaceholder(type:AccountType){
  if(type==="credit_card")return "e.g. Primary credit card";
  if(type==="loan")return "e.g. Home loan";
  if(type==="investment")return "e.g. Investment account";
  if(type==="cash")return "e.g. Cash wallet";
  return "e.g. Salary account";
}

export default function Onboarding(){
  const router=useRouter();
  const[name,setName]=useState(()=>currentDisplayName()||currentUser());
  const[currency,setCurrency]=useState("INR");
  const[accounts,setAccounts]=useState<SetupAccount[]>([{id:"account-1",type:"bank",name:"",balance:""}]);
  const[paste,setPaste]=useState("");
  const[transactions,setTransactions]=useState<Transaction[]>([]);
  const[importStatus,setImportStatus]=useState("");
  const[budget,setBudget]=useState("");
  const[goals,setGoals]=useState<SetupGoal[]>([]);
  const[error,setError]=useState("");

  const live=useMemo(()=>{
    let assets=0,liabilities=0;
    for(const a of accounts){
      const amount=Math.max(0,Number(a.balance||0))*100;
      if(a.type==="credit_card"||a.type==="loan")liabilities+=amount;
      else assets+=amount;
    }
    return{
      accountCount:accounts.filter(a=>a.name.trim()).length,
      assets,liabilities,
      txCount:transactions.length,
      budget:Math.max(0,Number(budget||0))*100,
      goals:goals.filter(g=>g.name.trim()&&Number(g.target)>0).length
    };
  },[accounts,transactions,budget,goals]);

  function setupState():FinanceState{
    const state=structuredClone(demoState);
    state.transactions=transactions;
    state.recurring=[];
    state.holdings=[];
    state.budget=Number(budget)>0?{
      month:new Date().toISOString().slice(0,7),
      limitMinor:Math.round(Number(budget)*100),
      items:[],rollover:false
    }:undefined;
    state.accounts=accounts
      .filter(a=>a.name.trim())
      .map(a=>({
        id:a.id.startsWith("account-")?crypto.randomUUID():a.id,
        name:a.name.trim(),
        type:a.type,
        balanceMinor:Math.round(Math.max(0,Number(a.balance||0))*100),
        currency:"INR"
      }));
    const accountMap=new Map(accounts.filter(a=>a.name.trim()).map((a,i)=>[a.id,state.accounts[i]?.id]));
    state.transactions=transactions.map(t=>({...t,accountId:accountMap.get(t.accountId)||state.accounts[0]?.id||t.accountId}));
    state.goals=goals
      .filter(g=>g.name.trim()&&Number(g.target)>0)
      .map<GoalItem>(g=>({
        id:crypto.randomUUID(),name:g.name.trim(),
        targetMinor:Math.round(Number(g.target)*100),
        savedMinor:0,status:"active"
      }));
    return state;
  }

  function financeForImport():FinanceState{
    const state=structuredClone(demoState);
    state.transactions=[];
    state.accounts=accounts
      .filter(a=>a.name.trim())
      .map(a=>({id:a.id,name:a.name.trim(),type:a.type,balanceMinor:Math.round(Math.max(0,Number(a.balance||0))*100),currency:"INR" as const}));
    return state;
  }

  function previewText(text:string){
    setPaste(text);
    if(!text.trim()){setTransactions([]);setImportStatus("");return}
    const finance=financeForImport();
    if(!finance.accounts.length){setImportStatus("Add at least one named account before previewing transactions.");setTransactions([]);return}
    const normalized=normalizeRows(parseCsv(text),finance);
    const clean=removeDuplicates(normalized.transactions,[]);
    setTransactions(clean.unique);
    setImportStatus(
      clean.unique.length+" ready · "+
      clean.duplicates+" duplicates · "+
      normalized.errors.length+" invalid"
    );
  }

  async function previewFile(file:File){previewText(await file.text())}

  function addAccount(){
    setAccounts(a=>[...a,{id:crypto.randomUUID(),type:"bank",name:"",balance:""}]);
  }
  function updateAccount(id:string,patch:Partial<SetupAccount>){
    setAccounts(a=>a.map(x=>x.id===id?{...x,...patch}:x));
  }
  function removeAccount(id:string){
    setAccounts(a=>a.length===1?a:a.filter(x=>x.id!==id));
  }
  function addGoal(name=""){
    setGoals(g=>[...g,{id:crypto.randomUUID(),name,target:""}]);
  }
  function updateGoal(id:string,patch:Partial<SetupGoal>){
    setGoals(g=>g.map(x=>x.id===id?{...x,...patch}:x));
  }
  function removeGoal(id:string){setGoals(g=>g.filter(x=>x.id!==id))}

  function finish(){
    if(!name.trim()){setError("Enter your display name.");document.getElementById("setup-name")?.focus();return}
    if(!accounts.some(a=>a.name.trim())){setError("Add at least one account name, or use the demo without setup from the login screen.");document.getElementById("setup-accounts")?.scrollIntoView({behavior:"smooth"});return}
    saveState(setupState());
    saveProfile({name:name.trim(),ftueComplete:true});
    router.push("/overview");
  }

  const format=(minor:number)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(minor/100);

  return <main className="quickSetup">
    <header className="quickSetupTop">
      <div>
        <div className="quickBrand">Fintra</div>
        <span>Quick setup</span>
      </div>
      <p>Add only what you know now. Everything can be changed later.</p>
    </header>

    <div className="quickLayout">
      <section className="quickMain">
        <header className="quickHero">
          <span>PERSONAL FINANCE SETUP</span>
          <h1>Build your financial picture.</h1>
          <p>One screen. No questionnaire. Start with your basics, accounts, transactions and planning.</p>
        </header>

        <section className="quickSection" aria-labelledby="you-title">
          <div className="quickSectionHead">
            <div><span>01</span><div><h2 id="you-title">You</h2><p>Already known information is prefilled.</p></div></div>
            <Check size={18} aria-hidden="true"/>
          </div>
          <div className="quickFields two">
            <label><span>Display name</span><input id="setup-name" name="name" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label>
            <label><span>Base currency</span><select name="currency" value={currency} onChange={e=>setCurrency(e.target.value)}><option value="INR">INR — Indian Rupee</option></select></label>
          </div>
          <p className="quickHint">India-first demo: calculations currently use INR. No FX conversion is performed.</p>
        </section>

        <section className="quickSection" id="setup-accounts" aria-labelledby="accounts-title">
          <div className="quickSectionHead">
            <div><span>02</span><div><h2 id="accounts-title">Your money</h2><p>Add as many accounts as you want. Liability balances stay positive and are subtracted from net worth.</p></div></div>
            <button type="button" className="quickTextButton" onClick={addAccount}><Plus size={16}/> Add account</button>
          </div>

          <div className="quickAccounts">
            {accounts.map((a,index)=><div className="quickAccount" key={a.id}>
              <div className="quickAccountTop">
                <span>Account {index+1}</span>
                {accounts.length>1&&<button type="button" aria-label={"Remove account "+(index+1)} onClick={()=>removeAccount(a.id)}><Trash2 size={16}/></button>}
              </div>
              <div className="quickAccountTypes">
                {accountTypes.map(({value,label,Icon})=><button key={value} type="button" className={a.type===value?"active":""} aria-pressed={a.type===value} onClick={()=>updateAccount(a.id,{type:value})}><Icon size={16} aria-hidden="true"/><span>{label}</span></button>)}
              </div>
              <div className="quickFields two">
                <label><span>Account name</span><input name={"account-name-"+index} value={a.name} onChange={e=>updateAccount(a.id,{name:e.target.value})} placeholder={accountPlaceholder(a.type)}/></label>
                <label><span>{balanceLabel(a.type)}</span><div className="quickMoney"><span>₹</span><input name={"account-balance-"+index} inputMode="decimal" value={a.balance} onChange={e=>updateAccount(a.id,{balance:e.target.value})} placeholder="0"/></div></label>
              </div>
            </div>)}
          </div>
        </section>

        <section className="quickSection" aria-labelledby="transactions-title">
          <div className="quickSectionHead">
            <div><span>03</span><div><h2 id="transactions-title">Transactions</h2><p>Paste from a spreadsheet or upload a CSV. Preview before anything is saved.</p></div></div>
          </div>

          <div className="quickFormat">
            <div><b>Accepted format</b><span>Date · Description · Amount · Type · Account · Category</span></div>
            <code>2026-10-06,Blue Tokai,460,expense,HDFC Salary,Food & Drinks</code>
          </div>

          <label className="quickPaste">
            <span>Paste transactions</span>
            <textarea name="transactions" value={paste} onChange={e=>previewText(e.target.value)} placeholder={"date,description,amount,type,account,category\n2026-10-06,Blue Tokai,460,expense,HDFC Salary,Food & Drinks"}/>
          </label>
          <div className="quickImportBar">
            <label className="quickUpload"><Upload size={16} aria-hidden="true"/> Upload CSV<input type="file" accept=".csv,text/csv" hidden onChange={e=>{const file=e.target.files?.[0];if(file)previewFile(file)}}/></label>
            <span>{importStatus||"You can skip transactions and add them later."}</span>
          </div>

          {transactions.length>0&&<div className="quickPreview">
            <div className="quickPreviewHead"><b>Preview</b><span>{transactions.length} transactions ready</span></div>
            <div className="quickPreviewTable">
              {transactions.slice(0,5).map(t=><div key={t.id}><span>{t.date}</span><b>{t.description}</b><span>{t.type}</span><strong>{format(t.amountMinor)}</strong></div>)}
            </div>
            {transactions.length>5&&<small>+ {transactions.length-5} more rows</small>}
          </div>}
        </section>

        <section className="quickSection" aria-labelledby="planning-title">
          <div className="quickSectionHead">
            <div><span>04</span><div><h2 id="planning-title">Planning</h2><p>Budget and goals are independent. Add either, both, or neither.</p></div></div>
          </div>

          <div className="quickPlanning">
            <div className="quickBudget">
              <div className="quickMiniHead"><WalletCards size={18} aria-hidden="true"/><div><b>Monthly budget</b><span>Optional spending limit</span></div></div>
              <label><span>Monthly limit</span><div className="quickMoney"><span>₹</span><input name="budget" inputMode="decimal" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="e.g. 100000"/></div></label>
            </div>

            <div className="quickGoals">
              <div className="quickMiniHead"><Target size={18} aria-hidden="true"/><div><b>Savings goals</b><span>Add as many as you need</span></div><button type="button" className="quickTextButton" onClick={()=>addGoal()}><Plus size={15}/> Add goal</button></div>
              {goals.length===0&&<div className="quickSuggestions"><span>Suggestions</span>{goalSuggestions.map(x=><button type="button" key={x} onClick={()=>addGoal(x)}>{x}</button>)}</div>}
              {goals.map((g,index)=><div className="quickGoalRow" key={g.id}>
                <input aria-label={"Goal "+(index+1)+" name"} value={g.name} onChange={e=>updateGoal(g.id,{name:e.target.value})} placeholder="Goal name"/>
                <div className="quickMoney"><span>₹</span><input aria-label={"Goal "+(index+1)+" target"} inputMode="decimal" value={g.target} onChange={e=>updateGoal(g.id,{target:e.target.value})} placeholder="Target"/></div>
                <button type="button" aria-label={"Remove goal "+(index+1)} onClick={()=>removeGoal(g.id)}><Trash2 size={16}/></button>
              </div>)}
            </div>
          </div>
        </section>

        {error&&<div className="quickError" role="alert">{error}</div>}

        <div className="quickMobileSummary">
          <b>Your Fintra</b>
          <span>{live.accountCount} accounts · {transactions.length} transactions · {live.goals} goals</span>
        </div>

        <div className="quickFinishMobile">
          <button type="button" onClick={finish}>Create my workspace <ArrowRight size={17}/></button>
        </div>
      </section>

      <aside className="quickSummary" aria-label="Setup summary">
        <div className="quickSummaryCard">
          <span>LIVE SUMMARY</span>
          <h2>Your Fintra</h2>
          <dl>
            <div><dt>Accounts</dt><dd>{live.accountCount}</dd></div>
            <div><dt>Assets</dt><dd>{format(live.assets)}</dd></div>
            <div><dt>Liabilities</dt><dd>{format(live.liabilities)}</dd></div>
            <div><dt>Transactions ready</dt><dd>{live.txCount}</dd></div>
            <div><dt>Monthly budget</dt><dd>{live.budget?format(live.budget):"Not set"}</dd></div>
            <div><dt>Goals</dt><dd>{live.goals}</dd></div>
          </dl>
          <div className="quickNet">
            <span>Starting net position</span>
            <strong>{format(live.assets-live.liabilities)}</strong>
          </div>
          <button type="button" className="quickFinish" onClick={finish}>Create my workspace <ArrowRight size={17}/></button>
          <small>Stored only in this browser for the demo.</small>
        </div>
      </aside>
    </div>
  </main>
}
