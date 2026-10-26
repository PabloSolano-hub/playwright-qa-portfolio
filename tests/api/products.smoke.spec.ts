import { expect, test } from '@playwright/test';

interface ProductsPage {
  current_page: number;
  data: { id: string; name: string; price: number }[];
}

test.describe('Products API smoke', () => {
  test('GET /products returns a paginated product list @smoke', async ({ request }) => {
    const response = await request.get('products', { params: { page: 1 } });

    await expect(response).toBeOK();
    const body = (await response.json()) as ProductsPage;
    expect(body.current_page).toBe(1);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        price: expect.any(Number),
      }),
    );
  });
});
