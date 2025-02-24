import BasePage from './BasePage';

/**
 * Represents the page with the detail of the selected item.
 */
class ItemDetailPage extends BasePage {
  // Selectors
  private itemNameSelector = '#itemName';
  private itemDescriptionSelector = '#itemDescription';
  private itemPriceSelector = '#itemPrice';
  private addToCartButtonSelector = '#addToCart';
  private itemAddedNotificationSelector = '#itemAddedNotificaiton';

  /**
   * Checks if the page is loaded and returns the corresponding instance of this class
   * @returns The Item detail object if the page has been loaded, null otherwise
   */
  public static async init(): Promise<ItemDetailPage | null> {
    if (await $('div.item-detail').isExisting()) {
      return new ItemDetailPage();
    } else {
      return null;
    }
  }

  // Methods for retrieving information about the item from the page
  public async getItemName(): Promise<string> {
    return await $(this.itemNameSelector).getText();
  }

  public async getItemDescription(): Promise<string> {
    return await $(this.itemDescriptionSelector).getText();
  }

  public async getItemPrice(): Promise<number> {
    return parseFloat(await $(this.itemPriceSelector).getText());
  }

  /**
   * Clicks the "Add to cart" button
   * @returns True if notification of succesfully added item is present, false otherwise
   */
  public async addToCart(): Promise<boolean> {
    await $(this.addToCartButtonSelector).click();
    return await $(this.itemAddedNotificationSelector).waitForDisplayed();
  }
}

export default ItemDetailPage;
