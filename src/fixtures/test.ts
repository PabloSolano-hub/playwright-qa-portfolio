import { test as base } from '@playwright/test';
import { ProductsClient } from '@api/products-client';
import { AccountPage } from '@pages/account.page';
import { CartPage } from '@pages/cart.page';
import { CheckoutPage } from '@pages/checkout.page';
import { HomePage } from '@pages/home.page';
import { LoginPage } from '@pages/login.page';
import { ProductPage } from '@pages/product.page';
import { env } from '@utils/env';

interface Pages {
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  loginPage: LoginPage;
  accountPage: AccountPage;
}

interface Api {
  productsApi: ProductsClient;
}

export const test = base.extend<Pages & Api>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  productsApi: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({ baseURL: `${env.apiUrl}/` });
    await use(new ProductsClient(context));
    await context.dispose();
  },
});

export { expect } from '@playwright/test';
