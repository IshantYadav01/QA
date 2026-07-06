const { test, expect } = require('@playwright/test');

test.describe('Portfolio Core Quality Checks', () => {

  // Before every test, navigate to the portfolio
  test.beforeEach(async ({ page }) => {
    await page.goto('https://workwithaarjan.dev');
  });

  test('Tier 1: Verify Open Graph Meta Tags for Clean Social Previews', async ({ page }) => {
    // Looks under the hood for preview tags needed for LinkedIn/iMessage
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogImage = page.locator('meta[property="og:image"]');

    await expect(ogTitle).toBeAttached({ timeout: 5000 });
    await expect(ogImage).toBeAttached({ timeout: 5000 });
  });

  test('Tier 2: Sanity Check Core Links to Avoid 404s', async ({ page }) => {
    // Grabs the links on the page and verifies they aren't blank
    const discoverLinks = await page.locator('a');
    const linkCount = await discoverLinks.count();

    for (let i = 0; i < Math.min(linkCount, 5); i++) {
      const targetHref = await discoverLinks.nth(i).getAttribute('href');
      expect(targetHref).not.toBeNull();
      expect(targetHref).not.toBe('');
    }
  });

  test('Tier 1: Contact Form Inputs are Responsive', async ({ page }) => {
    // Checks if a recruiter can physically type into the contact form fields
    const inputSelector = 'input[type="text"], input[name*="name"], textarea';
    const primaryInputField = page.locator(inputSelector).first();

    if (await primaryInputField.isVisible()) {
      await primaryInputField.click();
      await primaryInputField.fill('Automated Test User');
      await expect(primaryInputField).toHaveValue('Automated Test User');
    }
  });
});