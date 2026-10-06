import type{FinanceState,Transaction,TxType}from"@/types/finance";

function splitLine(line:string,delimiter:string){
  const out:string[]=[];let cur="";let quoted=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==='"'){
      if(quoted&&line[i+1]==='"'){cur+='"';i++}else quoted=!quoted;
    }else if(ch===delimiter&&!quoted){out.push(cur);cur=""}
    else cur+=ch;
  }
  out.push(cur);
  return out;
}

export function parseCsv(text:string){
  const lines=text.replace(/\r/g,"").split("\n").filter(x=>x.trim().length>0);
  if(!lines.length)return[];
  const delimiter=lines[0].includes("\t")?"\t":",";
  const headers=splitLine(lines.shift()||"",delimiter).map(x=>x.trim().toLowerCase());
  return lines.map(line=>Object.fromEntries(splitLine(line,delimiter).map((v,i)=>[headers[i],v.trim()])));
}

export function normalizeRows(rows:any[],s:FinanceState){
  const errors:string[]=[],transactions:Transaction[]=[];
  rows.forEach((r,i)=>{
    const raw=String(r.amount??"").replace(/[₹,$£€\s]/g,"").replace(/,/g,"");
    const numeric=Number(raw);
    const type=((r.type||"").toLowerCase()|| (numeric<0?"expense":"income")) as TxType;
    const account=s.accounts.find(a=>a.name.toLowerCase()===(r.account||"").toLowerCase())||s.accounts[0];
    const category=s.categories.find(x=>x.name.toLowerCase()===(r.category||"").toLowerCase());
    if(!r.date||!r.description||!Number.isFinite(numeric)||numeric===0||!account||!["income","expense","transfer"].includes(type)){
      errors.push("Invalid row "+(i+2));return;
    }
    transactions.push({
      id:crypto.randomUUID(),
      date:r.date,
      description:r.description,
      amountMinor:Math.abs(Math.round(numeric*100)),
      type,
      accountId:account.id,
      categoryId:category?.id
    });
  });
  return{transactions,errors};
}

export function duplicateKey(t:Transaction){
  return[t.date,t.description.toLowerCase().trim(),t.amountMinor,t.type,t.accountId].join("|");
}

export function removeDuplicates(incoming:Transaction[],existing:Transaction[]){
  const keys=new Set(existing.map(duplicateKey));
  const unique:Transaction[]=[];let duplicates=0;
  for(const t of incoming){
    const key=duplicateKey(t);
    if(keys.has(key)){duplicates++;continue}
    keys.add(key);unique.push(t);
  }
  return{unique,duplicates};
}
