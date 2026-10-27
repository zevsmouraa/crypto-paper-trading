import { test, expect, Page } from "@playwright/test";

async function register(page: Page) {
  const email = `trader-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
  await page.goto("/");
  await page.getByRole("button", { name: /create an account/i }).click();
  await page.getByLabel("Name").fill("Test Trader");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("test-password");
  await page.getByRole("button", { name: /create free account/i }).click();
  await expect(page.getByText("Top markets")).toBeVisible();
}

test("new user can sign up and see markets", async ({ page }) => {
  await register(page);
  await expect(page.getByRole("heading", { name: /good to see you back/i })).toBeVisible();
});

test("user can open buy and sell market-order controls", async ({ page }) => {
  await register(page);
  await page.getByRole("button", { name: "Trade" }).first().click();
  await page.getByLabel("Quantity").fill("0.001");
  await expect(page.getByRole("button", { name: /buy/i }).last()).toBeVisible();
  await page.getByRole("button", { name: "Sell" }).click();
  await page.getByLabel("Quantity").fill("0.001");
  await expect(page.getByRole("button", { name: /sell/i }).last()).toBeVisible();
});

test("leaderboard tab renders", async ({ page }) => {
  await register(page);
  await page.getByRole("button", { name: "Leaderboard" }).click();
  await expect(page.getByRole("heading", { name: /monthly leaderboard/i })).toBeVisible();
});
