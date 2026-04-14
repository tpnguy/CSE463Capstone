// ============================================================
// CART INTERCEPT SCRIPT
// Add this <script> block just before </body> in cupcakes.html
// ============================================================

function setupLocalCart() {
    const CART_KEY = 'tc_cart';
    const BASE_IMG = 'https://www.torontocupcake.com/images/cupcakes_flavours/';

    // --- Helper: load cart array from localStorage ---
    function loadCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch {
            return [];
        }
    }

    // --- Helper: save cart array to localStorage ---
    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    // --- Helper: add/increment an item in the cart ---
    function addToCart(item) {
        const cart = loadCart();
        // Match on name AND group so "Chocolate Peanut Butter" (Cupcakes)
        // and a holiday item with the same name don't merge
        const existing = cart.find(c => c.name === item.name && c.group === item.group);
        if (existing) {
            existing.qty += item.qty;
        } else {
            cart.push(item);
        }
        saveCart(cart);
    }

    // --- Helper: show a brief "Added to cart!" toast near the button ---
    function showToast(submitBtn, name) {
        // Remove any existing toast first
        const old = document.getElementById('tc-toast');
        if (old) old.remove();

        const toast = document.createElement('div');
        toast.id = 'tc-toast';
        toast.textContent = `✓ ${name} added!`;
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            background: #f493c1;
            color: #fff;
            padding: 10px 22px;
            border-radius: 24px;
            font-size: 1rem;
            font-weight: bold;
            box-shadow: 0 4px 14px rgba(0,0,0,0.18);
            z-index: 9999;
            opacity: 1;
            transition: opacity 0.4s ease;
            pointer-events: none;
        `;
        document.body.appendChild(toast);

        // Fade out after 1.8s, remove after 2.2s
        setTimeout(() => { toast.style.opacity = '0'; }, 1800);
        setTimeout(() => { toast.remove(); }, 2200);
    }

    // --- Intercept all CGI cart forms ---
    const cartForms = document.querySelectorAll("form[action='/cgi-bin/html-cart/html-cart.cgi']");

    cartForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Stop the real POST

            // Read hidden fields
            const name     = (form.querySelector('[name="name"]')?.value     || '').trim();
            const group    = (form.querySelector('[name="group"]')?.value    || '').trim();
            const price    = parseFloat(form.querySelector('[name="price"]')?.value || '0');
            const image    = (form.querySelector('[name="image"]')?.value    || '').trim();
            const qtyInput = form.querySelector('[name="qty"]');
            const qty      = qtyInput ? Math.max(1, parseInt(qtyInput.value) || 1) : 1;

            if (!name || isNaN(price)) return; // Safety check

            addToCart({ name, group, price, image, qty });

            const submitBtn = form.querySelector('[type="submit"]');
            showToast(submitBtn, name);

            // Reset qty back to 1 after adding
            if (qtyInput) qtyInput.value = 1;
        });
    });

    // --- Update cart count badge in nav (if you add one later) ---
    function updateCartBadge() {
        const cart = loadCart();
        const total = cart.reduce((sum, item) => sum + item.qty, 0);
        const badge = document.getElementById('cart-count-badge');
        if (badge) {
            badge.textContent = total;
            badge.style.display = total > 0 ? 'inline' : 'none';
        }
    }

    updateCartBadge();
}

document.addEventListener('DOMContentLoaded', setupLocalCart);