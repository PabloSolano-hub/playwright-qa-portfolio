import { expect, type Locator } from '@playwright/test';
import { isApiCall } from '@utils/api-response';
import { BasePage } from './base.page';

export class ProductPage extends BasePage {
  readonly name: Locator = this.page.getByTestId('product-name');
  readonly addToCartButton: Locator = this.page.getByTestId('add-to-cart');
  readonly addToFavoritesButton: Locator = this.page.getByTestId('add-to-favorites');
  /** Toast notifications have no data-test attribute; their ARIA role is the stable hook. */
  readonly toasts: Locator = this.page.getByRole('alert');

  async goto(productId: string): Promise<void> {
    await this.page.goto(`/product/${productId}`);
    await expect(this.name).toBeVisible();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  /** Clicks "Add to favorites" and waits for the API answer (201 new, 409 already there). */
  async addToFavorites(): Promise<void> {
    const saved = this.page.waitForResponse(isApiCall('/favorites'));
    await this.addToFavoritesButton.click();
    await saved;
  }

  toast(text: string): Locator {
    return this.toasts.filter({ hasText: text });
  }
}
