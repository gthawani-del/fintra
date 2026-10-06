import{test,expect}from"@playwright/test";

test("new demo user completes Quick Setup",async({page})=>{
  await page.goto("/login");
  await page.getByPlaceholder("Enter your name").fill("QA User");
  await page.getByRole("button",{name:"Use demo code"}).click();
  await page.getByRole("button",{name:"Enter Fintra"}).click();
  await expect(page).toHaveURL(/onboarding/);
  await expect(page.getByRole("heading",{name:"Build your financial picture."})).toBeVisible();
  await page.getByPlaceholder("e.g. Salary account").fill("QA Bank");
  await page.getByRole("button",{name:"Create my workspace"}).click();
  await expect(page).toHaveURL(/overview/);
  await expect(page.getByRole("heading",{name:"Good morning, QA User"})).toBeVisible();
});

test("bad access code stays on login",async({page})=>{
  await page.goto("/login");
  await page.getByPlaceholder("Enter your name").fill("QA User 2");
  await page.getByPlaceholder("Enter demo access code").fill("wrong");
  await page.getByRole("button",{name:"Enter Fintra"}).click();
  await expect(page.getByText("That code does not match.")).toBeVisible();
});
