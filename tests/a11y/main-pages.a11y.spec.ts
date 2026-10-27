import { expect, test } from '@fixtures/test';

// Each audit fails on any WCAG 2.0/2.1 A/AA violation that is not a documented defect of the
// third-party site (KNOWN_VIOLATIONS in src/utils/accessibility.ts, scenarios/accesibilidad.md).
// Known defects show up as annotations in the report; the full axe results are attached as JSON.
test.describe('Accessibility', () => {
  test('@ESC-A11Y-001 home page has no new WCAG A/AA violations', async ({
    homePage,
    auditAccessibility,
  }) => {
    await homePage.goto();

    expect(await auditAccessibility('home')).toEqual([]);
  });

  test('@ESC-A11Y-002 product page has no new WCAG A/AA violations', async ({
    productsApi,
    productPage,
    auditAccessibility,
  }) => {
    const product = await productsApi.findPurchasable();
    await productPage.goto(product.id);

    expect(await auditAccessibility('product')).toEqual([]);
  });

  test('@ESC-A11Y-003 login page has no new WCAG A/AA violations', async ({
    loginPage,
    auditAccessibility,
  }) => {
    await loginPage.goto();
    await expect(loginPage.submitButton).toBeVisible();

    expect(await auditAccessibility('login')).toEqual([]);
  });

  test('@ESC-A11Y-004 cart page has no new WCAG A/AA violations', async ({
    productsApi,
    seedCart,
    cartPage,
    auditAccessibility,
  }) => {
    // An empty cart renders no content to audit, so one product is added through the API.
    const product = await productsApi.findPurchasable();
    await seedCart(product.id);
    await cartPage.goto();
    await expect(cartPage.productTitles).toHaveText([product.name]);

    expect(await auditAccessibility('cart')).toEqual([]);
  });

  test('@ESC-A11Y-005 contact page has no new WCAG A/AA violations', async ({
    contactPage,
    auditAccessibility,
  }) => {
    await contactPage.goto();

    expect(await auditAccessibility('contact')).toEqual([]);
  });
});
