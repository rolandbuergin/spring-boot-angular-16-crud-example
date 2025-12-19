import { expect, test } from '@playwright/test';

const storedCredentials = {
  username: 'editor',
  token: 'ZWRpdG9yOnNlY3JldA==',
};

test.beforeEach(async ({ context }) => {
  await context.addInitScript((credentials) => {
    localStorage.setItem('editor-auth', JSON.stringify(credentials));
  }, storedCredentials);
});

test('Editor kann eine neue Stadt speichern', async ({ page }) => {
  let capturedPayload: any;

  await page.route('**/api/tutorials', async (route) => {
    const { method } = route.request();

    if (method === 'POST') {
      capturedPayload = route.request().postDataJSON();
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 101, ...capturedPayload }),
      });
      return;
    }

    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
      return;
    }

    await route.continue();
  });

  await page.goto('/add');

  const saveButton = page.getByRole('button', { name: /speichern/i });
  await expect(saveButton).toBeDisabled();

  await page.getByLabel('Name').fill(' Berlin ');
  await page.getByLabel('Description').fill(' Hauptstadt ');
  await page.getByLabel('Einwohner').fill('3645000');

  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  await expect.poll(() => capturedPayload).toMatchObject({
    title: 'Berlin',
    description: 'Hauptstadt',
    einwohner: 3645000,
  });

  await expect(page.getByRole('heading', { name: /erfolgreich gespeichert/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /weitere stadt hinzufügen/i })).toBeVisible();
});
