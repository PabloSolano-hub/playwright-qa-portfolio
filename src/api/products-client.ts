import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import type { Paginated, Product } from './types';

export class ProductsClient {
  constructor(private readonly request: APIRequestContext) {}

  list(page = 1): Promise<APIResponse> {
    return this.request.get('products', { params: { page } });
  }

  get(productId: string): Promise<APIResponse> {
    return this.request.get(`products/${productId}`);
  }

  search(query: string): Promise<APIResponse> {
    return this.request.get('products/search', { params: { q: query } });
  }

  byCategory(categoryId: string): Promise<APIResponse> {
    return this.request.get('products', { params: { by_category: categoryId } });
  }

  /** Returns a regular (non-rental) product that can be added to the cart. */
  async findPurchasable(): Promise<Product> {
    const response = await this.list();
    await expect(response, 'GET /products failed').toBeOK();
    const { data } = (await response.json()) as Paginated<Product>;
    const product = data.find((p) => p.in_stock && !p.is_rental);
    if (!product) {
      throw new Error('No purchasable product found on the first page of /products');
    }
    return product;
  }
}
