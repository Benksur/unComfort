document.addEventListener('DOMContentLoaded', function() {
    // Initialize product state
    let productState = {
        size: null,
        color: null,
        quantity: 1
    };

    let currentColour;

    // Function to initialize color box event listeners
    function initializeColorBoxListeners() {
        const colorBoxes = document.querySelectorAll('.color-box');
        colorBoxes.forEach(box => {
            box.addEventListener('click', function() {
                // Remove active class from all color boxes
                colorBoxes.forEach(b => b.classList.remove('active'));
                // Add active class to the clicked box
                this.classList.add('active');
                // Update both product state and currentColour
                productState.color = this.getAttribute('data-color');
                currentColour = this.getAttribute('data-color');
                console.log('Selected color:', productState.color);
                
                // Update the main product image
                const mainImage = document.querySelector('.product-card img:first-child');
                if (mainImage) {
                    mainImage.src = `../../img/${product.code}_${currentColour}.jpg`;
                }
            });
        });
    }

    // Function to initialize size select event listener
    function initializeSizeSelect() {
        const sizeSelect = document.querySelector('.size-select');
        if (sizeSelect) {
            sizeSelect.addEventListener('change', function() {
                productState.size = this.value;
                console.log('Selected size:', productState.size);
            });
        }
    }

    // Function to initialize quantity buttons
    function initializeQuantityButtons() {
        const addNumberButtons = document.querySelectorAll('.add-number-button');
        const addNumberInput = document.querySelector('.add-number-input');

        addNumberButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.textContent;
                if (action === '+') {
                    productState.quantity = parseInt(addNumberInput.textContent) + 1;
                    addNumberInput.textContent = productState.quantity;
                } else if (action === '-' && productState.quantity > 1) {
                    productState.quantity = parseInt(addNumberInput.textContent) - 1;
                    addNumberInput.textContent = productState.quantity;
                }
                console.log('Selected quantity:', productState.quantity);
            });
        });
    }

    // Function to get current product state
    function getSelectedFeatures() {
        return {
            size: productState.size,
            color: productState.color,
            quantity: productState.quantity
        };
    }

    // Function to initialize add to cart button
    function initializeAddToCart() {
        const addToCartButton = document.querySelector('.add-button');
        if (addToCartButton) {
            addToCartButton.addEventListener('click', function() {
                const selectedFeatures = getSelectedFeatures();
                console.log('Adding to cart:', selectedFeatures);
                
                // Here you would typically send this data to your cart system
                // For now, we'll just log it
                console.log('Product added to cart:', {
                    productCode: product.code,
                    productName: product.name,
                    price: product.price,
                    ...selectedFeatures
                });
            });
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const productCode = urlParams.get('code');

    const product = window.products.find(p => p.code === productCode);
    if (product) {
        currentColour = product.colours[0];

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
                        <img src="../../img/${product.code}_${currentColour}.jpg" alt="${product.name}">
                        <img src="../../img/${product.code}_1.jpg" alt="${product.name}">
                        <img src="../../img/${product.code}_2.jpg" alt="${product.name}">
                        <img src="../../img/${product.code}_3.jpg" alt="${product.name}">
                        <img src="../../img/${product.code}_4.jpg" alt="${product.name}">
                    </div>
                </div>
                <div class="product-add-container">
                    <a class="product-price">$${product.price}</a>
                    <select class="size-select monospace-font placeholder">
                        <option value="" disabled selected>select a size</option>
                        <option value="small">small</option>
                        <option value="medium">medium</option>
                        <option value="large">large</option>
                    </select>
                    <div class="color-options">
                        <div class="color-box gray" data-color="gray"></div>
                        <div class="color-box brown" data-color="brown"></div>
                    </div>
                    <div class="add-to-cart ">
                        <button class="add-number-button monospace-font">-</button>
                        <a class="add-number-input monospace-font" value="1">1</a>
                        <button class="add-number-button monospace-font">+</button>
                        <button class="add-button monospace-font">add to cart</button>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize all event listeners
        initializeColorBoxListeners();
        initializeSizeSelect();
        initializeQuantityButtons();
        initializeAddToCart();
    } else {
        const productSection = document.getElementById('product');
        productSection.innerHTML = '<p>Product not found</p>';
    }
});