import { updateSelOpts } from '../components/selectItem.js';
import ProductListConstant from '../constant/productList.constant';
import lastSelectState from '../lib/lastSelectState.js';

export default function recommendSaleInterval() {
  // 추천 상품 이벤트 설정
  return setTimeout(() => {
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
}
