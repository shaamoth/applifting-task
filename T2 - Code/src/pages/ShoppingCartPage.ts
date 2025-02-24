import BasePage from './BasePage';
import BrowseItemsPage from './BrowseItemsPage';
import CheckoutPage from './CheckoutPage';

/**
 * Represents the shopping cart page.
 */
class ShoppingCartPage extends BasePage {
  // Selectors
  private continueShoppingButtonSelector = '#continueShoppingButton';
  private totalPriceSelector = '#totalPrice';
  private proceedButtonSelector = '#proceedButton';
  private numberOfItemsSelector = '#itemsCount';
  private emptyCartMessageSelector = '#emptyCartMessage';
  private itemRemovedNotificationSelector = '#itemRemovedNotificaiton';

  // Classes
  private cartItemClass = 'cart-item';
  private cartItemNameClass = 'cart-item-name';
  private cartItemPriceClass = 'cart-item-price';

  // Methods

  /**
   * Checks if the page is loaded and returns the corresponding instance of this class
   * @returns The Shopping cart page object if the page has been loaded, null otherwise
   */
  public static async init(): Promise<ShoppingCartPage | null> {
    if (await $('div.shopping-cart').isExisting()) {
      return new ShoppingCartPage();
    } else {
      return null;
    }
  }

  /**
   * Clicks the "Continue Shopping" button to go to the Browse items page
   * @returns The Browse items page object if the page was succesfully loaded
   * @throws Error if the page was not succesfully loaded
   */
  public async continueShopping(): Promise<BrowseItemsPage> {
    await $(this.continueShoppingButtonSelector).click();
    const browseItemsPage = await BrowseItemsPage.init();
    if (browseItemsPage) return browseItemsPage;

    throw new Error('Failed: Unable to open browse items page.');
  }

  /**
   * Gets the price of all items in the shopping cart from the element (#totalPrice) below the list of items
   * @returns The total price
   */
  public async getTotalPrice(): Promise<number> {
    return parseFloat(await $(this.totalPriceSelector).getText());
  }

  /**
   * Click the "Proceed to checkout" button to open the checkout page
   * @returns The Checkout page object if the button was clickable and the page was succesfully loaded, null otherwise
   */
  public async proceedToCheckout(): Promise<CheckoutPage | null> {
    const proceedButton = $(this.proceedButtonSelector);
    if (await proceedButton.isClickable()) {
      await $(this.proceedButtonSelector).click();
      return CheckoutPage.init();
    }
    return null;
  }

  /**
   * Gets the xpath of the item in the shopping cart
   * @param item Item name or item order on the page
   * @returns Xpath to the div representing the specified item
   */
  private getItemXpath(item: string | number): string {
    if (typeof item === 'string') {
      return `//div[@class="${this.cartItemClass}" and contains(.,${item})]`;
    } else {
      return `//div[@class="${this.cartItemClass}][@id="cart-item-${item}"]`;
    }
  }

  /**
   * Gets the price of the item in the shopping cart
   * @param item Item name or item order on the page
   * @returns The price of the item
   */
  public async getItemPrice(item: string | number): Promise<number> {
    const itemDivXpath = this.getItemXpath(item);
    const itemPriceElement = $(itemDivXpath + `//span[@class="${this.cartItemPriceClass}"]`);
    return parseFloat(await itemPriceElement.getText());
  }

  /**
   * Clicks the "Remove item" button
   * @param item Item name or item order on the page
   * @returns True if notification of succesfully removed item is present, false otherwise
   */
  public async removeItem(item: string | number): Promise<boolean> {
    const itemDivXpath = this.getItemXpath(item);
    const itemButtonElement = $(itemDivXpath + '//button[@class="remove-cart-item"]');
    await itemButtonElement.click();
    return await $(this.itemRemovedNotificationSelector).waitForDisplayed();
  }

  /**
   * Gets the total number of items in the shopping cart
   * @returns The number of items
   */
  public async getItemsNumber(): Promise<number> {
    return parseInt(await $(this.numberOfItemsSelector).getText());
  }

  /**
   * Gets all items in the shopping cart
   * @returns List of objects representing the item with its name and price
   */
  public async getAllItemsInCart(): Promise<{ name: string; price: number }[]> {
    const result: { name: string; price: number }[] = [];
    const allItems = $$(`.${this.cartItemClass}`);
    for (const item of allItems) {
      const itemData = { name: await item.$(`.${this.cartItemNameClass}`).getText(), price: parseFloat(await item.$(`.${this.cartItemPriceClass}`).getText()) };
      result.push(itemData);
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Determines whether the empty cart message is present on the page
   * @returns True if the message is present, false otherwise
   */
  public async emptyCartMessagePresent(): Promise<boolean> {
    const emptyCartMessage = $(this.emptyCartMessageSelector);
    return (await emptyCartMessage.isExisting()) && (await emptyCartMessage.isDisplayed());
  }
}

export default ShoppingCartPage;
