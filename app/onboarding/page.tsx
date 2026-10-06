"use client";
import{useState}from"react";
import{useRouter}from"next/navigation";
import{ArrowRight,Banknote,Building2,CircleHelp,CreditCard,FileUp,Landmark,PiggyBank,Target,WalletCards}from"lucide-react";
import{demoState}from"@/lib/demo-data";
import{saveState,saveProfile,currentUser,currentDisplayName}from"@/lib/storage/store";
import{parseCsv,normalizeRows,removeDuplicates}from"@/lib/import/csv";
import type{AccountType,Transaction}from"@/types/finance";

const steps=["Welcome","Preferences","Account","Data","Planning","Ready"] as const;
function Tip({text}:{text:string}){return <span className="ftueTip" tabIndex={0} aria-label={text}><CircleHelp size={15}/><span>{text}</span></span>}
const accountTypes=[{value:"bank" as AccountType,label:"Bank",Icon:Building2},{value:"cash" as AccountType,label:"Cash",Icon:Banknote},{value:"credit_card" as AccountType,label:"Credit card",Icon:CreditCard},{value:"investment" as AccountType,label:"Investment",Icon:Landmark},{value:"loan" as AccountType,label:"Loan",Icon:WalletCards}];
function StepHeader({step,kicker,title,body}:{step:number;kicker:string;title:string;body:string}){return <header className="ftueHeader"><div className="ftueKicker">STEP {step+1} OF 6 · {kicker}</div><h1>{title}</h1><p>{body}</p></header>}

