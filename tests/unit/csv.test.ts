import{describe,it,expect}from"vitest";import{parseCsv,duplicateKey,removeDuplicates}from"../../lib/import/csv";
describe("csv portability",()=>{
  it("parses comma separated rows",()=>expect(parseCsv("date,description,amount\n2026-10-01,Cafe,500")[0].description).toBe("Cafe"));
  it("parses pasted tab separated rows",()=>expect(parseCsv("date\tdescription\tamount\n2026-10-01\tCafe\t500")[0].amount).toBe("500"));
  it("handles quoted commas",()=>expect(parseCsv('date,description,amount\n2026-10-01,"Cafe, Bandra",500')[0].description).toBe("Cafe, Bandra"));
  it("creates stable duplicate fingerprints",()=>expect(duplicateKey({id:"1",date:"2026-01-01",description:"Test",amountMinor:100,type:"expense",accountId:"a"})).toBe("2026-01-01|test|100|expense|a"));
  it("deduplicates incoming rows",()=>{const t={id:"1",date:"2026-01-01",description:"Test",amountMinor:100,type:"expense" as const,accountId:"a"};expect(removeDuplicates([t,{...t,id:"2"}],[])).toMatchObject({duplicates:1,unique:[t]})});
})