import { expect, test } from '@fixtures/test';
import { buildAddress } from '@data/address';

test.describe('Checkout', () => {
  test('@ESC-CHECKOUT-001 signed-in customer completes checkout with cash on delivery', async ({
    productsApi,
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    const product = await productsApi.findPurchasable();

    await productPage.goto(product.id);
    await productPage.addToCart();
    await expect(productPage.header.cartQuantity).toHaveText('1');

    await cartPage.goto();
    await cartPage.proceedToCheckout();
    await checkoutPage.continueAsSignedInUser();
    await checkoutPage.fillBillingAddress(buildAddress());
    await checkoutPage.payWith('cash-on-delivery');
    await expect(checkoutPage.paymentSuccessMessage).toHaveText('Payment was successful');

    await checkoutPage.placeOrder();
    await expect(checkoutPage.orderConfirmation).toContainText(/INV-\d+/);
  });
});
