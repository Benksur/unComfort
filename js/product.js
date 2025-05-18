document.addEventListener('DOMContentLoaded', function() {

    const urlParams = new URLSearchParams(window.location.search);
    const productCode = urlParams.get('code');

    const product = window.products.find(p => p.code === productCode);

    if (product) {
        const productSection = document.getElementById('product');
        
        productSection.innerHTML = `
            <div class="product-page-container">
                <div class="product-information-container">
                    <div class="product-code-name">
                        <a class="product-page-title">${product.code} ${product.name}</a>
                        <a class="product-about">${product.materials}</a>
                        <a class="product-about">manufactured in australia</a>
                    </div>
                </div>
                <div class="product-image-container">
                    <div class="product-card">
                        <img src="../../${product.imageUrl}" alt="${product.name}">
                        <img src="../../img/${product.code}_1.jpg" alt="${product.name}">
                        <img src="../../img/${product.code}_2.jpg" alt="${product.name}">
                        <img src="../../img/${product.code}_3.jpg" alt="${product.name}">
                        <img src="../../img/${product.code}_4.jpg" alt="${product.name}">
                    </div>
                </div>
                <div class="product-add-container">
                    <select class="size-select">
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </div>
            </div>
        `;
    } else {
        const productSection = document.getElementById('product');
        productSection.innerHTML = '<p>Product not found</p>';
    }
});