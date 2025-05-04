import ProductListConstant from '../constant/productList.constant';

export default function selectItem() {
  const selectElement = document.createElement('select');

  selectElement.id = 'product-select';
  selectElement.className = 'border rounded p-2 mr-2';

  return selectElement;
}

// 상품 선택 옵션을 업데이트하는 함수
export function updateSelOpts(selectElement) {
  if (!selectElement) return; // selectElement가 없으면 종료

  selectElement.innerHTML = '';
  ProductListConstant.forEach((item) => {
    const optionElement = document.createElement('option');
    optionElement.value = item.id;
    optionElement.textContent = `${item.name} - ${item.price}원`;
    optionElement.disabled = item.quantity === 0;
    selectElement.appendChild(optionElement);
  });
}
