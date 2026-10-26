import { expect, type Locator } from '@playwright/test';
import type { Address } from '@data/address';
import { isApiCall } from '@utils/api-response';
import { BasePage } from './base.page';

export type PaymentMethod =
  'bank-transfer' | 'cash-on-delivery' | 'credit-card' | 'buy-now-pay-later' | 'gift-card';

/** Checkout steps 2-4 (sign in, billing address, payment). Step 1 lives in CartPage. */
export class CheckoutPage extends BasePage {
  readonly signedInProceedButton: Locator = this.page.getByTestId('proceed-2');
  readonly addressProceedButton: Locator = this.page.getByTestId('proceed-3');
  readonly paymentMethod: Locator = this.page.getByTestId('payment-method');
  readonly confirmButton: Locator = this.page.getByTestId('finish');
  readonly paymentSuccessMessage: Locator = this.page.getByTestId('payment-success-message');
  readonly orderConfirmation: Locator = this.page.getByText(/Thanks for your order!/);

  readonly country: Locator = this.page.getByTestId('country');
  readonly postalCode: Locator = this.page.getByTestId('postal_code');
  readonly houseNumber: Locator = this.page.getByTestId('house_number');
  readonly street: Locator = this.page.getByTestId('street');
  readonly city: Locator = this.page.getByTestId('city');
  readonly state: Locator = this.page.getByTestId('state');

  async continueAsSignedInUser(): Promise<void> {
    await this.signedInProceedButton.click();
  }

  /**
   * The billing form is unstable by design of the app:
   * - entering step 3 loads the profile (GET /users/me, currently twice) and each load
   *   re-initialises the form, wiping postal code and house number typed so far;
   * - country + postal code + house number trigger a postcode lookup (also sent twice)
   *   that overwrites street, city and state.
   * We retry until our input survives, keep the lookup result when it succeeds, and only
   * type street/city/state when the lookup fails.
   */
  async fillBillingAddress(address: Address): Promise<void> {
    await expect(async () => {
      const lookup = this.page.waitForResponse(isApiCall('/postcode-lookup'), {
        timeout: 5_000,
      });
      await this.country.selectOption({ label: address.country });
      await this.postalCode.fill(address.postalCode);
      await this.houseNumber.fill(address.houseNumber);
      const response = await lookup;

      if (response.ok()) {
        const { street } = (await response.json()) as { street: string };
        await expect(this.street).toHaveValue(street, { timeout: 2_000 });
      } else {
        await this.street.fill(address.street);
        await this.city.fill(address.city);
        await this.state.fill(address.state);
      }
      await expect(this.postalCode).toHaveValue(address.postalCode, { timeout: 1_000 });
      await expect(this.houseNumber).toHaveValue(address.houseNumber, { timeout: 1_000 });
      await expect(this.addressProceedButton).toBeEnabled({ timeout: 1_000 });
    }).toPass({ timeout: 20_000 });

    await this.addressProceedButton.click();
  }

  async payWith(method: PaymentMethod): Promise<void> {
    await this.paymentMethod.selectOption(method);
    await this.confirmButton.click();
  }

  async placeOrder(): Promise<void> {
    await this.confirmButton.click();
  }
}
