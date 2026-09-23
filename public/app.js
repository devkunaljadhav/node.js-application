// BOOM.COM Store State
let allProducts = [];
let currentCategory = 'All';
let currentSearch = '';
let currentSort = 'popular';
let cart = JSON.parse(localStorage.getItem('boom_cart') || '[]');
let activePromo = null;

// DOM Elements
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const categoryTabs = document.getElementById('category-tabs');
const sortSelect = document.getElementById('sort-select');
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartBackdrop = document.getElementById('cart-backdrop');
const cartCountBadge = document.getElementById('cart-count');
const cartItemsList = document.getElementById('cart-items-list');
const cartItemsSummary = document.getElementById('cart-items-summary');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartDiscountEl = document.getElementById('cart-discount');
const cartTotalEl = document.getElementById('cart-total');
const discountRow = document.getElementById('discount-row');
const discountPercentEl = document.getElementById('discount-percent');
const promoInput = document.getElementById('promo-input');
const applyPromoBtn = document.getElementById('apply-promo-btn');
const promoMsg = document.getElementById('promo-msg');
const checkoutBtn = document.getElementById('checkout-btn');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalCloseBtn = document.getElementById('modal-close-btn');
const toastContainer = document.getElementById('toast-container');
const couponCopyBtn = document.getElementById('coupon-copy-btn');
const shopNowBtn = document.getElementById('shop-now-btn');

// Fetch Products from API
async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to load products');
    const data = await res.json();
    allProducts = data.products || [];
    renderProducts();
  } catch (err) {
    productGrid.innerHTML = `<div class="loading-spinner" style="color: #ef4444;">Error loading products: ${err.message}</div>`;
  }
}

// Filter and Sort Products
function getFilteredProducts() {
  let list = [...allProducts];

  if (currentCategory !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === currentCategory.toLowerCase());
  }

  if (currentSearch.trim() !== '') {
    const q = currentSearch.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  if (currentSort === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else {
    // Default popular
    list.sort((a, b) => b.reviews - a.reviews);
  }

  return list;
}

// Render Products Grid
function renderProducts() {
  const items = getFilteredProducts();

  if (items.length === 0) {
    productGrid.innerHTML = `
      <div class="loading-spinner">
        <p>No products found matching "${currentSearch}".</p>
        <button class="btn btn-secondary btn-sm" style="margin-top: 1rem;" onclick="resetFilters()">Reset Filters</button>
      </div>`;
    return;
  }

  productGrid.innerHTML = items.map(product => `
    <article class="product-card" id="card-${product.id}">
      <span class="card-badge" style="background: ${product.badgeColor || '#e11d48'}">${product.badge}</span>
      <div class="product-image-box">${product.image}</div>
      <span class="product-category">${product.category}</span>
      <h3 class="product-title">${product.name}</h3>
      <p class="product-desc">${product.description}</p>
      
      <div class="rating-row">
        <span class="stars">★★★★★</span>
        <span class="rating-val" style="font-weight: 600;">${product.rating}</span>
        <span class="review-count">(${product.reviews.toLocaleString()})</span>
      </div>

      <div class="price-row-card">
        <span class="current-price">$${product.price.toFixed(2)}</span>
        <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
      </div>

      <button class="add-cart-btn" onclick="addToCart('${product.id}')">
        <span>⚡ Add to Cart</span>
      </button>
    </article>
  `).join('');
}

// Reset Filters
window.resetFilters = function() {
  currentCategory = 'All';
  currentSearch = '';
  searchInput.value = '';
  clearSearchBtn.style.display = 'none';
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.category === 'All');
  });
  renderProducts();
};

// Cart Management
window.addToCart = function(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast(`Added <strong>${product.name}</strong> to cart!`);
};

