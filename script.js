// Data Produk Laptop
const productsData = [
  {
    brand: "lenovo",
    brandName: "Lenovo",
    brandLogo: "img/lenovo.png",
    items: [
      { id: "l1", name: "Lenovo ThinkPad X1 Carbon", price: 24500000, spec: "Intel i7, 16GB RAM, 1TB SSD", img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500" },
      { id: "l2", name: "Lenovo Yoga 9i Dual Screen", price: 27999000, spec: "Intel i7, 32GB RAM, 1TB SSD", img: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500" },
      { id: "l3", name: "Lenovo Legion Pro 7i", price: 35499000, spec: "i9 13900HX, RTX 4080, 32GB", img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500" }
    ]
  },
  {
    brand: "macbook",
    brandName: "MacBook",
    brandLogo: "img/macbook.png",
    items: [
      { id: "m1", name: "MacBook Air M2 13\"", price: 18999000, spec: "Apple M2, 8GB RAM, 256GB SSD", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500" },
      { id: "m2", name: "MacBook Pro 14\" M3 Pro", price: 31999000, spec: "M3 Pro, 18GB RAM, 512GB SSD", img: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500" },
      { id: "m3", name: "MacBook Pro 16\" M3 Max", price: 54999000, spec: "M3 Max, 36GB RAM, 1TB SSD", img: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500" }
    ]
  },
  {
    brand: "asus",
    brandName: "Asus",
    brandLogo: "img/asus.png",
    items: [
      { id: "a1", name: "Asus ROG Zephyrus G16", price: 32999000, spec: "Intel Ultra 9, RTX 4070, 16GB", img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500" },
      { id: "a2", name: "Asus Zenbook 14 OLED", price: 16999000, spec: "Intel Ultra 7, 16GB RAM, 1TB SSD", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500" },
      { id: "a3", name: "Asus TUF Gaming A15", price: 14499000, spec: "Ryzen 7, RTX 4050, 16GB RAM", img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500" }
    ]
  }
];

let cart = [];
let activeBrand = 'all';
let searchQuery = '';

// DOM Elements
const catalogContainer = document.getElementById('catalogContainer');
const layoutSelect = document.getElementById('layoutSelect');
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartBadge = document.getElementById('cartBadge');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

// Format Rupiah
function formatRupiah(num) {
  return "Rp " + num.toLocaleString('id-ID');
}

// Render Katalog Produk
function renderCatalog() {
  catalogContainer.innerHTML = '';

  productsData.forEach(brandGroup => {
    if (activeBrand !== 'all' && brandGroup.brand !== activeBrand) return;

    // Filter pencarian
    const filteredItems = brandGroup.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.spec.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredItems.length === 0) return;

    const brandSection = document.createElement('div');
    brandSection.className = 'brand-section';

    brandSection.innerHTML = `
      <div class="brand-header">
        <img src="${brandGroup.brandLogo}" alt="${brandGroup.brandName}" class="brand-logo" onerror="this.src='https://via.placeholder.com/40'">
        <h2>${brandGroup.brandName}</h2>
      </div>
      <div class="horizontal-track">
        ${filteredItems.map(item => `
          <div class="product-card">
            <div>
              <img src="${item.img}" alt="${item.name}">
              <div class="product-title">${item.name}</div>
              <div class="product-spec">${item.spec}</div>
            </div>
            <div>
              <div class="product-price">${formatRupiah(item.price)}</div>
              <div class="card-actions">
                <button class="btn-action btn-secondary" onclick="showDetail('${item.id}')">Detail</button>
                <button class="btn-action btn-primary" onclick="addToCart('${item.id}')">+ Keranjang</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    catalogContainer.appendChild(brandSection);
  });
}

// Fitur Tambah Keranjang
function addToCart(id) {
  let allProducts = [];
  productsData.forEach(b => allProducts.push(...b.items));
  const product = allProducts.find(p => p.id === id);

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCart();
}

function updateCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;
  let totalCount = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    totalCount += item.qty;

    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small>${formatRupiah(item.price)} x ${item.qty}</small>
      </div>
      <div class="cart-controls">
        <button onclick="changeQty('${item.id}', -1)">-</button>
        <button onclick="changeQty('${item.id}', 1)">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  cartTotal.innerText = formatRupiah(total);
  cartBadge.innerText = totalCount;
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
  }
  updateCart();
}

// Modal Detail
function showDetail(id) {
  let allProducts = [];
  productsData.forEach(b => allProducts.push(...b.items));
  const product = allProducts.find(p => p.id === id);

  modalBody.innerHTML = `
    <img src="${product.img}" style="width:100%; border-radius:8px; margin-bottom:1rem;">
    <h2>${product.name}</h2>
    <p style="color:var(--text-muted); margin:0.5rem 0;">${product.spec}</p>
    <h3 style="color:var(--accent-color); margin-bottom:1rem;">${formatRupiah(product.price)}</h3>
    <button class="btn-action btn-primary" style="width:100%" onclick="addToCart('${product.id}'); closeModalFunc();">Beli Sekarang</button>
  `;

  modal.classList.add('active');
  overlay.classList.add('active');
}

function closeModalFunc() {
  modal.classList.remove('active');
  overlay.classList.remove('active');
}

// Event Listeners
layoutSelect.addEventListener('change', (e) => {
  catalogContainer.className = `catalog-wrapper ${e.target.value}`;
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    activeBrand = e.target.dataset.brand;
    renderCatalog();
  });
});

searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderCatalog();
});

// Toggle Light/Dark Theme
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
});

// Cart Drawer Toggles
cartBtn.addEventListener('click', () => {
  cartDrawer.classList.add('open');
  overlay.classList.add('active');
});

closeCart.addEventListener('click', () => {
  cartDrawer.classList.remove('open');
  overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
  cartDrawer.classList.remove('open');
  closeModalFunc();
});

closeModal.addEventListener('click', closeModalFunc);

// Initial Render
renderCatalog();