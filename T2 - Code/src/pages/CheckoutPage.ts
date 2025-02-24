import { $ } from '@wdio/globals';
import BasePage from './BasePage';

/**
 * Represents the page with the order summary and checkout form.
 */
class CheckoutPage extends BasePage {
  // Selectors
  private totalPriceSelector = 'div.order-summary .total-price';
  private fullNameInputSelector = '#fullName';
  private addressLine1InputSelector = '#addressLine1';
  private addressLine2InputSelector = '#addressLine2';
  private cityInputSelector = '#city';
  private countryInputSelector = '#country';
  private placeOrderButtonSelector = '#placeOrder';

  // Methods

  /**
   * Checks if the page is loaded and returns the corresponding instance of this class
   * @returns The Checkout page object if the page has been loaded, null otherwise
   */
  public static async init(): Promise<CheckoutPage | null> {
    if (await $('div.checkout-summary').isExisting()) {
      return new CheckoutPage();
    } else {
      return null;
    }
  }

  // Methods for controlling the checkout form
  public async getTotalPrice(): Promise<number> {
    return parseFloat(await $(this.totalPriceSelector).getText());
  }

  public async fillFullNameInput(inputText: string) {
    await $(this.fullNameInputSelector).setValue(inputText);
  }

  public async fillAddressLine1Input(inputText: string) {
    await $(this.addressLine1InputSelector).setValue(inputText);
  }

  public async fillAddressLine2Input(inputText: string) {
    await $(this.addressLine2InputSelector).setValue(inputText);
  }

  public async fillCityInput(inputText: string) {
    await $(this.cityInputSelector).setValue(inputText);
  }

  public async fillCountryInput(inputText: string) {
    await $(this.countryInputSelector).setValue(inputText);
  }

  public async clickPlaceOrderButton() {
    await $(this.placeOrderButtonSelector).click();
  }
}

export default CheckoutPage;
