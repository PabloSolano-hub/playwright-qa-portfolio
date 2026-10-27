import { expect, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class FavoritesPage extends BasePage {
  readonly title: Locator = this.page.getByTestId('page-title');
  /** Each card is tagged `favorite-<favorite id>`. */
  readonly items: Locator = this.page.getByTestId(/^favorite-/);
  readonly productNames: Locator = this.items.getByTestId('product-name');

  async goto(): Promise<void> {
    await this.page.goto('/account/favorites');
    await expect(this.title).toHaveText('Favorites');
  }
}
