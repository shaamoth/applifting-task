import { expect } from '@wdio/globals';
import BrowseItemsPage from '../src/pages/BrowseItemsPage.js';
import BasePage from '../src/pages/BasePage.js';

describe('Shopping cart', () => {
  it('[TC-03,TC-04] Verification of adding and removing items in the shopping cart', async () => {
    let browseItemsPage = await BrowseItemsPage.load();
    const item1Name = 'Gibson Les Paul Standard 50s';
    const item2Name = 'Taylor AD17e Acoustic-Electric Guitar';

    // More items can be added
    const testedItems = [
      { name: item1Name, price: 2499 },
      { name: item2Name, price: 1999 },
    ];

    let itemCount = 0;
    let currentPage: BasePage = browseItemsPage;
    let totalPrice = 0;

    for (const testedItem of testedItems) {
      // TC-03.1,TC-03.6
      let itemDetailPage = (currentPage = await browseItemsPage.openItemDetail(testedItem.name));

      // TC-03.2,TC-03.7
      const itemPrice = await itemDetailPage.getItemPrice();
      await expect(itemPrice).toBe(testedItem.price);
      totalPrice += itemPrice;

      // TC-03.3,TC-03.8
      await expect(await itemDetailPage.addToCart()).toBe(true);

      // TC-03.4,TC-03.9
      await expect(await itemDetailPage.getShoppingCartIconItemsNumber()).toBe(++itemCount);

      if (itemCount < testedItems.length) {
        // TC-03.5
        browseItemsPage = await itemDetailPage.goToHomePage();
      }
    }

    // TC-03.10
    const shoppingCartPage = await currentPage.goToShoppingCart();

    // TC-03.11
    await expect(await shoppingCartPage.getItemsNumber()).toBe(2);

    // TC-03.12
    let allItemsInCart = await shoppingCartPage.getAllItemsInCart();
    await expect(allItemsInCart).toEqual(testedItems);

    // TC-03.13
    await expect(await shoppingCartPage.getTotalPrice()).toBe(totalPrice);

    let itemsRemovedCount = 0;
    let currentItemsCount = testedItems.length;
    let currentTotalPrice = totalPrice;
    for (const testedItem of testedItems) {
      // TC-04.1,TC-04.5
      await expect(await shoppingCartPage.removeItem(testedItem.name)).toBe(true);

      // TC-04.2
      allItemsInCart = await shoppingCartPage.getAllItemsInCart();
      await expect(allItemsInCart).toEqual(testedItems.slice(++itemsRemovedCount));

      // TC-04.3,TC-04.6
      currentItemsCount = testedItems.length - itemsRemovedCount;
      await expect(await shoppingCartPage.getItemsNumber()).toBe(currentItemsCount);
      currentTotalPrice = currentTotalPrice - testedItem.price;
      await expect(await shoppingCartPage.getTotalPrice()).toBe(currentTotalPrice);

      if (currentItemsCount === 0) {
        await expect(await shoppingCartPage.emptyCartMessagePresent()).toBe(true);
      }

      // TC-04.4,TC-04.7
      await expect(await shoppingCartPage.getShoppingCartIconItemsNumber()).toBe(currentItemsCount);
    }
  });

  it('[TC-05] Verification of system behavior when the shopping cart is empty and access to the Checkout page', async () => {
    let browseItemsPage = await BrowseItemsPage.load();

    // TC-05.1
    let shoppingCartPage = await browseItemsPage.goToShoppingCart();

    // TC-05.2
    await expect(await shoppingCartPage.emptyCartMessagePresent()).toBe(true);
    await expect(await shoppingCartPage.getTotalPrice()).toBe(0);

    // TC-05.3
    await expect(await shoppingCartPage.proceedToCheckout()).toBeNull();

    // TC-05.4
    browseItemsPage = await shoppingCartPage.continueShopping();

    // TC-05.5
    const itemDetailPage = await browseItemsPage.openItemDetail(1);

    // TC-05.6
    await expect(await itemDetailPage.addToCart()).toBe(true);

    // TC-05.7
    shoppingCartPage = await browseItemsPage.goToShoppingCart();

    // TC-05.8
    await expect(await shoppingCartPage.emptyCartMessagePresent()).toBe(false);
    await expect(await shoppingCartPage.getItemsNumber()).toBe(1);

    // TC-05.9
    const checkoutPage = await shoppingCartPage.proceedToCheckout();
    await expect(checkoutPage).not.toBeNull();

    // TC-05.10
    shoppingCartPage = await checkoutPage!.goToShoppingCart();

    // TC-05.11
    await expect(await shoppingCartPage.removeItem(1)).toBe(true);

    // TC-05.12
    await expect(await shoppingCartPage.proceedToCheckout()).toBeNull();
  });

  it('[TC-06] Verification that it is possible to access the shopping cart page from any page', async () => {
    let browseItemsPage = await BrowseItemsPage.load();
    const item1Name = 'Seagull S6 Original Acoustic Guitar';

    // TC-06.1
    let itemDetailPage = await browseItemsPage.openItemDetail(item1Name);

    // TC-06.2
    let shoppingCartPage = await itemDetailPage.goToShoppingCart();

    // TC-06.3
    shoppingCartPage = await shoppingCartPage.goToShoppingCart();

    // TC-06.4
    browseItemsPage = await shoppingCartPage.goToHomePage();

    // TC-06.5
    await browseItemsPage.searchForItem('Ibanez');
    await expect(await browseItemsPage.getListedItems()).toBe(1);

    // TC-06.6
    shoppingCartPage = await browseItemsPage.goToShoppingCart();

    // TC-06.7
    browseItemsPage = await shoppingCartPage.goToHomePage();
    itemDetailPage = await browseItemsPage.openItemDetail(1);
    await expect(await itemDetailPage.addToCart()).toBe(true);

    // TC-06.8
    browseItemsPage = await itemDetailPage.goToHomePage();

    // TC-06.9
    shoppingCartPage = await browseItemsPage.goToShoppingCart();

    // TC-06.10
    let checkoutPage = await shoppingCartPage.proceedToCheckout();
    await expect(checkoutPage).not.toBeNull();

    // TC-06.11
    shoppingCartPage = await checkoutPage!.goToShoppingCart();
  });
});
