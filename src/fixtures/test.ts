import { test as base, expect, type APIRequestContext } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createApiContext } from '@api/api-context';
import { AuthClient } from '@api/auth-client';
import { retryOnServerError } from '@api/retry';
import { CartsClient } from '@api/carts-client';
import { FavoritesClient } from '@api/favorites-client';
import { ProductsClient } from '@api/products-client';
import { AccountPage } from '@pages/account.page';
import { CartPage } from '@pages/cart.page';
import { CheckoutPage } from '@pages/checkout.page';
import { ContactPage } from '@pages/contact.page';
import { FavoritesPage } from '@pages/favorites.page';
import { HomePage } from '@pages/home.page';
import { LoginPage } from '@pages/login.page';
import { ProductPage } from '@pages/product.page';
import { buildUser } from '@data/user';
import { classify, WCAG_TAGS, type AuditedPage, type ViolationNode } from '@utils/accessibility';
import { env } from '@utils/env';
import type { TestUser } from '@utils/test-user';

interface Pages {
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  loginPage: LoginPage;
  accountPage: AccountPage;
  favoritesPage: FavoritesPage;
  contactPage: ContactPage;
}

interface Accessibility {
  /**
   * Runs axe (WCAG 2.0/2.1 A + AA) on the current page, attaches the full results as JSON,
   * annotates known third-party defects, and returns only the violations that are NOT known.
   */
  auditAccessibility: (page: AuditedPage) => Promise<ViolationNode[]>;
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
  /** A fresh user registered through the API for this test only, deleted afterwards. */
  registeredUser: TestUser;
  /** API token of `registeredUser`. Browserless, so it also works in the API project. */
  userToken: string;
  /**
   * Signs the browser in as `registeredUser` (JWT injected into localStorage, as the setup does).
   * For UI tests whose data must not be shared with other tests or browsers running in parallel.
   */
  signedInUser: TestUser;
  /** Favorites of `registeredUser`; deleted on teardown, before the user itself. */
  favoritesApi: FavoritesClient;
  /** Creates a cart through the API and makes the browser session use it. */
  seedCart: (productId: string, quantity?: number) => Promise<string>;
}

export const test = base.extend<Pages & Api & Accessibility>({
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
  favoritesPage: async ({ page }, use) => {
    await use(new FavoritesPage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },

  auditAccessibility: async ({ page }, use, testInfo) => {
    await use(async (audited) => {
      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      await testInfo.attach(`axe-${audited}.json`, {
        body: JSON.stringify(results, null, 2),
        contentType: 'application/json',
      });

      const { unexpected, known, notReproduced } = classify(results, audited);
      for (const [id, nodes] of known) {
        testInfo.annotations.push({
          type: 'known a11y defect',
          description: `${id}: ${nodes.map((node) => `${node.rule} @ ${node.target}`).join(', ')}`,
        });
      }
      for (const defect of notReproduced) {
        testInfo.annotations.push({
          type: 'a11y defect not reproduced',
          description: `${defect.id} (${defect.rule}) no longer reported: maybe fixed upstream, review KNOWN_VIOLATIONS`,
        });
      }
      return unexpected;
    });
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

  cleanup: async ({ authApi, cartsApi }, use, testInfo) => {
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
        // 409 = the user still owns data the API won't cascade (orders); visible in the report.
        testInfo.annotations.push({
          type: 'cleanup',
          description: `DELETE /users/${id} -> ${response.status()}`,
        });
        expect([204, 404, 409], `cleanup of user ${id}`).toContain(response.status());
      }
    }
  },

  registeredUser: async ({ authApi, cleanup }, use) => {
    // A fresh user per attempt: a 5xx may still have created the previous one (409 on reuse).
    let user = buildUser();
    const response = await retryOnServerError(() => {
      user = buildUser();
      return authApi.register(user);
    }, 'registering a test user');
    await expect(response, 'registering a test user').toBeOK();
    const { id } = (await response.json()) as { id: string };
    cleanup.user(id);
    await use({ ...user, id });
  },

  userToken: async ({ authApi, registeredUser }, use) => {
    await use(await authApi.tokenFor(registeredUser));
  },

  signedInUser: async ({ page, registeredUser, userToken }, use) => {
    await page.addInitScript((value) => {
      window.localStorage.setItem('auth-token', value);
    }, userToken);
    await use(registeredUser);
  },

  favoritesApi: async ({ api, userToken }, use) => {
    const favorites = new FavoritesClient(api, userToken);
    await use(favorites);
    // The API refuses to delete a user that still has favorites (409).
    for (const favorite of await favorites.list()) {
      await expect(await favorites.delete(favorite.id), 'cleanup of favorite').toBeOK();
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
