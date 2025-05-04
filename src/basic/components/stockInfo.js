export default function stockInfo() {
  const stockInfoTextElement = document.createElement('div');
  stockInfoTextElement.id = 'stock-status';
  stockInfoTextElement.className = 'text-sm text-gray-500 mt-2';
  return stockInfoTextElement;
}
