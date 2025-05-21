// Remove the automatic initialization since it's now handled in components.js
// document.addEventListener('DOMContentLoaded', function () {
//     initFeaturedCards();
// });

function initFeaturedCards() {
    // Get all featured cards on the page
    const featuredCards = document.querySelectorAll('.featured-card');
    console.log('Found featured cards:', featuredCards.length);

    // Function to create product color data
    function createProductColors(colorBoxes, productCode) {
        const colors = {};
        colorBoxes.forEach(box => {
            const color = box.getAttribute('data-color');
            colors[color.toLowerCase()] = {
                url: `../img/${productCode}_${color.toLowerCase()}.jpg`,
                name: color.charAt(0).toUpperCase() + color.slice(1),
            };
        });
        console.log('Created color data:', colors);
        return colors;
    }

    featuredCards.forEach(card => {
        // --- Currency price rendering ---
        const audPrice = parseFloat(card.getAttribute('data-aud'));
        if (!isNaN(audPrice)) {
            let priceEl = card.querySelector('.featured-price');
            if (!priceEl) {
                priceEl = document.createElement('span');
                priceEl.className = 'featured-price price';
                priceEl.setAttribute('data-aud', audPrice);
                // Insert price element at a logical location (e.g., after title)
                const title = card.querySelector('.product-title');
                if (title) title.insertAdjacentElement('afterend', priceEl);
            } else {
                priceEl.setAttribute('data-aud', audPrice);
            }
        }

        const colorBoxes = card.querySelectorAll('.color-box');
        console.log('Found color boxes:', colorBoxes.length);

        const productCode = card.getAttribute('data-product-code');
        const productImage = card.querySelector(`#product-image-${productCode}`);
        const productTitle = card.querySelector('.product-title');
        const originalTitle = productTitle.textContent;

        console.log('Product code:', productCode);
        console.log('Initial image src:', productImage.src);

        // Create color data for this specific product using its available colors
        const productColors = createProductColors(colorBoxes, productCode);

        // Set first color as active by default
        if (colorBoxes.length > 0) {
            colorBoxes[0].classList.add('active');
            // Set initial image
            const initialColor = colorBoxes[0].getAttribute('data-color');
            if (productColors[initialColor]) {
                productImage.src = productColors[initialColor].url;
            }
        }

        // Add click event to each color box
        colorBoxes.forEach(box => {
            box.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation(); // Prevent card click when color is clicked

                console.log('Color box clicked:', this.getAttribute('data-color'));

                // Remove active class from all colors in this card
                card.querySelectorAll('.color-box').forEach(b => b.classList.remove('active'));

                // Add active class to clicked color
                this.classList.add('active');

                // Get color from data attribute
                const color = this.getAttribute('data-color');
                console.log('Selected color:', color);

                // Update product title to include color
                if (productColors[color]) {
                    productTitle.textContent = `${originalTitle} - ${productColors[color].name}`;
                }

                // Update product image based on color
                // Fade out current image
                productImage.style.opacity = '0.7';

                setTimeout(() => {
                    if (productColors[color] && productColors[color].url) {
                        console.log('Changing image to:', productColors[color].url);
                        productImage.src = productColors[color].url;
                    }

                    // Fade in new image
                    setTimeout(() => {
                        productImage.style.opacity = '1';
                    }, 100);
                }, 200);
            });
        });

        // Make the whole card clickable (would navigate to product page in real app)
        card.addEventListener('click', function () {
            // Get the active color
            const activeColor = card.querySelector('.color-box.active');
            const color = activeColor ? activeColor.getAttribute('data-color') : 'gray';

            console.log(`Card clicked - would navigate to product page for ${color} variant`);
            // In a real app: window.location.href = `product-details.html?id=${productCode}&color=${color}`;
        });
    });
} 