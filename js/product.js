// created by ty behnke - 47069374

// product page main logic
document.addEventListener('DOMContentLoaded', function() {
    // initialize product state
    let productState = {
        size: null,
        color: null,
        quantity: 1
    };
    let currentColour;
    // helper to initialize color box event listeners
    function colorBoxListener() {
        const colorBoxes = document.querySelectorAll('.color-box');
        colorBoxes.forEach(box => {
            box.addEventListener('click', function() {
                // remove active class from all color boxes
                colorBoxes.forEach(b => b.classList.remove('active'));
                // add active class to the clicked box
                this.classList.add('active');
                // update both product state and currentColour
                productState.color = this.getAttribute('data-color');
                currentColour = this.getAttribute('data-color');
                // update the main product image
                const mainImage = document.querySelector('.product-card img:first-child');
                if (mainImage) {
                    mainImage.src = `/unComfort/img/${product.code}_${currentColour}.jpg`;
                }
            });
        });
    }
    // helper to initialize size select event listener
    function sizeSelectListener() {
        const sizeSelect = document.querySelector('.size-select');
        if (sizeSelect) {
            sizeSelect.addEventListener('change', function() {
                productState.size = this.value;
                console.log('Selected size:', productState.size);
            });
        }
    }
    // helper to initialize quantity buttons
    function quantityButtonsListener() {
        const addNumberButtons = document.querySelectorAll('.add-number-button');
        const addNumberInput = document.querySelector('.add-number-input');
        // add click event to each button
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
            });
        });
    }
    // helper to get current product state
    function getSelectedFeatures() {
        return {
            size: productState.size,
            color: productState.color,
            quantity: productState.quantity
        };
    }
    // helper to initialize add to cart button
    function addToCartListener() {
        const addToCartButton = document.querySelector('.add-button');
        if (addToCartButton) {
            addToCartButton.addEventListener('click', function() {
                // fetch selected product data
                const selectedFeatures = getSelectedFeatures();
                // if size not selected, alert user
                if (!product.sizes.includes(selectedFeatures.size)) {
                    alert('Please select a size');
                    return;
                }
                // same for colour
                if (!product.colours.includes(selectedFeatures.color)) {
                    alert('Please select a colour');
                    return;
                }
                // add to cart
                let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
                cart.push({
                    productCode: product.code,
                    productName: product.name,
                    price: product.price,
                    ...selectedFeatures
                });
                // save to local storage
                localStorage.setItem('cartItems', JSON.stringify(cart));
                // pop up current cart status to show something happened.
                renderCartSidebar(cart);
            });
        }
    }
    // get product code from url
    const urlParams = new URLSearchParams(window.location.search);
    const productCode = urlParams.get('code');
    // find product
    const product = window.products.find(p => p.code === productCode);
    if (product) {
        currentColour = product.colours[0];
        // create product section
        const productSection = document.getElementById('product');
        // inject html
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
                        <img src="../img/${product.code}_${currentColour}.jpg" alt="${product.name}">
                        <img src="../img/${product.code}_1.jpg" alt="${product.name}">
                        <img src="../img/${product.code}_2.jpg" alt="${product.name}">
                        <img src="../img/${product.code}_3.jpg" alt="${product.name}">
                        <img src="../img/${product.code}_4.jpg" alt="${product.name}">
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
        // initialize all event listeners
        colorBoxListener();
        sizeSelectListener();
        quantityButtonsListener();
        addToCartListener();
    // failsafe is user types in wrong url
    } else {
        const productSection = document.getElementById('product');
        productSection.innerHTML = '<p>Product not found</p>';
    }
});