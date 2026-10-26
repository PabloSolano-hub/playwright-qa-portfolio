import type { Locator } from '@playwright/test';
import type { Credentials } from '@utils/env';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator = this.page.getByTestId('email');
  readonly passwordInput: Locator = this.page.getByTestId('password');
  readonly submitButton: Locator = this.page.getByTestId('login-submit');
  readonly errorMessage: Locator = this.page.getByTestId('login-error');

  async goto(): Promise<void> {
    await this.page.goto('/auth/login');
  }

  async login({ email, password }: Credentials): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
