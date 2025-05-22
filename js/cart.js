function createCartSidebar() {
    const box = document.createElement('div');
    box.id = 'cart-sidebar-box';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'cart-close-btn';
    closeBtn.setAttribute('aria-label', 'Close cart sidebar');
    closeBtn.addEventListener('click', () => {
        box.classList.remove('show');
        box.classList.add('hide');
        box.addEventListener('transitionend', function handler(e) {
            if (e.propertyName === 'opacity') {
                box.removeEventListener('transitionend', handler);
                box.remove();
            }
        });
    });
    box.appendChild(closeBtn);

    // Content
    const content = document.createElement('div');
    content.className = 'cart-content';
    box.appendChild(content);

    document.body.appendChild(box);

    // Always render the latest cart
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    renderCartSidebar(items);

    // Force reflow and add .show for transition
    void box.offsetHeight;
    box.classList.add('show');
}


function toggleCart() {
    const existingBox = document.getElementById('cart-sidebar-box');
    if (existingBox) {
        existingBox.classList.remove('show');
        existingBox.classList.add('hide');
        existingBox.addEventListener('transitionend', function handler(e) {
            if (e.propertyName === 'opacity') {
                existingBox.removeEventListener('transitionend', handler);
                existingBox.remove();
            }
        });
    } else {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        renderCartSidebar(items);
    }
}

function updateQuantity(productCode, delta) {
    let items = JSON.parse(localStorage.getItem('cartItems')) || [];
    const item = items.find(i => i.productCode === productCode);
    if (!item) return;
    item.quantity = Math.max(1, item.quantity + delta);
    localStorage.setItem('cartItems', JSON.stringify(items));
    renderCartSidebar(items);
}

function removeItem(productCode) {
    let items = JSON.parse(localStorage.getItem('cartItems')) || [];
    const index = items.findIndex(i => i.productCode === productCode);
    if (index !== -1) {
        items.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(items));
        renderCartSidebar(items);
    }
}

function renderCartSidebar(items) {
    let box = document.getElementById('cart-sidebar-box');
    if (!box) {
        createCartSidebar(); // create if missing
        box = document.getElementById('cart-sidebar-box');
    }

    const content = box.querySelector('.cart-content');
    content.innerHTML = `
        <h2>Cart</h2>
        ${items.length === 0
            ? `<p>Your cart is empty.</p>`
            : items.map(item => `
                <div class="cart-item" data-id="${item.productCode}">
                    <p><strong>${item.productCode} ${item.productName}</strong></p>
                    <p>price: <span class="price" data-aud="${item.price}"></span></p>
                    <p>size: ${item.size}</p>
                    <p>color: ${item.color}</p>
                    <p>qty: 
                        <button onclick="updateQuantity('${item.productCode}', -1)">−</button>
                        ${item.quantity || 1}
                        <button onclick="updateQuantity('${item.productCode}', 1)">+</button>
                    </p>
                    <button onclick="removeItem('${item.productCode}')">remove</button>
                </div>
            `).join('')}
            <hr>
            <p style="margin-top: 1rem;">total: <span id="cart-total-price" data-total></span></p>
            <button class="add-button" onclick="window.location.href='/unComfort/pages/checkout.html'">checkout</button>
    `;
    // Update prices and total after rendering
    if (window.updateAllPrices) window.updateAllPrices();
    // Update total
    window.updateCartTotal && window.updateCartTotal();
}

// Global function to update cart total price (for currency changes)
window.updateCartTotal = function() {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    const currency = localStorage.getItem('selectedCurrency');
    if (window.formatPrice) {
        const total = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
        const totalEl = document.getElementById('cart-total-price');
        if (totalEl) totalEl.textContent = window.formatPrice(total, currency);
    }
};
// Global access
window.toggleCart = toggleCart;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;

// Event delegation for the cart toggle button
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'cart-toggle') {
        toggleCart();
    }
});
