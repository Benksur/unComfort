window.products = [
    {
        code: '8017',
        name: 'WINDGUARD OVERCOAT',
        price: 180,
        category: 'outerwear',
        imageUrl: '../img/8017_gray.jpg',
        materials: "Shell: 77% Cotton, 23% Nylon/ Lining: 100% Polyester/ Hood: 100% Nylon/ Hood: Storage Bag: 100% Polyester/ Side Pocket Fabric: Outer Layer: 100% Polyester/ Side Pocket Fabric: Inner Layer: 77% Cotton, 23% Nylon"
    },
    {
        code: '8004',
        name: 'RELAXED FLEECE',
        price: 140,
        category: 'hoodies',
        imageUrl: '../img/8004_gray.jpg'
    },
    {
        code: '8010',
        name: 'RELAXED COLLARED',
        price: 95,
        category: 'tees',
        imageUrl: '../img/8010_beige.jpg'
    },
    {
        code: '8001',
        name: 'LIGHT STRINGER',
        price: 40,
        category: 'singlets',
        imageUrl: '../img/8001_black.jpg'
    },
    {
        code: '8023',
        name: 'KNEECUT JORTS',
        price: 100,
        category: 'shorts',
        imageUrl: '../img/8023_black.jpg'
    },
    {
        code: '8003',
        name: 'WIDECUT CHINO',
        price: 140,
        category: 'bottoms',
        imageUrl: '../img/8003_black.jpg'
    },
    {
        code: '8017',
        name: 'WINDGUARD OVERCOAT',
        price: 180,
        category: 'outerwear',
        imageUrl: '../img/8017_gray.jpg'
    },
    {
        code: '8004',
        name: 'RELAXED FLEECE',
        price: 140,
        category: 'hoodies',
        imageUrl: '../img/8004_gray.jpg'
    },
    {
        code: '8010',
        name: 'RELAXED COLLARED',
        price: 95,
        category: 'tees',
        imageUrl: '../img/8010_beige.jpg'
    },
    {
        code: '8001',
        name: 'LIGHT STRINGER',
        price: 40,
        category: 'singlets',
        imageUrl: '../img/8001_black.jpg'
    },
    {
        code: '8023',
        name: 'KNEECUT JORTS',
        price: 100,
        category: 'shorts',
        imageUrl: '../img/8023_black.jpg'
    },
    {
        code: '8003',
        name: 'WIDECUT CHINO',
        price: 140,
        category: 'bottoms',
        imageUrl: '../img/8003_black.jpg'
    },
    
]
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
    