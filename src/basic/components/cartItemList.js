import ProductListConstant from '../constant/productList.constant';
import { calcCart } from '../main.basic.js';

export default function cartItemList() {
  const cartItemListElement = document.createElement('div');
  cartItemListElement.id = 'cart-items';
  return cartItemListElement;
}

export function attachCartItemListListener(cartItemListElement) {
  // 장바구니 아이템 클릭 이벤트 핸들러
  cartItemListElement.addEventListener('click', (event) => {
    const target = event.target;
    if (
      target.classList.contains('quantity-change') ||
      target.classList.contains('remove-item')
    ) {
      const productId = target.dataset.productId;
      const productElement = document.getElementById(productId);
      const selectedProduct = ProductListConstant.find(
        (p) => p.id === productId
      );
      const quantity = parseInt(
        productElement.querySelector('span').textContent.split('x ')[1]
      );

      if (target.classList.contains('quantity-change')) {
        const quantityChange = parseInt(target.dataset.change);
        const newQuantity = quantity + quantityChange;

        if (
          newQuantity > 0 &&
          newQuantity <= selectedProduct.quantity + quantity
        ) {
          productElement.querySelector('span').textContent =
            `${productElement.querySelector('span').textContent.split('x ')[0]}x ${newQuantity}`;
          selectedProduct.quantity -= quantityChange;
        } else if (newQuantity <= 0) {
          productElement.remove();
          selectedProduct.quantity -= quantityChange;
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        selectedProduct.quantity += quantity;
        productElement.remove();
      }
      calcCart();
    }
  });
}
