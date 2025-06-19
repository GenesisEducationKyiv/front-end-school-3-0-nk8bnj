import { test, expect } from '@playwright/test';

test.describe('Track Manager', () => {
  test('should load homepage and display main elements', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('tracks-header')).toBeVisible();
    await expect(page.getByTestId('tracks-header')).toContainText('Track Manager');

    await expect(page.getByTestId('create-track-button').first()).toBeVisible();

    await expect(page.getByTestId('search-input')).toBeVisible();

    await expect(page.getByTestId('sort-select')).toBeVisible();

    await expect(page.getByTestId('filter-genre')).toBeVisible();
  });

  test('should open create track modal when button is clicked', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('create-track-button').first().click();

    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('should allow searching in the search input', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByTestId('search-input');

    await searchInput.fill('test search');

    await expect(searchInput).toHaveValue('test search');

    await searchInput.clear();
    await expect(searchInput).toHaveValue('');
  });

  test('should change sort options', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('sort-select').click();

    await page.getByRole('option', { name: 'Title (Z-A)' }).click();

    await expect(page).toHaveURL(/sort=title-desc/);
  });

  test('should change genre filter', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('filter-genre').click();

    const options = page.getByRole('option');
    const optionCount = await options.count();

    if (optionCount > 1) {
      await options.nth(1).click();

      expect(page.url()).toContain('genre=');
    }
  });
}); 
