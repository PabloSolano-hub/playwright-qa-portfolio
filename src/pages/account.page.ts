import type { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class AccountPage extends BasePage {
  readonly title: Locator = this.page.getByTestId('page-title');
  readonly url = /\/account$/;
}
