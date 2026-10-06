import{test,expect}from"@playwright/test";

async function enterAndSetup(page:any,name:string){
  await page.goto("/login");
  await page.getByPlaceholder("Enter your name").fill(name);
  await page.getByRole("button",{name:"Use demo code"}).click();
  await page.getByRole("button",{name:"Enter Fintra"}).click();
  if(page.url().includes("/onboarding")){
    await page.getByPlaceholder("e.g. Salary account").fill("Mobile Bank");
    await page.getByRole("button",{name:"Create my workspace"}).click();
    await expect(page).toHaveURL(/overview/);
  }
}
async function expectNoPageOverflow(page:any,route:string){
  await page.goto(route);
  await page.waitForLoadState("networkidle");
  const dims=await page.evaluate(()=>({
    viewport:window.innerWidth,
    html:document.documentElement.scrollWidth,
    body:document.body.scrollWidth
  }));
  expect(dims.html,route+" html overflow").toBeLessThanOrEqual(dims.viewport+1);
  expect(dims.body,route+" body overflow").toBeLessThanOrEqual(dims.viewport+1);
}

test("mobile app has no page-level horizontal overflow",async({page},testInfo)=>{
  test.skip(testInfo.project.name!=="mobile","mobile-only responsive assertion");
  await enterAndSetup(page,"Mobile QA");
  await expect(page.locator(".mobileTopbar")).toBeVisible();
  await expect(page.locator(".mobilebar")).toBeVisible();
  for(const route of["/overview","/transactions","/budget","/accounts","/goals","/investments","/reports","/settings"]){
    await expectNoPageOverflow(page,route);
  }
});

test("mobile Quick Setup fits viewport",async({page},testInfo)=>{
  test.skip(testInfo.project.name!=="mobile","mobile-only responsive assertion");
  await page.goto("/login");
  await page.getByPlaceholder("Enter your name").fill("Setup Mobile QA");
  await page.getByRole("button",{name:"Use demo code"}).click();
  await page.getByRole("button",{name:"Enter Fintra"}).click();
  await expect(page).toHaveURL(/onboarding/);
  const dims=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
  expect(dims.scroll).toBeLessThanOrEqual(dims.viewport+1);
  await expect(page.getByRole("button",{name:"Create my workspace"})).toBeVisible();
});
