// created by ty behnke - 47069374

// global access to featured cards
window.initFeaturedCards = initFeaturedCards;

/*
 * initialise and create featured card section
 */
function initFeaturedCards() {
    // query all featured cards from html
    const featuredCards = document.querySelectorAll('.featured-card');
    // helper to format image url and create colour data
    function createProductColors(colourBoxes, productCode) {
        const colours = {};
        // for each color, create an object with the colour name and image url
        colourBoxes.forEach(box => {
            const colour = box.getAttribute('data-color');
            colours[colour.toLowerCase()] = {
                url: `/unComfort/img/${productCode}_${colour.toLowerCase()}.jpg`,
                name: colour.charAt(0).toUpperCase() + colour.slice(1),
            };
        });
        return colours;
    }
    // format price for each card
    featuredCards.forEach(card => {
        // get price data
        const audPrice = parseFloat(card.getAttribute('data-aud'));
        if (!isNaN(audPrice)) {
            let priceEl = card.querySelector('.featured-price');
            if (!priceEl) {
                priceEl = document.createElement('span');
                priceEl.className = 'featured-price price';
                priceEl.setAttribute('data-aud', audPrice);
                // insert price element
                const title = card.querySelector('.product-title');
                if (title) title.insertAdjacentElement('afterend', priceEl);
            } else {
                priceEl.setAttribute('data-aud', audPrice);
            }
        }

        // featured card elements 
        const colorBoxes = card.querySelectorAll('.color-box');
        const productCode = card.getAttribute('data-product-code');
        const productImage = card.querySelector(`#product-image-${productCode}`);
        const productTitle = card.querySelector('.product-title');
        const originalTitle = productTitle.textContent;
        const productColors = createProductColors(colorBoxes, productCode);
        // set first color as active by default
        if (colorBoxes.length > 0) {
            colorBoxes[0].classList.add('active');
            // set initial image
            const initialColor = colorBoxes[0].getAttribute('data-color');
            if (productColors[initialColor]) {
                productImage.src = productColors[initialColor].url;
            }
        }
        // add click event to each color box
        colorBoxes.forEach(box => {
            box.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation(); // prevent card click when color is clicked
                // remove active class from all colors in this card
                card.querySelectorAll('.color-box').forEach(b => b.classList.remove('active'));
                // add active class to clicked color
                this.classList.add('active');
                // get color from data attribute
                const color = this.getAttribute('data-color');
                // update product title to include color
                if (productColors[color]) {
                    productTitle.textContent = `${originalTitle} - ${productColors[color].name}`;
                }
                // fade out current image
                productImage.style.opacity = '0.7';
                setTimeout(() => {
                    if (productColors[color] && productColors[color].url) {
                        productImage.src = productColors[color].url;
                    }
                    // fade in new image
                    setTimeout(() => {
                        productImage.style.opacity = '1';
                    }, 100);
                }, 200);
            });
        });
    });
} 