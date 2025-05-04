import addButton, { attachAddButtonListener } from './components/addButton.js';
import ProductListConstant from './constant/productList.constant.js';
import lastSelectState from './lib/lastSelectState.js';

// 장바구니와 관련된 HTML 요소를 생성하고 초기화하는 함수
function main() {
  // HTML 요소 생성
  const rootElement = document.getElementById('app');
  const containerElement = document.createElement('div');
  const wrapElement = document.createElement('div');
  const headingTextElement = document.createElement('h1');

  // 장바구니 관련 요소
  const cartItemListElement = document.createElement('div');
  const cartTotalElement = document.createElement('div');
  const selectElement = document.createElement('select');
  const stockInfoTextElement = document.createElement('div');

  cartItemListElement.id = 'cart-items';
  cartTotalElement.id = 'cart-total';
  selectElement.id = 'product-select';

  stockInfoTextElement.id = 'stock-status';

  // 클래스 및 스타일 설정
  containerElement.className = 'bg-gray-100 p-8';
  wrapElement.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  headingTextElement.className = 'text-2xl font-bold mb-4';
  cartTotalElement.className = 'text-xl font-bold my-4';
  selectElement.className = 'border rounded p-2 mr-2';
  stockInfoTextElement.className = 'text-sm text-gray-500 mt-2';
  headingTextElement.textContent = '장바구니';

  // HTML 요소를 DOM에 추가
  wrapElement.appendChild(headingTextElement);
  wrapElement.appendChild(cartItemListElement);
  wrapElement.appendChild(cartTotalElement);
  wrapElement.appendChild(selectElement);

  const addButtonElement = addButton();
  attachAddButtonListener(addButtonElement);
  wrapElement.appendChild(addButtonElement);

  wrapElement.appendChild(stockInfoTextElement);
  containerElement.appendChild(wrapElement);
  rootElement.appendChild(containerElement);

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

  // 할인 이벤트 설정
  setTimeout(() => {
    setInterval(() => {
      const luckyItem =
        ProductListConstant[
          Math.floor(Math.random() * ProductListConstant.length)
        ];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);

  // 추천 상품 이벤트 설정
  // @TODO: lastSelectedItem을 전역 변수로 설정하여 사용
  setTimeout(() => {
    setInterval(() => {
      const lastSelectedItem = lastSelectState().getState();
      if (!lastSelectedItem) return;

      const suggest = ProductListConstant.find(
        (item) => item.id !== lastSelectedItem && item.quantity > 0
      );

      if (suggest) {
        alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
        suggest.price = Math.round(suggest.price * 0.95);
        updateSelOpts();
      }
    }, 60000);
  }, Math.random() * 20000);

  // 상품 선택 옵션 업데이트
  updateSelOpts();
  // 장바구니 계산
  calcCart();
}

// 상품 선택 옵션을 업데이트하는 함수
function updateSelOpts() {
  const selectElement = document.getElementById('product-select');
  selectElement.innerHTML = '';
  ProductListConstant.forEach((item) => {
    const optionElement = document.createElement('option');
    optionElement.value = item.id;
    optionElement.textContent = `${item.name} - ${item.price}원`;
    optionElement.disabled = item.quantity === 0;
    selectElement.appendChild(optionElement);
  });
}

// 장바구니 계산 함수
export function calcCart() {
  let totalPrice = 0;
  let cartItemsCount = 0;
  let subTotalPrice = 0;
  const cartItemListElement = document.getElementById('cart-items');
  const cartItems = cartItemListElement.children;
  for (let i = 0; i < cartItems.length; i++) {
    const currentCartItem = ProductListConstant.find(
      (product) => product.id === cartItems[i].id
    );

    const cartQuantity = parseInt(
      cartItems[i].querySelector('span').textContent.split('x ')[1]
    );
    const cartItemTotalCount = currentCartItem.price * cartQuantity;
    let discountPrice = 0;

    cartItemsCount += cartQuantity;
    subTotalPrice += cartItemTotalCount;

    if (cartQuantity >= 10) {
      const discountRates = {
        p1: 0.1,
        p2: 0.15,
        p3: 0.2,
        p4: 0.05,
        p5: 0.25,
      };
      discountPrice = discountRates[currentCartItem.id] || 0;
    }

    totalPrice += cartItemTotalCount * (1 - discountPrice);
  }

  let discountPercentage = 0;

  discountPercentage = (subTotalPrice - totalPrice) / subTotalPrice;
  if (cartItemsCount >= 30) {
    const bulkDiscountPrice = subTotalPrice * 0.25;
    if (bulkDiscountPrice > subTotalPrice - totalPrice) {
      totalPrice = subTotalPrice * 0.75;
      discountPercentage = 0.25;
    }
  }

  if (new Date().getDay() === 2) {
    totalPrice *= 1 - 0.1;
    discountPercentage = Math.max(discountPercentage, 0.1);
  }

  const cartTotalElement = document.getElementById('cart-total');
  cartTotalElement.textContent = '총액: ' + Math.round(totalPrice) + '원';

  if (discountPercentage > 0) {
    const discountInfo = document.createElement('span');
    discountInfo.className = 'text-green-500 ml-2';
    discountInfo.textContent = `(${(discountPercentage * 100).toFixed(1)}% 할인 적용)`;
    cartTotalElement.appendChild(discountInfo);
  }

  updateStockInfo();
  renderBonusPts(totalPrice);
}

// 포인트 계산 및 표시 함수
const renderBonusPts = (totalPrice) => {
  const bonusPoint = Math.floor(totalPrice / 1000);

  let pointTagElement = document.getElementById('loyalty-points');

  if (!pointTagElement) {
    pointTagElement = document.createElement('span');
    pointTagElement.id = 'loyalty-points';
    pointTagElement.className = 'text-blue-500 ml-2';

    const cartTotalElement = document.getElementById('cart-total');
    cartTotalElement.appendChild(pointTagElement);
  }

  pointTagElement.textContent = '(포인트: ' + bonusPoint + ')';
};

// 재고 정보 업데이트 함수
function updateStockInfo() {
  let updatedStockInfoMessage = '';
  ProductListConstant.forEach((item) => {
    if (item.quantity < 5) {
      updatedStockInfoMessage += `${item.name}: ${
        item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : '품절'
      }\n`;
    }
  });

  const stockInfoTextElement = document.getElementById('stock-status');
  stockInfoTextElement.textContent = updatedStockInfoMessage;
}

// 페이지 로드 시 초기화
main();
