import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';

export class CartsClient {
  constructor(private readonly request: APIRequestContext) {}

  create(): Promise<APIResponse> {
    return this.request.post('carts');
  }

  /** Creates a cart and returns its id, failing fast if the API rejects it. */
  async createId(): Promise<string> {
    const response = await this.create();
    await expect(response, 'POST /carts failed').toBeOK();
    return ((await response.json()) as { id: string }).id;
  }

  get(cartId: string): Promise<APIResponse> {
    return this.request.get(`carts/${cartId}`);
  }

  addItem(cartId: string, productId: string, quantity: number): Promise<APIResponse> {
    return this.request.post(`carts/${cartId}`, {
      data: { product_id: productId, quantity },
    });
  }

  updateQuantity(cartId: string, productId: string, quantity: number): Promise<APIResponse> {
    return this.request.put(`carts/${cartId}/product/quantity`, {
      data: { product_id: productId, quantity },
    });
  }

  removeItem(cartId: string, productId: string): Promise<APIResponse> {
    return this.request.delete(`carts/${cartId}/product/${productId}`);
  }

  delete(cartId: string): Promise<APIResponse> {
    return this.request.delete(`carts/${cartId}`);
  }
}
