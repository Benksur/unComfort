// Minimal cart sidebar toggle logic
function toggleCart() {
    console.log('Cart button clicked!');
    // Remove existing box if present
    const existingBox = document.getElementById('cart-sidebar-box');
    if (existingBox) {
        existingBox.remove();
        return;
    }
    // Create a new plain white box
    const box = document.createElement('div');
    box.id = 'cart-sidebar-box';
    box.style.position = 'absolute';
    box.style.top = '0';
    box.style.right = '0';
    box.style.width = '300px';
    box.style.height = '100vh';
    box.style.background = 'white';
    box.style.border = '1px solid #ccc';
    box.style.zIndex = '9999';
    document.body.appendChild(box);
}

// Use event delegation so the cart button always works

document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'cart-toggle') {
        console.log('Cart button clicked!');
        // Remove existing box if present
        const existingBox = document.getElementById('cart-sidebar-box');
        if (existingBox) {
            existingBox.remove();
            return;
        }
        // Create a new plain white box
        const box = document.createElement('div');
        box.id = 'cart-sidebar-box';
        box.style.position = 'absolute';
        box.style.top = '0';
        box.style.right = '0';
        box.style.width = '300px';
        box.style.height = '100vh';
        box.style.background = 'white';
        box.style.border = '1px solid #ccc';
        box.style.zIndex = '9999';
        box.style.boxShadow = '-2px 0 16px rgba(0,0,0,0.09)';
        box.style.display = 'flex';
        box.style.flexDirection = 'column';

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '12px';
        closeBtn.style.right = '16px';
        closeBtn.style.fontSize = '24px';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.color = '#333';
        closeBtn.setAttribute('aria-label', 'Close cart sidebar');
        closeBtn.addEventListener('click', function() {
            box.remove();
        });
        box.appendChild(closeBtn);

        // Content
        const content = document.createElement('div');
        content.style.margin = '48px 24px 0 24px';
        content.style.flex = '1 1 auto';
        content.innerHTML = '<h2 style="font-size: 18px; margin-bottom: 16px;">Cart</h2><p style="color:#666;">Your cart is empty.</p>';
        box.appendChild(content);

        document.body.appendChild(box);
    }
});


function updateQuantity(id, delta) {
    let items = JSON.parse(localStorage.getItem('cartItems')) || [];
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.quantity = Math.max(1, item.quantity + delta);
    localStorage.setItem('cartItems', JSON.stringify(items));
    renderCartSidebar(items);
}

function removeItem(id) {
    let items = JSON.parse(localStorage.getItem('cartItems')) || [];
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items.splice(index, 1);
      localStorage.setItem('cartItems', JSON.stringify(items));
      renderCartSidebar(items);
    }
}

// Initialize cart items and render when page loads
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
        // Render a blank sidebar
        cartSidebar.innerHTML = '';
    }
}

// Initialize cart display when the page loads
window.addEventListener('load', () => {
    renderCartSidebar(cartItems);
});

// Expose functions globally for HTML onclick
window.toggleCart = toggleCart;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;

// Attach event handler for cart toggle after DOM is ready
window.addEventListener('DOMContentLoaded', function() {
    var cartToggle = document.getElementById('cart-toggle');
    if (cartToggle) {
        cartToggle.addEventListener('click', toggleCart);
    }
});