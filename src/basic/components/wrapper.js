import addButton, { attachAddButtonListener } from './addButton.js';
import cartItemList, { attachCartItemListListener } from './cartItemList.js';
import headerTitle from './headerTitle.js';
import selectItem, { updateSelOpts } from './selectItem.js';
import stockInfo from './stockInfo.js';
import TotalPrice from './totalPrice.js';

export default function wrapper() {
  const wrapElement = document.createElement('div');

  wrapElement.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  const headingTextElement = headerTitle();
  wrapElement.appendChild(headingTextElement);

  const cartItemListElement = cartItemList();
  attachCartItemListListener(cartItemListElement);
  wrapElement.appendChild(cartItemListElement);

  const totalPriceElement = TotalPrice();
  wrapElement.appendChild(totalPriceElement);

  const selectElement = selectItem();
  wrapElement.appendChild(selectElement);
  updateSelOpts(selectElement);

  const addButtonElement = addButton();
  attachAddButtonListener(addButtonElement);
  wrapElement.appendChild(addButtonElement);

  const stockInfoElement = stockInfo();
  wrapElement.appendChild(stockInfoElement);

  return wrapElement;
}
