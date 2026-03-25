import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context }) => {
    await context.clearCookies();
});

test('should login successfully', async ({ page }) => {
    await page.goto('/auth/login');

    // Wait for the form to appear
    const loginForm = page.getByTestId('login-form');
    await expect(loginForm).toBeVisible({ timeout: 15000 });

    await page.locator('input[name="email"]').fill('admin@example.com');
    await page.locator('input[name="password"]').fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();

    // Redirection check
    await expect(page).toHaveURL(/\/app/);

    // Target the specific "Dashboard" heading to satisfy strict mode
    await expect(
        page.getByRole('heading', { level: 1, name: 'Dashboard' }),
    ).toBeVisible();
});
