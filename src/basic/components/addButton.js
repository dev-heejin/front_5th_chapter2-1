import ProductListConstant from '../constant/productList.constant';
import lastSelectState from '../lib/lastSelectState.js';
import { calcCart } from '../main.basic.js';

export default function addButton() {
  const addButtonElement = document.createElement('button');
  addButtonElement.id = 'add-to-cart';
  addButtonElement.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addButtonElement.textContent = '추가';
  return addButtonElement;
}

export function attachAddButtonListener(addButtonElement) {
  // 상품 추가 버튼 클릭 이벤트 핸들러
  addButtonElement.addEventListener('click', () => {
    const selectedItem = document.getElementById('product-select').value;
    const itemToAdd = ProductListConstant.find(
      (product) => product.id === selectedItem
    );

    if (itemToAdd && itemToAdd.quantity > 0) {
      const existingItem = document.getElementById(itemToAdd.id);

      if (existingItem) {
        const currentQuantity = parseInt(
          existingItem.querySelector('span').textContent.split('x ')[1]
        );
        if (currentQuantity < itemToAdd.quantity) {
          existingItem.querySelector('span').textContent =
            `${itemToAdd.name} - ${itemToAdd.price}원 x ${currentQuantity + 1}`;
          itemToAdd.quantity--;
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        const newItemElement = document.createElement('div');
        newItemElement.id = itemToAdd.id;
        newItemElement.className = 'flex justify-between items-center mb-2';
        newItemElement.innerHTML = `
                <span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span>
                <div>
                  <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
                  <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
                  <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
                </div>`;
        document.getElementById('cart-items').appendChild(newItemElement);
        itemToAdd.quantity--;
      }

      calcCart();
      lastSelectState().setState(selectedItem);
    }
  });
}
