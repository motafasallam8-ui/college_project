/* ═══════════════════════════════════════════════
   BISTRO ROYALE — GLOBAL JS
   Cart · Profile · Orders · Theme · Validation
═══════════════════════════════════════════════ */

const Theme = {
  KEY: 'br_theme',
  init() { document.documentElement.setAttribute('data-theme', localStorage.getItem(this.KEY) || 'light'); },
  toggle() {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(this.KEY, next);
    toast(next === 'dark' ? '🌙 Dark mode on' : '☀️ Light mode on', 'info');
  }
};

const Auth = {
  KEY: 'br_user',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)); } catch { return null; } },
  save(u) { localStorage.setItem(this.KEY, JSON.stringify(u)); },
  logout() { localStorage.removeItem(this.KEY); toast('Logged out!', 'info'); setTimeout(() => window.location.href = 'index.html', 800); },
  loggedIn() { return !!this.get(); },
  updateNav() {
    const user = this.get();
    document.querySelectorAll('.nav-login-btn').forEach(b => b.style.display = user ? 'none' : '');
    document.querySelectorAll('.nav-profile-btn').forEach(b => { b.style.display = user ? 'flex' : 'none'; });
    document.querySelectorAll('.nav-user-name').forEach(b => { if (user) b.textContent = (user.name || user.email || '').split(' ')[0]; });
  }
};

const Cart = {
  KEY: 'br_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY) || '[]'); } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); this.updateBadge(); },
  add(item) {
    const items = this.get();
    const ex = items.find(i => i.id == item.id);
    if (ex) ex.qty = (ex.qty || 1) + 1;
    else items.push({ ...item, qty: 1 });
    this.save(items);
    toast('🛒 ' + item.name + ' added to cart!', 'ok');
    document.querySelectorAll('.cart-btn').forEach(b => { b.style.transform = 'scale(1.3)'; setTimeout(() => b.style.transform = '', 300); });
  },
  remove(id) { this.save(this.get().filter(i => i.id != id)); },
  updateQty(id, qty) {
    const items = this.get();
    const it = items.find(i => i.id == id);
    if (it) { if (qty < 1) this.remove(id); else { it.qty = qty; this.save(items); } }
  },
  total() { return this.get().reduce((s, i) => s + i.price * (i.qty || 1), 0); },
  count() { return this.get().reduce((s, i) => s + (i.qty || 1), 0); },
  clear() { this.save([]); },
  updateBadge() {
    const c = this.count();
    document.querySelectorAll('.cart-count').forEach(el => { el.textContent = c; el.style.display = c > 0 ? 'flex' : 'none'; });
  }
};

const Orders = {
  KEY: 'br_orders',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY) || '[]'); } catch { return []; } },
  place(order) { const list = this.get(); list.unshift(order); localStorage.setItem(this.KEY, JSON.stringify(list)); }
};

