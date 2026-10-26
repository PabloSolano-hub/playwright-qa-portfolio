import type { Locator, Page } from '@playwright/test';
import { isApiResponse } from '@utils/api-response';

export class HeaderComponent {
  readonly searchInput: Locator;
  readonly searchSubmit: Locator;
  readonly searchCaption: Locator;
  readonly cartLink: Locator;
  readonly cartQuantity: Locator;
  readonly userMenu: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.getByTestId('search-query');
    this.searchSubmit = page.getByTestId('search-submit');
    this.searchCaption = page.getByTestId('search-caption');
    this.cartLink = page.getByTestId('nav-cart');
    this.cartQuantity = page.getByTestId('cart-quantity');
    this.userMenu = page.getByTestId('nav-menu');
  }

  /**
   * The caption updates before the product grid re-renders, so we wait for
   * the search API response instead of the caption to avoid reading stale results.
   */
  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    const results = this.page.waitForResponse(isApiResponse('/products/search'));
    await this.searchSubmit.click();
    await results;
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
