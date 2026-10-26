import { expect, type APIRequestContext } from '@playwright/test';

export interface Product {
  id: string;
  name: string;
  price: number;
  in_stock: boolean;
  is_rental: boolean;
}

interface ProductsPage {
  current_page: number;
  last_page: number;
  data: Product[];
}

export class ProductsClient {
  constructor(private readonly request: APIRequestContext) {}

  async list(page = 1): Promise<ProductsPage> {
    const response = await this.request.get('products', { params: { page } });
    await expect(response, 'GET /products failed').toBeOK();
    return (await response.json()) as ProductsPage;
  }

  /** Returns a regular (non-rental) product that can be added to the cart. */
  async findPurchasable(): Promise<Product> {
    const { data } = await this.list();
    const product = data.find((p) => p.in_stock && !p.is_rental);
    if (!product) {
      throw new Error('No purchasable product found on the first page of /products');
    }
    return product;
  }
}
