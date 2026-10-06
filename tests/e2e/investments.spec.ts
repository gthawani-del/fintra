import{test,expect}from"@playwright/test";

async function enter(page:any,name:string){
  await page.goto("/login");
  await page.getByPlaceholder("Enter your name").fill(name);
  await page.getByRole("button",{name:"Use demo code"}).click();
  await page.getByRole("button",{name:"Enter Fintra"}).click();
  await page.waitForURL(/\/(onboarding|overview)/);
  if(page.url().includes("onboarding")){
    await page.getByPlaceholder("e.g. Salary account").fill("Investment QA Bank");
    await page.getByRole("button",{name:"Create my workspace"}).click();
    await expect(page).toHaveURL(/overview/);
  }
}

test("investment holding and target workflow",async({page})=>{
  await enter(page,"Investment QA");
  await page.goto("/investments");
  await page.getByRole("button",{name:"Add holding"}).first().click();
  await expect(page.getByRole("heading",{name:"Add investment"})).toBeVisible();
  await page.getByLabel("Holding name").fill("Nifty QA Fund");
  await page.getByLabel("Amount invested").fill("400000");
  await page.getByLabel("Current value").fill("500000");
  await page.getByRole("button",{name:"Add holding"}).last().click();
  await expect(page.getByRole("table").getByText("Nifty QA Fund",{exact:true})).toBeVisible();

  await page.getByRole("button",{name:"Set portfolio target"}).click();
  await page.getByLabel("Target portfolio value").fill("1000000");
  await page.getByLabel(/Monthly contribution/).fill("25000");
  await page.getByRole("button",{name:"Save target"}).click();
  await expect(page.getByRole("button",{name:"Edit target"})).toBeVisible();
  const snapshot=await page.evaluate(()=>{
    const user=localStorage.getItem("fintra-current-user")||"";
    const key="fintra:user:"+encodeURIComponent(user)+":state";
    return JSON.parse(localStorage.getItem(key)||"null");
  });
  expect(snapshot.holdings[0].valueMinor).toBe(50000000);
  expect(snapshot.investmentPlan.targetMinor).toBe(100000000);
  const ring=page.locator(".portfolioTargetRing");
  await expect(ring).toBeVisible();
});