function saveCart() {
  localStorage.setItem('boom_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountBadge.textContent = totalItems;
  cartItemsSummary.textContent = `(${totalItems} item${totalItems === 1 ? '' : 's'})`;

  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div class="empty-cart-msg">
        <div class="empty-icon">🛒</div>
        <p>Your BOOM cart is empty.</p>
        <button class="btn btn-secondary btn-sm" onclick="toggleCart(false)">Explore Deals</button>
      </div>`;
    cartSubtotalEl.textContent = '$0.00';
    cartTotalEl.textContent = '$0.00';
    discountRow.style.display = 'none';
    checkoutBtn.disabled = true;
    checkoutBtn.style.opacity = '0.5';
    return;
  }

  checkoutBtn.disabled = false;
  checkoutBtn.style.opacity = '1';

  cartItemsList.innerHTML = cart.map(item => `
    <div class="cart-item-row" id="cart-item-${item.id}">
      <div class="cart-item-img">${item.image}</div>
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
        <span class="qty-val">${item.quantity}</span>
        <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
      </div>
      <button class="remove-item-btn" onclick="removeItem('${item.id}')" title="Remove">✕</button>
    </div>
  `).join('');

  // Calculate Subtotal & Total
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;

  let discount = 0;
  if (activePromo && activePromo.code === 'BOOM20') {
    discount = subtotal * 0.20;
    discountRow.style.display = 'flex';
    discountPercentEl.textContent = '20%';
    cartDiscountEl.textContent = `-$${discount.toFixed(2)}`;
  } else {
    discountRow.style.display = 'none';
  }

  const finalTotal = Math.max(0, subtotal - discount);
  cartTotalEl.textContent = `$${finalTotal.toFixed(2)}`;
}

window.updateQty = function(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  saveCart();
  updateCartUI();
};

window.removeItem = function(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
  showToast('Item removed from cart');
};

function toggleCart(open) {
  cartDrawer.classList.toggle('open', open);
  cartBackdrop.classList.toggle('open', open);
}

// Promo Code
applyPromoBtn.addEventListener('click', () => {
  const code = promoInput.value.trim().toUpperCase();
  if (code === 'BOOM20') {
    activePromo = { code: 'BOOM20', discount: 0.20 };
    promoMsg.style.color = '#22c55e';
    promoMsg.textContent = '✔ Coupon BOOM20 applied! 20% OFF';
    updateCartUI();
  } else if (code === '') {
    promoMsg.textContent = '';
  } else {
    promoMsg.style.color = '#ef4444';
    promoMsg.textContent = '✖ Invalid promo code. Try BOOM20';
  }
});

// Checkout Flow
checkoutBtn.addEventListener('click', async () => {
  if (cart.length === 0) return;

  checkoutBtn.disabled = true;
  checkoutBtn.textContent = 'Processing Order...';

  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart,
        promoCode: activePromo ? activePromo.code : null
      })
    });

    const data = await res.json();
    if (data.success) {
      document.getElementById('modal-order-id').textContent = data.orderId;
      document.getElementById('modal-order-total').textContent = cartTotalEl.textContent;
      
      // Clear cart
      cart = [];
      saveCart();
      updateCartUI();
      toggleCart(false);

      modalBackdrop.classList.add('open');
    }
  } catch (err) {
    showToast('Checkout failed. Please retry.');
  } finally {
    checkoutBtn.disabled = false;
    checkoutBtn.innerHTML = '<span>Proceed to Checkout</span><span class="checkout-arrow">→</span>';
  }
});

modalCloseBtn.addEventListener('click', () => {
  modalBackdrop.classList.remove('open');
});

// Toast Notifications
function showToast(htmlMsg) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>💥</span><div>${htmlMsg}</div>`;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Live Health Check Monitoring
async function checkServerHealth() {
  const textEl = document.getElementById('health-status-text');
  try {
    const res = await fetch('/health');
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'UP') {
        textEl.textContent = 'HEALTH: UP (200)';
      }
    }
  } catch (err) {
    textEl.textContent = 'HEALTH: OFFLINE';
  }
}

// Event Listeners
openCartBtn.addEventListener('click', () => toggleCart(true));
closeCartBtn.addEventListener('click', () => toggleCart(false));
cartBackdrop.addEventListener('click', () => toggleCart(false));

if (couponCopyBtn) {
  couponCopyBtn.addEventListener('click', () => {
    promoInput.value = 'BOOM20';
    applyPromoBtn.click();
    toggleCart(true);
  });
}

if (shopNowBtn) {
  shopNowBtn.addEventListener('click', () => toggleCart(false));
}

// Search
searchInput.addEventListener('input', (e) => {
  currentSearch = e.target.value;
  clearSearchBtn.style.display = currentSearch ? 'block' : 'none';
  renderProducts();
});

clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  currentSearch = '';
  clearSearchBtn.style.display = 'none';
  renderProducts();
});

// Category Tabs
categoryTabs.addEventListener('click', (e) => {
  if (e.target.classList.contains('tab-btn')) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentCategory = e.target.dataset.category;
    renderProducts();
  }
});

// Sort
sortSelect.addEventListener('change', (e) => {
  currentSort = e.target.value;
  renderProducts();
});

// Initial Setup
loadProducts();
updateCartUI();
checkServerHealth();
setInterval(checkServerHealth, 5000);
