import { expect, test } from '@fixtures/test';
import type { Paginated, Product } from '@api/types';

test.describe('Products API', () => {
  test('@ESC-API-PROD-001 product list is paginated @smoke', async ({ productsApi }) => {
    const response = await productsApi.list(1);

    expect(response.status()).toBe(200);
    const body = (await response.json()) as Paginated<Product>;
    expect(body).toMatchObject({ current_page: 1, per_page: 9 });
    expect(body.data).toHaveLength(body.per_page);
    expect(body.total).toBeGreaterThan(body.per_page);
    for (const product of body.data) {
      expect(product).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          price: expect.any(Number),
          in_stock: expect.any(Boolean),
        }),
      );
    }
  });

  test('@ESC-API-PROD-002 a product can be retrieved by id', async ({ productsApi }) => {
    const listed = await productsApi.findPurchasable();

    const response = await productsApi.get(listed.id);

    expect(response.status()).toBe(200);
    expect((await response.json()) as Product).toMatchObject({
      id: listed.id,
      name: listed.name,
      price: listed.price,
    });
  });

  test('@ESC-API-PROD-003 an unknown product id returns 404', async ({ productsApi }) => {
    const response = await productsApi.get('00000000000000000000000000');

    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ message: 'Requested item not found' });
  });

  test('@ESC-API-PROD-004 search returns only products matching the keyword', async ({
    productsApi,
  }) => {
    const response = await productsApi.search('pliers');

    expect(response.status()).toBe(200);
    const { data } = (await response.json()) as Paginated<Product>;
    expect(data.length).toBeGreaterThan(0);
    for (const product of data) {
      expect(product.name).toMatch(/pliers/i);
    }
  });

  test('@ESC-API-PROD-005 filtering by category returns only that category', async ({
    productsApi,
  }) => {
    const { category } = await productsApi.findPurchasable();

    const response = await productsApi.byCategory(category.id);

    expect(response.status()).toBe(200);
    const { data } = (await response.json()) as Paginated<Product>;
    expect(data.length).toBeGreaterThan(0);
    for (const product of data) {
      expect(product.category).toMatchObject({ id: category.id, name: category.name });
    }
  });
});
