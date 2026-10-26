import { expect, test } from '@fixtures/test';

test.describe('Cart', () => {
  test('@ESC-CARRITO-001 adding a product updates the cart badge and cart contents', async ({
    productsApi,
    productPage,
    cartPage,
  }) => {
    const product = await productsApi.findPurchasable();

    await productPage.goto(product.id);
    await productPage.addToCart();
    await expect(productPage.header.cartQuantity).toHaveText('1');

    await productPage.header.openCart();
    await expect(cartPage.productTitles).toHaveText([product.name]);
    await expect(cartPage.productQuantities).toHaveValue('1');
  });
});
