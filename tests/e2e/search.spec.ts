import { expect, test } from '@fixtures/test';

test.describe('Search', () => {
  test('@ESC-BUSQUEDA-001 search by keyword shows only matching products', async ({ homePage }) => {
    await homePage.goto();
    await homePage.header.search('pliers');

    await expect(homePage.header.searchCaption).toHaveText('Searched for: pliers');
    await expect(homePage.productNames.first()).toBeVisible();
    await expect(homePage.productsNotMatching(/pliers/i)).toHaveCount(0);
  });
});
