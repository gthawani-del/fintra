export function formatINR(minor:number){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(minor/100)}
export function savingsRate(incomeMinor:number,expenseMinor:number){if(incomeMinor<=0)return 0;return Math.round(((incomeMinor-expenseMinor)/incomeMinor)*100)}
export function netWorth(assetMinor:number[],liabilityMinor:number[]){return assetMinor.reduce((a,b)=>a+b,0)-liabilityMinor.reduce((a,b)=>a+b,0)}
