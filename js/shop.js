    document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('shop-sidebar')) {
        loadComponent('shop-sidebar', '../components/sidebar.html', function () {
            setupSidebarFilters();
        });
    }    

    const categoryLinks = document.querySelectorAll('.sidebar-nav a[data-category]');

    categoryLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            filterProducts(category);

            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    filterProducts('all');
});

function filterProducts(category) {
    const container = document.getElementById('product-card-container');
    if (!container) return;

    container.innerHTML = '';

    const filtered = (category === 'all') 
    ? window.products 
    : window.products.filter(product => product.category === category);

    filtered.forEach(product => {
        container.appendChild(createProductCard(product));
    })
}
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    card.setAttribute('data-product-code', product.code);
    card.innerHTML = `
        <a href="product.html?code=${product.code}" class="product-link">
            <div class="product-image">
                <img src="${product.imageUrl}" alt="${product.name}">
            </div>
            <div class="product-meta">
                <div class="product-code-name">
                    <span class="product-code">${product.code} ${product.name}</span>
                </div>
                <div class="product-price">$${product.price}</div>
            </div>
        </a>
    `;
    return card;
}

function setupSidebarFilters() {
    const categoryLinks = document.querySelectorAll('.sidebar-nav a[data-category]');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            filterProducts(category);

            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}
    