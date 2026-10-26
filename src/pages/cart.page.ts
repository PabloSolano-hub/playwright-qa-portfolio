import type { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  readonly productTitles: Locator = this.page.getByTestId('product-title');
  readonly productQuantities: Locator = this.page.getByTestId('product-quantity');
  readonly total: Locator = this.page.getByTestId('cart-total');
  readonly proceedButton: Locator = this.page.getByTestId('proceed-1');

  async goto(): Promise<void> {
    await this.page.goto('/checkout');
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedButton.click();
  }
}
