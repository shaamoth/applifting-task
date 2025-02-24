import { expect } from '@wdio/globals';
import BrowseItemsPage from '../src/pages/BrowseItemsPage.js';

describe('Items searching and browsing', () => {
  it('[TC-01] Verification of search functionality and update of the product page based on searches', async () => {
    const browseItemsPage = await BrowseItemsPage.load();
    const itemName = 'Epiphone Les Paul Custom';

    // TC-01.1
    await browseItemsPage.searchForItem('Fender');
    const allListedItems1 = await browseItemsPage.getListedItems();
    await expect(allListedItems1).toEqual(['Fender Precision Bass Player Plus', 'Fender Stratocaster American Professional II', 'Fender Telecaster Player']);

    // TC-01.2
    await browseItemsPage.searchForItem('dffdfgvbvv');
    await expect(await browseItemsPage.warningMessagePresent()).toBe(true);
    await expect(await browseItemsPage.getWarningMessage()).toBe('No results found');

    // TC-01.3
    await browseItemsPage.searchForItem(itemName);
    const allListedItems2 = await browseItemsPage.getListedItems();
    await expect(allListedItems2).toEqual([itemName]);
  });

  it('[TC-02] Verification of the item detail view', async () => {
    let browseItemsPage = await BrowseItemsPage.load();
    const item1Name = 'Yamaha C40 Classical Guitar';
    const item2Name = 'Fender Telecaster Player';

    // TC-02.1.
    const item1Price = (await browseItemsPage.getItemDetails(item1Name)).price;
    await expect(item1Price).toBe(249.5);

    // TC-02.2.
    let itemDetailPage = await browseItemsPage.openItemDetail(item1Name);

    // TC-02.3.
    await expect(await itemDetailPage.getItemName()).toBe(item1Name);
    await expect(await itemDetailPage.getItemPrice()).toBe(item1Price);

    // TC-02.4.
    browseItemsPage = await itemDetailPage.goToHomePage();

    // TC-02.5.
    await browseItemsPage.searchForItem(item2Name);
    const listedItems = await browseItemsPage.getListedItems();
    await expect(listedItems).toEqual([item2Name]);
    const item2Price = (await browseItemsPage.getItemDetails(item2Name)).price;
    await expect(item2Price).toBe(849);

    // TC-02.6.
    itemDetailPage = await browseItemsPage.openItemDetail(item2Name);

    // TC-02.7
    await expect(await itemDetailPage.getItemName()).toBe(item2Name);
    await expect(await itemDetailPage.getItemPrice()).toBe(item2Price);
  });
});
