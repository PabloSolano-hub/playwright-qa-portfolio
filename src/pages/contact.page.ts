import { expect, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ContactPage extends BasePage {
  readonly firstName: Locator = this.page.getByTestId('first-name');
  readonly lastName: Locator = this.page.getByTestId('last-name');
  readonly email: Locator = this.page.getByTestId('email');
  readonly subject: Locator = this.page.getByTestId('subject');
  readonly message: Locator = this.page.getByTestId('message');
  readonly submitButton: Locator = this.page.getByTestId('contact-submit');

  async goto(): Promise<void> {
    await this.page.goto('/contact');
    await expect(this.submitButton).toBeVisible();
  }
}
