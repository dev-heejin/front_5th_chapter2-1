import container from './components/container.js';
import wrapper from './components/wrapper.js';
import ProductListConstant from './constant/productList.constant';
import luckySaleInterval from './utils/luckySaleInterval.js';
import recommendSaleInterval from './utils/recommendSaleInterval.js';

// 장바구니와 관련된 HTML 요소를 생성하고 초기화하는 함수
function main() {
  const rootElement = document.getElementById('app');
  const wrapElement = wrapper();
  const containerElement = container();

  containerElement.appendChild(wrapElement);
  rootElement.appendChild(containerElement);

  // 이벤트 alert
  luckySaleInterval();
  recommendSaleInterval();

  // 장바구니 계산
  calcCart();
}

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

  const totalPriceElement = document.getElementById('cart-total');
  totalPriceElement.textContent = '총액: ' + Math.round(totalPrice) + '원';

  if (discountPercentage > 0) {
    const discountInfo = document.createElement('span');
    discountInfo.className = 'text-green-500 ml-2';
    discountInfo.textContent = `(${(discountPercentage * 100).toFixed(1)}% 할인 적용)`;
    totalPriceElement.appendChild(discountInfo);
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