const MENU_DATA = [
  { id: 101, name: 'Bruschetta', emoji: '🥖', desc: 'Toasted sourdough, fresh tomato, basil, olive oil', price: 7.99, cat: 'starters', ingredients: ['Sourdough', 'Cherry Tomatoes', 'Basil', 'Olive Oil', 'Garlic'], calories: 320, protein: '8g', carbs: '42g', fat: '12g', rating: 4.5, reviews: 128 },
  { id: 102, name: 'Soup of the Day', emoji: '🍲', desc: 'Freshly made with seasonal vegetables', price: 5.99, cat: 'starters', ingredients: ['Seasonal Veg', 'Vegetable Stock', 'Cream', 'Garlic'], calories: 210, protein: '6g', carbs: '28g', fat: '8g', rating: 4.3, reviews: 96 },
  { id: 103, name: 'Garlic Mushrooms', emoji: '🍄', desc: 'Sautéed in butter, thyme, toasted bread', price: 8.99, cat: 'starters', ingredients: ['Mixed Mushrooms', 'Butter', 'Garlic', 'Thyme', 'Sourdough'], calories: 280, protein: '7g', carbs: '22g', fat: '18g', rating: 4.7, reviews: 214 },
  { id: 104, name: 'Caesar Salad', emoji: '🥗', desc: 'Romaine, croutons, Parmesan, Caesar dressing', price: 9.99, cat: 'starters', ingredients: ['Romaine', 'Croutons', 'Parmesan', 'Anchovies', 'Dressing'], calories: 380, protein: '12g', carbs: '30g', fat: '24g', rating: 4.4, reviews: 187 },
  { id: 201, name: 'Grilled Chicken', emoji: '🍗', desc: 'Herb-marinated breast, roast potatoes, seasonal veg', price: 16.99, cat: 'mains', ingredients: ['Chicken Breast', 'Rosemary', 'Thyme', 'Garlic', 'Potatoes'], calories: 520, protein: '45g', carbs: '38g', fat: '18g', rating: 4.6, reviews: 342 },
  { id: 202, name: 'Beef Burger', emoji: '🍔', desc: 'Wagyu beef, brioche bun, truffle mayo, fries', price: 15.99, cat: 'mains', discount: 10, ingredients: ['Wagyu Patty', 'Brioche Bun', 'Truffle Mayo', 'Lettuce', 'Cheese', 'Fries'], calories: 780, protein: '42g', carbs: '65g', fat: '38g', rating: 4.8, reviews: 528 },
  { id: 203, name: 'Lamb Tagine', emoji: '🫕', desc: 'Slow-cooked lamb, apricots, couscous, harissa', price: 19.99, cat: 'mains', ingredients: ['Lamb Shoulder', 'Apricots', 'Couscous', 'Harissa', 'Chickpeas'], calories: 640, protein: '38g', carbs: '58g', fat: '22g', rating: 4.7, reviews: 261 },
  { id: 204, name: 'Veggie Curry', emoji: '🍛', desc: 'Seasonal veg in aromatic coconut sauce', price: 13.99, cat: 'mains', ingredients: ['Coconut Milk', 'Seasonal Veg', 'Basmati Rice', 'Curry Paste'], calories: 420, protein: '14g', carbs: '62g', fat: '16g', rating: 4.5, reviews: 189 },
  { id: 301, name: 'Ribeye Steak', emoji: '🥩', desc: '300g USDA ribeye, chimichurri, grilled veg', price: 34.99, cat: 'grills', ingredients: ['USDA Ribeye', 'Chimichurri', 'Asparagus', 'Cherry Tomato', 'Garlic Butter'], calories: 720, protein: '58g', carbs: '8g', fat: '42g', rating: 4.9, reviews: 412 },
  { id: 302, name: 'Mixed Grill Platter', emoji: '🍖', desc: 'Chicken, lamb, kofta, grilled tomato, flatbread', price: 28.99, cat: 'grills', ingredients: ['Chicken Thigh', 'Lamb Chop', 'Beef Kofta', 'Grilled Tomato', 'Flatbread'], calories: 880, protein: '68g', carbs: '42g', fat: '44g', rating: 4.8, reviews: 387 },
  { id: 303, name: 'BBQ Ribs', emoji: '🦴', desc: 'Fall-off-the-bone ribs, smoky BBQ sauce, coleslaw', price: 24.99, cat: 'grills', discount: 15, ingredients: ['Pork Ribs', 'Smoky BBQ Sauce', 'Coleslaw', 'Corn', 'Sweet Potato Fries'], calories: 960, protein: '52g', carbs: '72g', fat: '48g', rating: 4.7, reviews: 298 },
  { id: 401, name: 'Grilled Salmon', emoji: '🐟', desc: 'Atlantic salmon fillet, lemon butter, capers', price: 22.99, cat: 'seafood', ingredients: ['Atlantic Salmon', 'Lemon Butter', 'Capers', 'Dill', 'New Potatoes'], calories: 480, protein: '42g', carbs: '28g', fat: '24g', rating: 4.6, reviews: 234 },
  { id: 402, name: 'Prawn Linguine', emoji: '🦐', desc: 'King prawns, white wine, cherry tomato, chilli', price: 21.99, cat: 'seafood', ingredients: ['King Prawns', 'Linguine', 'White Wine', 'Cherry Tomatoes', 'Chilli'], calories: 560, protein: '36g', carbs: '68g', fat: '14g', rating: 4.5, reviews: 178 },
  { id: 403, name: 'Fish & Chips', emoji: '🐠', desc: 'Beer-battered cod, chips, tartare sauce', price: 14.99, cat: 'seafood', ingredients: ['Cod Fillet', 'Beer Batter', 'Chips', 'Tartare Sauce', 'Mushy Peas'], calories: 720, protein: '38g', carbs: '82g', fat: '28g', rating: 4.4, reviews: 312 },
  { id: 501, name: 'Spaghetti Bolognese', emoji: '🍝', desc: 'Slow-cooked beef ragu, fresh pasta, Parmesan', price: 14.99, cat: 'pasta', ingredients: ['Fresh Spaghetti', 'Beef Mince', 'San Marzano Tomatoes', 'Parmesan'], calories: 620, protein: '32g', carbs: '78g', fat: '18g', rating: 4.5, reviews: 256 },
  { id: 502, name: 'Truffle Pappardelle', emoji: '🍜', desc: 'Black truffle, cream, wild mushrooms, Pecorino', price: 19.99, cat: 'pasta', ingredients: ['Fresh Pappardelle', 'Black Truffle', 'Porcini', 'Cream', 'Pecorino'], calories: 680, protein: '22g', carbs: '72g', fat: '32g', rating: 4.8, reviews: 198 },
  { id: 503, name: 'Penne Arrabbiata', emoji: '🌶', desc: 'Spicy tomato sauce, chilli, garlic, basil', price: 12.99, cat: 'pasta', ingredients: ['Penne', 'San Marzano Tomatoes', 'Red Chilli', 'Garlic', 'Basil'], calories: 520, protein: '18g', carbs: '84g', fat: '12g', rating: 4.3, reviews: 142 },
  { id: 601, name: 'Chocolate Lava Cake', emoji: '🍫', desc: 'Warm Belgian chocolate, vanilla ice cream', price: 9.99, cat: 'desserts', ingredients: ['Belgian Chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour', 'Vanilla Ice Cream'], calories: 580, protein: '10g', carbs: '68g', fat: '32g', rating: 4.9, reviews: 478 },
  { id: 602, name: 'Crème Brûlée', emoji: '🍮', desc: 'Vanilla custard, caramelised sugar crust', price: 8.99, cat: 'desserts', ingredients: ['Cream', 'Egg Yolks', 'Vanilla Pod', 'Caster Sugar'], calories: 420, protein: '6g', carbs: '38g', fat: '28g', rating: 4.7, reviews: 312 },
  { id: 603, name: 'Mango Sorbet', emoji: '🍨', desc: 'Fresh mango, coconut milk, mint', price: 6.99, cat: 'desserts', ingredients: ['Fresh Mango', 'Coconut Milk', 'Sugar', 'Lime', 'Mint'], calories: 220, protein: '2g', carbs: '54g', fat: '4g', rating: 4.5, reviews: 189 },
  { id: 604, name: 'Baklava', emoji: '🧁', desc: 'Layered filo, pistachio, honey syrup', price: 7.99, cat: 'desserts', ingredients: ['Filo Pastry', 'Pistachios', 'Walnuts', 'Honey', 'Butter'], calories: 380, protein: '8g', carbs: '52g', fat: '18g', rating: 4.8, reviews: 267 },
  { id: 701, name: 'Fresh Orange Juice', emoji: '🍊', desc: 'Freshly squeezed, no added sugar', price: 4.99, cat: 'drinks', ingredients: ['Fresh Oranges', 'Ice'], calories: 110, protein: '2g', carbs: '26g', fat: '0g', rating: 4.6, reviews: 142 },
  { id: 702, name: 'Mango Smoothie', emoji: '🥭', desc: 'Mango, yoghurt, honey, fresh mint', price: 6.99, cat: 'drinks', ingredients: ['Fresh Mango', 'Greek Yoghurt', 'Honey', 'Mint', 'Ice'], calories: 240, protein: '8g', carbs: '44g', fat: '4g', rating: 4.7, reviews: 198 },
  { id: 703, name: 'Lemonade', emoji: '🍋', desc: 'House-made, sparkling water, fresh mint', price: 4.49, cat: 'drinks', ingredients: ['Fresh Lemons', 'Sparkling Water', 'Cane Sugar', 'Mint'], calories: 120, protein: '0g', carbs: '30g', fat: '0g', rating: 4.5, reviews: 167 },
  { id: 704, name: 'Arabic Coffee', emoji: '☕', desc: 'Cardamom coffee, dates on the side', price: 3.99, cat: 'drinks', ingredients: ['Arabic Coffee', 'Cardamom', 'Saffron', 'Dates'], calories: 45, protein: '1g', carbs: '8g', fat: '1g', rating: 4.8, reviews: 312 },
  { id: 705, name: 'Rose Milkshake', emoji: '🌹', desc: 'Rosewater, milk, ice cream, rose petals', price: 6.49, cat: 'drinks', ingredients: ['Full Cream Milk', 'Vanilla Ice Cream', 'Rosewater', 'Sugar', 'Pistachios'], calories: 380, protein: '10g', carbs: '52g', fat: '16g', rating: 4.6, reviews: 156 },
];
localStorage.setItem('br_menu', JSON.stringify(MENU_DATA));

