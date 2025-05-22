document.addEventListener('DOMContentLoaded', function() {
    // Initialize product state
    let productState = {
        size: null,
        color: null,
        quantity: 1
    };

    let currentColour;

    // Function to initialize color box event listeners
    function colorBoxListener() {
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
    function sizeSelectListener() {
        const sizeSelect = document.querySelector('.size-select');
        if (sizeSelect) {
            sizeSelect.addEventListener('change', function() {
                productState.size = this.value;
                console.log('Selected size:', productState.size);
            });
        }
    }

    // Function to initialize quantity buttons
    function quantityButtonsListener() {
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
    function addToCartListener() {
        const addToCartButton = document.querySelector('.add-button');
        if (addToCartButton) {
            addToCartButton.addEventListener('click', function() {
                const selectedFeatures = getSelectedFeatures();
                if (!product.sizes.includes(selectedFeatures.size)) {
                    alert('Please select a size');
                    return;
                }
                if (!product.colours.includes(selectedFeatures.color)) {
                    alert('Please select a color');
                    return;
                }
                
                let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
                cart.push({
                    productCode: product.code,
                    productName: product.name,
                    price: product.price,
                    ...selectedFeatures
                });
                localStorage.setItem('cartItems', JSON.stringify(cart));
                renderCartSidebar(cart);
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
                    <a class="product-price price" data-aud="${product.price}"></a>
                    <select class="size-select monospace-font placeholder">
                        <option value="" disabled selected>select a size</option>
                        ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                    </select>
                    <div class="color-options">
                        ${product.colours.map(colour => `<div class="color-box ${colour}" data-color="${colour}"></div>`).join('')}
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
        colorBoxListener();
        sizeSelectListener();
        quantityButtonsListener();
        addToCartListener();
    } else {
        const productSection = document.getElementById('product');
        productSection.innerHTML = '<p>Product not found</p>';
    }
});