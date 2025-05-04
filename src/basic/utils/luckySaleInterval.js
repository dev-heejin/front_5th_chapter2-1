import { updateSelOpts } from '../components/selectItem.js';
import ProductListConstant from '../constant/productList.constant';

export default function luckySaleInterval() {
  return setTimeout(() => {
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
}
