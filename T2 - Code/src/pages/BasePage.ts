import { $ } from '@wdio/globals';
import BrowseItemsPage from './BrowseItemsPage';
import ShoppingCartPage from './ShoppingCartPage';

/**
 * Base page from which all specific pages should be extended. Contains features common to all pages.
 */
abstract class BasePage {
  // Selectors
  private siteTitleSelector = 'h1';
  private homeButtonSelector = '#homeButton';
  private shoppingCartButtonSelector = '#shoppingCart';

  // Methods

  public async getSiteTitle(): Promise<string> {
    return await $(this.siteTitleSelector).getText();
  }

  /**
   * Goes to the home page by clicking the home button
   * @returns The Browse items page object if the page was succesfully loaded
   * @throws Error if the page was not succesfully loaded
   */
  public async goToHomePage(): Promise<BrowseItemsPage> {
    await $(this.homeButtonSelector).click();
    const browseItemsPage = await BrowseItemsPage.init();
    if (browseItemsPage) return browseItemsPage;

    throw new Error('Failed: Unable to open browse items page.');
  }

  /**
   * Goes to the shopping cart page by clicking the shopping cart button at the top of the page
   * @returns The Shopping cart object if the page was succesfully loaded
   * @throws Error if the page was not succesfully loaded
   */
  public async goToShoppingCart(): Promise<ShoppingCartPage> {
    await $(this.shoppingCartButtonSelector).click();
    const shoppingCartPage = await ShoppingCartPage.init();
    if (shoppingCartPage) return shoppingCartPage;

    throw new Error('Failed: Unable to open shopping cart page.');
  }

  /**
   * Gets the number of items in shopping cart
   * @returns The number next to the shopping cart button at the top of the page
   * @throws Error if the text next to the button is in an unexpected format
   */
  public async getShoppingCartIconItemsNumber(): Promise<number> {
    const shoppingCartText = await $(this.shoppingCartButtonSelector).getText();
    const match = shoppingCartText.match(/^cart \((\d+)\)$/); // the text should be "cart (n)", where n is the number of items
    if (match) {
      return parseInt(match[1]);
    } else {
      throw Error('Unexpected shopping cart button text format');
    }
  }
}

export default BasePage;
