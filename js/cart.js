// created by ty behnke - 47069374

/*
 * closes cart sidebar
 */
function closeCart(box) {
    box.classList.remove('show');
    box.classList.add('hide');
    box.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'opacity') {
            box.removeEventListener('transitionend', handler);
            box.remove();
        }
    });
}

/*
 * creates and displays cart sidebar
 */
function createCartSidebar() {
    // container
    const box = document.createElement('div');
    box.id = 'cart-sidebar-box';
    // close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'cart-close-btn';
    // close button listener
    closeBtn.addEventListener('click', () => {
        closeCart(box);
    });
    box.appendChild(closeBtn);

    // content area for cart items
    const content = document.createElement('div');
    content.className = 'cart-content';
    box.appendChild(content);
    document.body.appendChild(box);
    
    // load cart items from local storage
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    renderCartSidebar(items);

    // trigger reflow
    void box.offsetHeight;
    box.classList.add('show');
}

/*
 * toggles cart sidebar
 */
function toggleCart() {
    // check if sidebar is already open, if so then close
    const existingBox = document.getElementById('cart-sidebar-box');
    if (existingBox) {
        closeCart(existingBox);
    // open sidebar if not already open
    } else {
        createCartSidebar();
    }
}

/*
 * updates quantity of item in cart
 */
function updateQuantity(productCode, delta) {
    // fetch items from local storage or return empty array
    let items = JSON.parse(localStorage.getItem('cartItems')) || [];
    // find item by product code
    const item = items.find(i => i.productCode === productCode);
    if (!item) return;
    // update quantity, ensure it is not less than 1
    item.quantity = Math.max(1, item.quantity + delta);
    // save updated items to local storage
    localStorage.setItem('cartItems', JSON.stringify(items));
    // re-render cart sidebar with new changes
    renderCartSidebar(items);
}

/*
 * removes item from cart
 */
function removeItem(productCode) {
    // fetch items from local storage or return empty array
    let items = JSON.parse(localStorage.getItem('cartItems')) || [];
    // find index of item to remove
    const index = items.findIndex(i => i.productCode === productCode);
    // if item is found, remove it
    if (index !== -1) {
        items.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(items));
        renderCartSidebar(items);
    }
}

/*
 * renders cart sidebar
 */
function renderCartSidebar(items) {
    // fetch cart id
    let box = document.getElementById('cart-sidebar-box');
    // if not open, create it
    if (!box) {
        createCartSidebar(); // create if missing
        box = document.getElementById('cart-sidebar-box');
    }
    // fetch content area
    const content = box.querySelector('.cart-content');
    // render cart dynamically
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
    // update prices and total after rendering
    if (window.updateAllPrices) window.updateAllPrices();
    // update total
    window.updateCartTotal && window.updateCartTotal();
}

/*
 * global function to update cart total price (for currency changes)
 */
window.updateCartTotal = function() {
    // fetch cart items
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    const currency = localStorage.getItem('selectedCurrency');
    // from currency.js, formatPrice() converts the aud default to the selected currency
    if (window.formatPrice) {
        // for all items, add price * quantity to get total price
        const total = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
        const totalEl = document.getElementById('cart-total-price');
        // if total > 0, convert currency and display
        if (totalEl) totalEl.textContent = window.formatPrice(total, currency);
    }
};

/*
 * global access
 */
window.toggleCart = toggleCart;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;

/*
 * add listener to cart nav link
 */
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'cart-toggle') {
        toggleCart();
    }
});