export default function Onboarding(){
 const r=useRouter();
 const[step,setStep]=useState(0);
 const[name,setName]=useState(()=>currentDisplayName()||currentUser());
 const[currency,setCurrency]=useState("INR");
 const[accountType,setAccountType]=useState<AccountType>("bank");
 const[account,setAccount]=useState("");
 const[balance,setBalance]=useState("");
 const[choice,setChoice]=useState<"empty"|"manual"|"csv">("empty");
 const[tx,setTx]=useState<Transaction[]>([]);
 const[manualDesc,setManualDesc]=useState("");
 const[manualAmt,setManualAmt]=useState("");
 const[planning,setPlanning]=useState<"later"|"budget"|"goal">("later");
 const[budget,setBudget]=useState("");
 const[goalName,setGoalName]=useState("");
 const[goalTarget,setGoalTarget]=useState("");

 function base(){
  const s=structuredClone(demoState);
  s.transactions=[];
  s.goals=[];
  s.recurring=[];
  s.holdings=[];
  s.budget=undefined;
  if(account.trim()){
   s.accounts=[{...s.accounts[0],name:account.trim(),type:accountType,balanceMinor:Math.round(Number(balance||0)*100),currency:"INR"}];
  }else s.accounts=[];
  s.transactions=tx;
  if(planning==="budget"&&Number(budget)>0){
   s.budget={month:new Date().toISOString().slice(0,7),limitMinor:Math.round(Number(budget)*100),items:[],rollover:false};
  }
  if(planning==="goal"&&goalName.trim()&&Number(goalTarget)>0){
   s.goals=[{id:crypto.randomUUID(),name:goalName.trim(),targetMinor:Math.round(Number(goalTarget)*100),savedMinor:0,status:"active"}];
  }
  return s;
 }
 async function csv(file:File){
  const s=base(),n=normalizeRows(parseCsv(await file.text()),s.accounts.length?s:structuredClone(demoState)),d=removeDuplicates(n.transactions,[]);
  setTx(d.unique);
 }
 function finish(){
  saveState(base());
  saveProfile({name:name.trim()||currentDisplayName()||currentUser(),ftueComplete:true});
  r.push("/overview");
 }
 function next(){setStep(x=>Math.min(5,x+1))}
 function back(){setStep(x=>Math.max(0,x-1))}

 return <main className="ftueShell">
  <aside className="ftueRail">
   <div className="ftueBrand">Fintra</div>
   <div className="ftueRailCopy">A calmer way to understand your money.</div>
   <ol className="ftueProgress">{steps.map((label,i)=><li key={label} className={i===step?"current":i<step?"done":""}><span>{i<step?"✓":i+1}</span><div><b>{label}</b><small>{["Start here","Your basics","First account","Transactions","Optional setup","Review"][i]}</small></div></li>)}</ol>
   <div className="ftueRailFoot">Local demo workspace · No bank connection required</div>
  </aside>

  <section className="ftueStage">
   <div className="ftueMobileTop"><div className="ftueBrand">Fintra</div><div className="ftueMobileProgress"><span style={{width:((step+1)/6*100)+"%"}}/></div><small>{step+1} / 6</small></div>
   <div className="ftueCanvas">

   {step===0&&<>
    <StepHeader step={step} kicker="Welcome" title="Start with the essentials." body="Fintra only asks for what it needs to build a useful financial picture. Everything else can wait."/>
    <div className="ftueIntroList">
     <div><span>01</span><div><b>Know where you stand</b><p>Accounts, cash, investments and liabilities in one view.</p></div></div>
     <div><span>02</span><div><b>See where money goes</b><p>Transactions, categories and budgets without spreadsheet maintenance.</p></div></div>
     <div><span>03</span><div><b>Plan without pressure</b><p>Goals and recurring commitments stay optional until they are useful.</p></div></div>
    </div>
   </>}

   {step===1&&<>
    <StepHeader step={step} kicker="Preferences" title="Make Fintra yours." body="These settings shape how your workspace is labelled and how money is displayed."/>
    <div className="ftueForm">
     <label><span>Display name <Tip text="Used to personalise this local demo workspace."/></span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" autoComplete="name"/></label>
     <label><span>Base currency <Tip text="Used for account balances, budgets and reports. The current demo is India-first."/></span><select value={currency} onChange={e=>setCurrency(e.target.value)}><option value="INR">INR — Indian Rupee</option></select></label>
    </div>
    <div className="ftueNote">The demo currently calculates in INR. Multi-currency conversion will be introduced with the production data layer.</div>
   </>}

   {step===2&&<>
    <StepHeader step={step} kicker="Account" title="Add one account to begin." body="Choose the account type, give it a familiar name and enter today’s balance."/>
    <div className="ftueAccountTypes">
     {accountTypes.map(({value,label,Icon})=><button key={value} type="button" className={accountType===value?"active":""} onClick={()=>setAccountType(value)}><Icon size={18}/><span>{label}</span></button>)}
    </div>
    <div className="ftueForm two">
     <label><span>Account name <Tip text="Use a label you will recognise later, such as HDFC Salary or Cash Wallet."/></span><input value={account} onChange={e=>setAccount(e.target.value)} placeholder="e.g. HDFC Salary"/></label>
     <label><span>Current balance <Tip text="Enter the amount available today. This becomes Fintra’s starting balance."/></span><div className="moneyInput"><span>₹</span><input inputMode="decimal" value={balance} onChange={e=>setBalance(e.target.value)} placeholder="0"/></div></label>
    </div>
    <div className="ftueNote">You can add more accounts later. One is enough to finish setup.</div>
   </>}

   {step===3&&<>
    <StepHeader step={step} kicker="Data" title="How should we start your ledger?" body="Choose one path. Nothing here locks you into a workflow."/>
    <div className="ftueChoiceList">
     <button type="button" className={choice==="manual"?"selected":""} onClick={()=>setChoice("manual")}><div className="choiceIcon"><PiggyBank size={20}/></div><div><b>Add one transaction</b><span>Enter a single income or expense now.</span></div><span className="choiceRadio"/></button>
     <label className={choice==="csv"?"selected":""}><div className="choiceIcon"><FileUp size={20}/></div><div><b>Import a CSV</b><span>Bring in an existing transaction history.</span></div><span className="choiceRadio"/><input hidden type="file" accept=".csv,text/csv" onChange={e=>{setChoice("csv");const f=e.target.files?.[0];if(f)csv(f)}}/></label>
     <button type="button" className={choice==="empty"?"selected":""} onClick={()=>{setChoice("empty");setTx([])}}><div className="choiceIcon"><ArrowRight size={20}/></div><div><b>Start empty</b><span>Explore first and add financial activity later.</span></div><span className="choiceRadio"/></button>
    </div>
    {choice==="manual"&&<div className="ftueInlinePanel"><div className="ftueForm two"><label><span>Description</span><input value={manualDesc} onChange={e=>setManualDesc(e.target.value)} placeholder="e.g. Salary"/></label><label><span>Amount</span><div className="moneyInput"><span>₹</span><input inputMode="decimal" value={manualAmt} onChange={e=>setManualAmt(e.target.value)} placeholder="0"/></div></label></div><button className="ftueSecondary" type="button" onClick={()=>{const a=Number(manualAmt);const aid=base().accounts[0]?.id;if(!manualDesc||!a||!aid)return;setTx([{id:crypto.randomUUID(),accountId:aid,type:a>=0?"income":"expense",amountMinor:Math.abs(Math.round(a*100)),date:new Date().toISOString().slice(0,10),description:manualDesc}])}}>{tx.length?"Transaction saved":"Save first transaction"}</button></div>}
    {choice==="csv"&&<div className="ftueNote">{tx.length?tx.length+" transactions are ready to import.":"Choose a CSV file to preview your transactions."} <Tip text="Supported columns: date, description, amount, type, account and category."/></div>}
   </>}

   {step===4&&<>
    <StepHeader step={step} kicker="Planning" title="Plan only what is useful today." body="You can set up one planning tool now, or skip this completely."/>
    <div className="ftueChoiceList">
     <button type="button" className={planning==="budget"?"selected":""} onClick={()=>setPlanning("budget")}><div className="choiceIcon"><WalletCards size={20}/></div><div><b>Set a monthly budget</b><span>Define one total spending limit for this month.</span></div><span className="choiceRadio"/></button>
     <button type="button" className={planning==="goal"?"selected":""} onClick={()=>setPlanning("goal")}><div className="choiceIcon"><Target size={20}/></div><div><b>Add a savings goal</b><span>Start tracking one target that matters.</span></div><span className="choiceRadio"/></button>
     <button type="button" className={planning==="later"?"selected":""} onClick={()=>setPlanning("later")}><div className="choiceIcon"><ArrowRight size={20}/></div><div><b>Do this later</b><span>Budgets and goals remain available from the main app.</span></div><span className="choiceRadio"/></button>
    </div>
    {planning==="budget"&&<div className="ftueInlinePanel"><div className="ftueForm"><label><span>Monthly spending limit</span><div className="moneyInput"><span>₹</span><input inputMode="decimal" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="e.g. 100000"/></div></label></div></div>}
    {planning==="goal"&&<div className="ftueInlinePanel"><div className="ftueForm two"><label><span>Goal name</span><input value={goalName} onChange={e=>setGoalName(e.target.value)} placeholder="e.g. Emergency fund"/></label><label><span>Target amount</span><div className="moneyInput"><span>₹</span><input inputMode="decimal" value={goalTarget} onChange={e=>setGoalTarget(e.target.value)} placeholder="0"/></div></label></div></div>}
   </>}

   {step===5&&<>
    <StepHeader step={step} kicker="Ready" title="Your workspace is ready." body="Review the essentials below. You can change every setting later."/>
    <div className="ftueSummary">
     <div><span>Name</span><b>{name.trim()||currentDisplayName()||"—"}</b></div>
     <div><span>Currency</span><b>{currency}</b></div>
     <div><span>First account</span><b>{account.trim()||"Not added"}</b></div>
     <div><span>Starting data</span><b>{choice==="csv"?(tx.length?tx.length+" imported transactions":"CSV selected"):choice==="manual"?(tx.length?"1 transaction":"Manual entry selected"):"Starting empty"}</b></div>
     <div><span>Planning</span><b>{planning==="budget"?"Monthly budget":planning==="goal"?"Savings goal":"Later"}</b></div>
    </div>
    <div className="ftueReadyNote">Fintra will open to your Overview. Your data stays in this browser for the demo.</div>
   </>}

   <footer className="ftueActionsV2">
    <div>{step>0&&<button type="button" className="ftueBack" onClick={back}>Back</button>}</div>
    <div className="ftueActionRight">{step>=2&&step<5&&<button type="button" className="ftueSkip" onClick={next}>Skip for now</button>}{step<5?<button type="button" className="ftuePrimary" onClick={next}>Continue <ArrowRight size={17}/></button>:<button type="button" className="ftuePrimary" onClick={finish}>Open Fintra <ArrowRight size={17}/></button>}</div>
   </footer>
   </div>
  </section>
 </main>
}