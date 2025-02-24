import { $ } from '@wdio/globals';
import BasePage from './BasePage';
import ItemDetailPage from './ItemDetailPage';

/**
 * Represents the page with a list of items. It is also the home page of the website.
 */
class BrowseItemsPage extends BasePage {
  // Selectors
  private searchInputSelector = '#searchInput';
  private searchButtonSelector = '#searchButton';
  private warningMessageSelector = '#warningMessage';

  // Methods

  /**
   * Checks if the page is loaded and returns the corresponding instance of this class
   * @returns The Browse items page object if the page has been loaded, null otherwise
   */
  public static async init(): Promise<BrowseItemsPage | null> {
    if (await $('div.items-grid').isExisting()) {
      return new BrowseItemsPage();
    } else {
      return null;
    }
  }

  /**
   * Loads the home page URL in the browser
   * @returns The Browse items page object if the page was succesfully loaded
   * @throws Error if the page was not succesfully loaded
   */
  public static async load(): Promise<BrowseItemsPage> {
    await browser.url('https://example.com/');

    const browseItemsPage = await BrowseItemsPage.init();
    if (browseItemsPage) return browseItemsPage;

    throw new Error('Failed: Unable to load browse items page.');
  }

  /**
   * Sets value in the search box and clicks the search button
   * @param searchValue Value to search
   */
  public async searchForItem(searchValue: string) {
    await $(this.searchInputSelector).setValue(searchValue);
    await $(this.searchButtonSelector).click();
  }

  /**
   * Gets the items listed on the browse page
   * @returns List of all item names on the page
   */
  public async getListedItems(): Promise<string[]> {
    const itemNames = await $$('.item span.item-name').map((item) => item.getText());
    return itemNames.sort();
  }

  /**
   * Gets the xpath of the item
   * @param item Item name or item order on the page
   * @returns Xpath to the div representing the specified item
   */
  private getItemXpath(item: string | number): string {
    if (typeof item === 'string') {
      return `//div[@class="item" and contains(.,${item})]`;
    } else {
      return `//div[@class="item"][@id="item-${item}"]`;
    }
  }

  /**
   * Gets the item details from the page
   * @param item Item name or item order on the page
   * @returns Object with item name and price
   */
  public async getItemDetails(item: string | number): Promise<{ name: string; price: number }> {
    const itemXpath = this.getItemXpath(item);

    const itemName: string = await $(itemXpath + '//span[@class="item-name"]').getText();
    const itemPrice: number = parseFloat(await $(itemXpath + '//span[@class="item-price"]').getText());

    return { name: itemName, price: itemPrice };
  }

  /**
   * Opens the item detail page of the selected item
   * @param item Item name or item order on the page
   * @returns The item detail page object if the page was succesfully loaded
   * @throws Error if the page was not succesfully loaded
   */
  public async openItemDetail(item: string | number): Promise<ItemDetailPage> {
    const itemXpath = this.getItemXpath(item);
    await $(itemXpath + '//button[@class="open-item-detail"]').click();
    const itemDetailPage = await ItemDetailPage.init();
    if (itemDetailPage) return itemDetailPage;

    throw new Error('Failed: Unable to open item detail page.');
  }

  /**
   * Determines whether the warning message (such as "No results found") is present on the page
   * @returns True if the message is present, false otherwise
   */
  public async warningMessagePresent(): Promise<boolean> {
    const warningMessage = $(this.warningMessageSelector);
    return (await warningMessage.isExisting()) && (await warningMessage.isDisplayed());
  }

  /**
   * Gets the content of the warning message
   * @returns The content of the warning message as a string
   */
  public async getWarningMessage(): Promise<string> {
    return await $(this.warningMessageSelector).getText();
  }
}

export default BrowseItemsPage;
