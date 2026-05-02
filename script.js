const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const categorySelect = document.getElementById('category');
const productSelect = document.getElementById('product');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

const productOptions = {
  soap: [
    { value: 'lavender-soap', label: 'Lavender Soap' },
    { value: 'neem-soap', label: 'Neem Soap' },
    { value: 'honey-soap', label: 'Honey Soap' }
  ],
  shampoo: [
    { value: 'rose-shampoo', label: 'Rose Shampoo' },
    { value: 'aloe-shampoo', label: 'Aloe Shampoo' },
    { value: 'coconut-shampoo', label: 'Coconut Shampoo' }
  ]
};

menuToggle?.addEventListener('click', () => {
  nav?.classList.toggle('nav-open');
});

function populateProductOptions(category) {
  if (!productSelect) return;

  productSelect.innerHTML = '<option value="" disabled selected>Select a product</option>';
  productSelect.disabled = true;

  if (!category || !productOptions[category]) {
    return;
  }

  productOptions[category].forEach((product) => {
    const option = document.createElement('option');
    option.value = product.value;
    option.textContent = product.label;
    productSelect.appendChild(option);
  });

  productSelect.disabled = false;
}

categorySelect?.addEventListener('change', (event) => {
  populateProductOptions(event.target.value);
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = event.target.name.value.trim();
  const email = event.target.email.value.trim();
  const category = event.target.category.value;
  const product = event.target.product.value;
  const quantity = Number(event.target.quantity.value);
  const message = event.target.message.value.trim();

  if (!name || !email || !category || !product || !quantity || !message) {
    formStatus.textContent = 'Please complete all fields before sending.';
    return;
  }

  formStatus.textContent = 'Thanks! Your request has been received.';
  contactForm.reset();
  populateProductOptions('');
});

// Initialize product dropdown state on page load
populateProductOptions('');

// Handle category parameter on products page
function handleCategoryParameter() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  
  if (category === 'soap' || category === 'shampoo') {
    const section = document.getElementById(category);
    if (section) {
      setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        section.classList.add('highlight-section');
        setTimeout(() => section.classList.remove('highlight-section'), 3000);
      }, 300);
    }
  }
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleCategoryParameter);
} else {
  handleCategoryParameter();
}
