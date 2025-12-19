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

test('Editor kann Details anpassen und veröffentlichen', async ({ page }) => {
  const tutorial = {
    id: 1,
    title: 'Beispielstadt',
    description: 'Beschreibung',
    einwohner: 500000,
    published: false,
  };

  let lastUpdatePayload: any;
  let lastPublishPayload: any;

  await page.route('**/api/tutorials/1', async (route) => {
    const { method } = route.request();

    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(tutorial),
      });
      return;
    }

    if (method === 'PUT') {
      const payload = route.request().postDataJSON();
      const isPublishAction = typeof payload?.published === 'boolean';

      if (isPublishAction) {
        lastPublishPayload = payload;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ...tutorial, ...payload, message: 'The status was updated successfully!' }),
        });
        return;
      }

      lastUpdatePayload = payload;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...tutorial, ...payload, message: 'This tutorial was updated successfully!' }),
      });
      return;
    }

    await route.continue();
  });

  await page.goto('/tutorials/1');

  await expect(page.getByLabel('Name')).toHaveValue('Beispielstadt');
  await expect(page.getByLabel('Description')).toHaveValue('Beschreibung');
  await expect(page.getByLabel('Einwohner')).toHaveValue('500000');

  await page.getByLabel('Name').fill('Aktualisierte Stadt');
  await page.getByLabel('Description').fill('Neue Beschreibung');
  await page.getByLabel('Einwohner').fill('750000');

  const updateButton = page.getByRole('button', { name: /^update$/i });
  await expect(updateButton).toBeEnabled();
  await updateButton.click();

  await expect.poll(() => lastUpdatePayload).toMatchObject({
    title: 'Aktualisierte Stadt',
    description: 'Neue Beschreibung',
    einwohner: 750000,
  });
  await expect(page.getByText(/updated successfully/i)).toBeVisible();

  const publishButton = page.getByRole('button', { name: /publish/i });
  await expect(publishButton).toBeEnabled();
  await publishButton.click();

  await expect.poll(() => lastPublishPayload?.published).toBe(true);
  await expect(page.getByRole('button', { name: /unpublish/i })).toBeEnabled();
  await expect(page.getByText(/status was updated successfully/i)).toBeVisible();
});
