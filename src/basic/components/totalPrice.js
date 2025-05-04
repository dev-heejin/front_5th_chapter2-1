export default function TotalPrice() {
  const totalPriceElement = document.createElement('div');
  totalPriceElement.id = 'cart-total';
  totalPriceElement.className = 'text-xl font-bold my-4';
  return totalPriceElement;
}
