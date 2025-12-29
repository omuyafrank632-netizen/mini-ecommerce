// Utility: persist and read from localStorage
const storage = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};

// Theme toggle
(function initTheme() {
  const saved = storage.get('theme', 'light');
  if (saved === 'dark') document.body.classList.add('dark');
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      storage.set('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    });
  }
})();

// Header year
(function setYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// Dynamic greeting + date (Home)
(function greetingAndDate() {
  const g = document.getElementById('greeting');
  const d = document.getElementById('todayDate');
  if (!g || !d) return;
  const now = new Date();
  const hour = now.getHours();
  let greet = 'Good evening';
  if (hour < 12) greet = 'Good morning';
  else if (hour < 17) greet = 'Good afternoon';
  g.textContent = `${greet}, welcome to Karibu Bakery`;
  d.textContent = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
})();

// Cart count handling
(function cartInit() {
  const cartCountEl = document.getElementById('cartCount');
  const updateCount = () => {
    const count = storage.get('cartCount', 0);
    if (cartCountEl) cartCountEl.textContent = count;
  };
  updateCount();

  const addButtons = document.querySelectorAll('.add-to-cart');
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = storage.get('cartCount', 0);
      storage.set('cartCount', current + 1);
      updateCount();
      btn.textContent = 'Added!';
      setTimeout(() => (btn.textContent = 'Add to Cart'), 1000);
    });
  });
})();

// Contact form validation
(function contactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const messageEl = document.getElementById('message');
  const nameErr = document.getElementById('nameError');
  const emailErr = document.getElementById('emailError');
  const messageErr = document.getElementById('messageError');
  const successEl = document.getElementById('formSuccess');

  const hasAt = email => email.includes('@'); // simple check per requirement

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Name
    if (!nameEl.value.trim()) {
      nameErr.textContent = 'Please enter your name.';
      valid = false;
    } else {
      nameErr.textContent = '';
    }

    // Email
    const emailVal = emailEl.value.trim();
    if (!emailVal) {
      emailErr.textContent = 'Please enter your email.';
      valid = false;
    } else if (!hasAt(emailVal)) {
      emailErr.textContent = 'Email must contain "@".';
      valid = false;
    } else {
      emailErr.textContent = '';
    }

    // Message
    if (!messageEl.value.trim()) {
      messageErr.textContent = 'Please write a message.';
      valid = false;
    } else {
      messageErr.textContent = '';
    }

    if (valid) {
      successEl.textContent = 'Thanks! Your message was received.';
      form.reset();
      setTimeout(() => (successEl.textContent = ''), 3000);
    }
  });
})();