function toast(msg, type = 'info') {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
  const el = document.createElement('div');
  el.className = 'toast ' + (type === 'ok' || type === 'success' ? 'ok' : type === 'bad' || type === 'error' ? 'bad' : 'info');
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, 3000);
}

const V = {
  required: v => v.trim() ? null : 'This field is required.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : 'Enter a valid email (must include @).',
  minLen: n => v => v.trim().length >= n ? null : 'Minimum ' + n + ' characters.',
  maxLen: n => v => v.trim().length <= n ? null : 'Maximum ' + n + ' characters.',
  phone: v => v.trim() === '' || /^[\+\d][\d\s\-\(\)]{6,14}$/.test(v.trim()) ? null : 'Enter a valid phone number.',
  name: v => /^[a-zA-Z\u0600-\u06FF\s'\-]{2,}$/.test(v.trim()) ? null : 'Enter a valid name (min 2 chars).',
  password: v => v.length >= 6 ? null : 'Password must be at least 6 characters.',
  guests: v => (+v >= 1 && +v <= 10) ? null : 'Select 1–10 guests.',
  futureDate: v => { if (!v) return 'Select a date.'; const d = new Date(v), t = new Date(); t.setHours(0, 0, 0, 0); return d >= t ? null : 'Date cannot be in the past.'; },
  checked: (v, el) => el && el.checked ? null : 'You must agree to continue.',
};

function setErr(id, msg) {
  const f = document.getElementById(id), e = document.getElementById(id + '-e');
  if (f) { f.classList.add('err'); f.classList.remove('ok'); }
  if (e) { e.textContent = msg; e.classList.add('show'); }
}
function setOk(id) {
  const f = document.getElementById(id), e = document.getElementById(id + '-e');
  if (f) { f.classList.remove('err'); f.classList.add('ok'); }
  if (e) e.classList.remove('show');
}
function validateField(id, rules, formEl) {
  const el = document.getElementById(id); if (!el) return true;
  for (const r of rules) { const err = r(el.value, el.type === 'checkbox' ? el : formEl); if (err) { setErr(id, err); return false; } }
  setOk(id); return true;
}
function setupLiveValidation(fields, formEl) {
  Object.entries(fields).forEach(([id, rules]) => {
    const el = document.getElementById(id); if (!el) return;
    el.addEventListener('blur', () => validateField(id, rules, formEl));
    el.addEventListener('input', () => { if (el.classList.contains('err')) validateField(id, rules, formEl); });
  });
}

function initFadeUp() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('in'), i * 80); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}

function initNav() {
  const ham = document.getElementById('ham'), mob = document.getElementById('mob-nav');
  if (ham && mob) {
    ham.addEventListener('click', () => { mob.classList.toggle('open'); ham.classList.toggle('open'); });
    document.addEventListener('click', e => { if (ham && !ham.contains(e.target) && mob && !mob.contains(e.target)) mob.classList.remove('open'); });
  }
  document.querySelectorAll('.theme-toggle').forEach(b => b.addEventListener('click', () => Theme.toggle()));
  Cart.updateBadge();
  Auth.updateNav();
  const btt = document.getElementById('btt');
  if (btt) {
    window.addEventListener('scroll', () => btt.classList.toggle('show', scrollY > 400), { passive: true });
    btt.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  }
}

document.addEventListener('DOMContentLoaded', () => { Theme.init(); initNav(); initFadeUp(); });
