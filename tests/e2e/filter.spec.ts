import { expect, test } from '@fixtures/test';

test.describe('Filters', () => {
  test('@ESC-FILTRO-001 filtering by category shows only products of that category', async ({
    homePage,
  }) => {
    await homePage.goto();
    await homePage.filterByCategory('Hammer');

    await expect(homePage.productNames.first()).toBeVisible();
    await expect(homePage.productsNotMatching(/hammer/i)).toHaveCount(0);
  });
});
