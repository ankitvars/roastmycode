import { test, expect } from '@playwright/test';

test.describe('Review flow smoke test', () => {
  test('landing page renders CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /brutally roasted/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /roast my code/i })).toBeVisible();
  });

  test('review page shows form with tabs', async ({ page }) => {
    await page.goto('/review');
    await expect(page.getByText(/paste code/i)).toBeVisible();
    await expect(page.getByText(/github pr/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /roast my code/i })).toBeDisabled();
  });

  test('roast button enables after pasting code', async ({ page }) => {
    await page.goto('/review');
    await page.getByPlaceholder(/paste your code/i).fill(
      'function add(a, b) { return a + b; }'
    );
    await expect(page.getByRole('button', { name: /roast my code/i })).toBeEnabled();
  });

  test('switching to PR tab shows URL input', async ({ page }) => {
    await page.goto('/review');
    await page.getByText(/github pr/i).click();
    await expect(page.getByPlaceholder(/github.com\/owner\/repo\/pull/i)).toBeVisible();
  });
});
