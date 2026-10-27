import { expect, test } from '@fixtures/test';
import type { Cart, Product, ValidationError } from '@api/types';

test.describe('Cart API', () => {
  let product: Product;
  let cartId: string;

  test.beforeEach(async ({ productsApi, cartsApi, cleanup }) => {
    product = await productsApi.findPurchasable();
    cartId = await cartsApi.createId();
    cleanup.cart(cartId);
  });

  test('@ESC-API-CART-001 a new cart is empty', async ({ cartsApi }) => {
    const response = await cartsApi.get(cartId);

    expect(response.status()).toBe(200);
    expect((await response.json()) as Cart).toMatchObject({ id: cartId, cart_items: [] });
  });

  test('@ESC-API-CART-002 an added product appears in the cart', async ({ cartsApi }) => {
    const added = await cartsApi.addItem(cartId, product.id, 2);
    expect(added.status()).toBe(200);

    const cart = (await (await cartsApi.get(cartId)).json()) as Cart;
    expect(cart.cart_items).toHaveLength(1);
    expect(cart.cart_items[0]).toMatchObject({
      product_id: product.id,
      quantity: 2,
      product: { name: product.name },
    });
  });

  test('@ESC-API-CART-003 the quantity of a cart item can be updated', async ({ cartsApi }) => {
    await expect(await cartsApi.addItem(cartId, product.id, 1)).toBeOK();

    const updated = await cartsApi.updateQuantity(cartId, product.id, 5);
    expect(updated.status()).toBe(200);

    const cart = (await (await cartsApi.get(cartId)).json()) as Cart;
    expect(cart.cart_items).toEqual([expect.objectContaining({ quantity: 5 })]);
  });

  test('@ESC-API-CART-004 a product can be removed from the cart', async ({ cartsApi }) => {
    await expect(await cartsApi.addItem(cartId, product.id, 1)).toBeOK();

    const removed = await cartsApi.removeItem(cartId, product.id);
    expect(removed.status()).toBe(204);

    const cart = (await (await cartsApi.get(cartId)).json()) as Cart;
    expect(cart.cart_items).toEqual([]);
  });

  for (const quantity of [0, -1]) {
    test(`@ESC-API-CART-005 adding quantity ${quantity} is rejected`, async ({ cartsApi }) => {
      const response = await cartsApi.addItem(cartId, product.id, quantity);

      expect(response.status()).toBe(422);
      expect(((await response.json()) as ValidationError).errors).toEqual({
        quantity: ['The quantity field must be at least 1.'],
      });
    });
  }

  test('@ESC-API-CART-006 adding an unknown product is rejected', async ({ cartsApi }) => {
    const response = await cartsApi.addItem(cartId, 'unknown-product', 1);

    expect(response.status()).toBe(422);
    expect(((await response.json()) as ValidationError).errors).toEqual({
      product_id: ['The selected product id is invalid.'],
    });
  });
});

test('@ESC-API-CART-007 an unknown cart returns 404', async ({ cartsApi }) => {
  const response = await cartsApi.get('unknown-cart');

  expect(response.status()).toBe(404);
  expect(await response.json()).toEqual({ message: 'Requested item not found' });
});
