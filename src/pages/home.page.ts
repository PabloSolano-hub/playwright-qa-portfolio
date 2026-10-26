import { expect, type Locator } from '@playwright/test';
import { isApiResponse } from '@utils/api-response';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly productNames: Locator = this.page.getByTestId('product-name');

  async goto(): Promise<void> {
    await this.page.goto('/');
    await expect(this.productNames.first()).toBeVisible();
  }

  /**
   * Product cards whose name does not match. Asserting this has count 0 retries until the
   * grid has re-rendered, unlike iterating over a one-off snapshot of the list.
   */
  productsNotMatching(pattern: RegExp): Locator {
    return this.productNames.filter({ hasNotText: pattern });
  }

  async filterByCategory(category: string): Promise<void> {
    const results = this.page.waitForResponse(isApiResponse('/products'));
    await this.page.getByLabel(category, { exact: true }).check();
    await results;
  }
}
