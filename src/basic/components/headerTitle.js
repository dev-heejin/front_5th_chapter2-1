export default function headerTitle() {
  const headingTextElement = document.createElement('h1');
  headingTextElement.className = 'text-2xl font-bold mb-4';
  headingTextElement.textContent = '장바구니';
  return headingTextElement;
}
