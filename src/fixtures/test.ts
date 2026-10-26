import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { createApiContext } from '@api/api-context';
import { AuthClient } from '@api/auth-client';
import { CartsClient } from '@api/carts-client';
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

/** Records data created by a test so it is removed from the public demo site afterwards. */
export interface Cleanup {
  cart(cartId: string): void;
  user(userId: string): void;
}

interface Api {
  api: APIRequestContext;
  authApi: AuthClient;
  productsApi: ProductsClient;
  cartsApi: CartsClient;
  cleanup: Cleanup;
  /** Creates a cart through the API and makes the browser session use it. */
  seedCart: (productId: string, quantity?: number) => Promise<string>;
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

  api: async ({ playwright }, use) => {
    const context = await createApiContext(playwright);
    await use(context);
    await context.dispose();
  },
  authApi: async ({ api }, use) => {
    await use(new AuthClient(api));
  },
  productsApi: async ({ api }, use) => {
    await use(new ProductsClient(api));
  },
  cartsApi: async ({ api }, use) => {
    await use(new CartsClient(api));
  },

  cleanup: async ({ authApi, cartsApi }, use) => {
    const carts: string[] = [];
    const users: string[] = [];
    await use({ cart: (id) => carts.push(id), user: (id) => users.push(id) });

    // Best effort: a cart that became an order may already be gone (404).
    for (const id of carts) {
      const response = await cartsApi.delete(id);
      expect([204, 404], `cleanup of cart ${id}`).toContain(response.status());
    }
    if (users.length > 0) {
      const adminToken = await authApi.tokenFor(env.admin);
      for (const id of users) {
        const response = await authApi.deleteUser(id, adminToken);
        expect([204, 404], `cleanup of user ${id}`).toContain(response.status());
      }
    }
  },

  seedCart: async ({ page, cartsApi, cleanup }, use) => {
    await use(async (productId, quantity = 1) => {
      const cartId = await cartsApi.createId();
      cleanup.cart(cartId);
      await expect(await cartsApi.addItem(cartId, productId, quantity)).toBeOK();

      // The SPA keeps the active cart in sessionStorage, which storageState does not persist.
      await page.addInitScript(
        ([id, qty]) => {
          window.sessionStorage.setItem('cart_id', id);
          window.sessionStorage.setItem('cart_quantity', qty);
        },
        [cartId, String(quantity)] as const,
      );
      return cartId;
    });
  },
});

export { expect } from '@playwright/test';
