import { expect, test } from '@fixtures/test';

// Each test uses its own registered user; favoritesApi deletes the favorites on teardown,
// before the user (the API refuses to delete a user that still has favorites).
test.describe('Favorites API', () => {
  test('@ESC-API-FAV-001 a product added to favorites is listed for its user', async ({
    productsApi,
    favoritesApi,
  }) => {
    const product = await productsApi.findPurchasable();
    expect(await favoritesApi.list()).toEqual([]);

    const added = await favoritesApi.add(product.id);

    expect(added.status()).toBe(201);
    expect(await favoritesApi.list()).toEqual([
      expect.objectContaining({ product_id: product.id }),
    ]);
  });

  test('@ESC-API-FAV-002 adding the same product twice is rejected and not duplicated', async ({
    productsApi,
    favoritesApi,
  }) => {
    const product = await productsApi.findPurchasable();
    await expect(await favoritesApi.add(product.id)).toBeOK();

    const duplicate = await favoritesApi.add(product.id);

    expect(duplicate.status()).toBe(409);
    expect(await favoritesApi.list()).toHaveLength(1);
  });
});
