import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';

export interface Favorite {
  id: string;
  product_id: string;
}

/** Favorites belong to the user whose token is passed in. */
export class FavoritesClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly token: string,
  ) {}

  private get headers(): Record<string, string> {
    return { Authorization: `Bearer ${this.token}` };
  }

  add(productId: string): Promise<APIResponse> {
    return this.request.post('favorites', {
      headers: this.headers,
      data: { product_id: productId },
    });
  }

  async list(): Promise<Favorite[]> {
    const response = await this.request.get('favorites', { headers: this.headers });
    await expect(response, 'GET /favorites failed').toBeOK();
    return (await response.json()) as Favorite[];
  }

  delete(favoriteId: string): Promise<APIResponse> {
    return this.request.delete(`favorites/${favoriteId}`, { headers: this.headers });
  }
}
