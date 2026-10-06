import{test,expect}from"@playwright/test";

async function enter(page:any,name:string){
  await page.goto("/login");
  await page.getByPlaceholder("Enter your name").fill(name);
  await page.getByRole("button",{name:"Use demo code"}).click();
  await page.getByRole("button",{name:"Enter Fintra"}).click();
  await page.waitForURL(/\/(onboarding|overview)/);
}
async function completeSetup(page:any,accountName:string){
  if(page.url().includes("onboarding")){
    await page.getByPlaceholder("e.g. Salary account").fill(accountName);
    await page.getByRole("button",{name:"Create my workspace"}).click();
    await expect(page).toHaveURL(/overview/);
  }
}

test("two local users stay isolated",async({page})=>{
  await enter(page,"Isolation A");
  await completeSetup(page,"A Bank");
  await page.goto("/transactions");
  await page.getByRole("button",{name:/Add transaction/}).click();
  await page.getByLabel("Description").fill("Only A");
  await page.getByLabel("Amount").fill("100");
  await page.getByRole("button",{name:"Add transaction"}).click();
  await page.goto("/login");
  await enter(page,"Isolation B");
  await completeSetup(page,"B Bank");
  await page.goto("/transactions");
  await expect(page.getByText("Only A")).toHaveCount(0);
});

test("primary routes load",async({page})=>{
  await enter(page,"Route QA");
  await completeSetup(page,"Route Bank");
  for(const route of["overview","transactions","budget","accounts","goals","investments","reports","settings"]){
    await page.goto("/"+route);
    await expect(page.locator("h1")).toBeVisible();
  }
});
