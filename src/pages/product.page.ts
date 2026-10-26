import { expect, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductPage extends BasePage {
  readonly name: Locator = this.page.getByTestId('product-name');
  readonly addToCartButton: Locator = this.page.getByTestId('add-to-cart');

  async goto(productId: string): Promise<void> {
    await this.page.goto(`/product/${productId}`);
    await expect(this.name).toBeVisible();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
