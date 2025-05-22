// created by ty behnke - 47069374

// load shop to DOM
document.addEventListener('DOMContentLoaded', function () {
    // load sidebar
    if (document.getElementById('shop-sidebar')) {
        loadComponent('shop-sidebar', '/unComfort/components/sidebar.html', function () {
            setupSidebarFilters();
        });
    }    
    // load products
    const categoryLinks = document.querySelectorAll('.sidebar-nav a[data-category]');
    // add click listeners to category filter links
    categoryLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            filterProducts(category);
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    // default page to load all products
    filterProducts('all');
});

/*
 * filter products based on category
 */
function filterProducts(category) {
    const container = document.getElementById('product-card-container');
    if (!container) return;
    // empty container
    container.innerHTML = '';
    // filter products based on category, default to all
    const filtered = (category === 'all') 
    ? window.products 
    : window.products.filter(product => product.category === category);
    // create product cards
    filtered.forEach(product => {
        container.appendChild(createProductCard(product));
    });
    // currency convert
    if (window.updateAllPrices) window.updateAllPrices();
}

/*
 * create product card
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    card.setAttribute('data-product-code', product.code);
    let imageUrl = product.imageUrl;
    // inject html dynamically
    card.innerHTML = `
        <a href="product.html?code=${product.code}" class="product-link">
            <div class="product-image">
                <img src="${imageUrl}" alt="${product.name}" class="product-img-hover">
            </div>
            <div class="product-meta">
                <div class="product-code-name">
                    <span class="product-code">${product.code} ${product.name}</span>
                </div>
                <div><span class="price" data-aud="${product.price}"></span></div>
            </div>
        </a>
    `;
    // add hover event listeners to swap image
    const img = card.querySelector('.product-img-hover');
    img.addEventListener('mouseover', () => {
        img.src = '/unComfort/img/' + product.code + '_1.jpg';
    });
    img.addEventListener('mouseout', () => {
        img.src = product.imageUrl;
    });
    return card;
}

/*
 * setup sidebar filters
 * add click listeners to category filter links
 */
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
    