const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const categorySelect = document.getElementById('category');
const productSelect = document.getElementById('product');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const loginForm = document.getElementById('loginForm');
const loginStatus = document.getElementById('loginStatus');

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

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = event.target.name.value.trim();
  const email = event.target.email.value.trim();
  const category = event.target.category.value;
  const product = event.target.product.value;
  const quantity = Number(event.target.quantity.value);
  const message = event.target.message.value.trim();

  if (!name || !email || !category || !product || !quantity || !message) {
    formStatus.textContent = 'Please complete all fields before sending.';
    formStatus.style.color = '#e74c3c';
    return;
  }

  formStatus.textContent = 'Sending your request...';
  formStatus.style.color = '#f39c12';

  try {
    const response = await fetch('/api/contacts/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        category,
        product,
        quantity,
        message,
      }),
    });

    const data = await response.json();

    if (data.success) {
      formStatus.textContent = data.message;
      formStatus.style.color = '#27ae60';
      contactForm.reset();
      populateProductOptions('');
    } else {
      formStatus.textContent = data.message || 'Error submitting your request. Please try again.';
      formStatus.style.color = '#e74c3c';
    }
  } catch (error) {
    console.error('Error:', error);
    formStatus.textContent = 'Error submitting your request. Please check your connection and try again.';
    formStatus.style.color = '#e74c3c';
  }
});

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = event.target.email.value.trim();
  const password = event.target.password.value.trim();
  const remember = document.getElementById('rememberMe')?.checked;

  if (!email || !password) {
    loginStatus.textContent = 'Please enter both email and password.';
    loginStatus.style.color = '#e74c3c';
    return;
  }

  loginStatus.textContent = 'Signing in...';
  loginStatus.style.color = '#f39c12';

  await new Promise((resolve) => setTimeout(resolve, 650));

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    loginStatus.textContent = 'Please enter a valid email address.';
    loginStatus.style.color = '#e74c3c';
    return;
  }

  if (password.length < 6) {
    loginStatus.textContent = 'Password must be at least 6 characters.';
    loginStatus.style.color = '#e74c3c';
    return;
  }

  loginStatus.textContent = `Welcome back${remember ? ', remember me enabled' : ''}! Redirecting...`;
  loginStatus.style.color = '#27ae60';

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1100);
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
