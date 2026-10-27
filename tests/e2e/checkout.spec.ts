import { expect, test } from '@fixtures/test';
import { buildAddress } from '@data/address';

test.describe('Checkout', () => {
  test('@ESC-CHECKOUT-001 signed-in customer completes checkout with cash on delivery', async ({
    productsApi,
    seedCart,
    cartPage,
    checkoutPage,
  }) => {
    // The cart is prepared through the API: this test covers checkout, not adding to cart.
    const product = await productsApi.findPurchasable();
    await seedCart(product.id);

    await cartPage.goto();
    await expect(cartPage.productTitles).toHaveText([product.name]);
    await cartPage.proceedToCheckout();
    await checkoutPage.continueAsSignedInUser();
    await checkoutPage.fillBillingAddress(buildAddress());
    await checkoutPage.payWith('cash-on-delivery');
    await expect(checkoutPage.paymentSuccessMessage).toHaveText('Payment was successful');

    await checkoutPage.placeOrder();
    await expect(checkoutPage.orderConfirmation).toContainText(/INV-\d+/);
  });
});
