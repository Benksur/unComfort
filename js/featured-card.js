document.addEventListener('DOMContentLoaded', function() {
    // Initialize featured card functionality
    initFeaturedCards();
});

function initFeaturedCards() {
    // Get all featured cards on the page
    const featuredCards = document.querySelectorAll('.featured-card');
    
    // Product image data for different colors
    // In a real application, this data would come from a database or API
    const productColors = {
        'black': {
            url: '../img/yesh.jpg', // Default image
            name: 'Black',
        },
        'olive': {
            url: '../img/yesh.jpg', // In a real app, these would be different images
            name: 'Olive Green',
        },
        'grey': {
            url: '../img/yesh.jpg',
            name: 'Grey',
        },
        'brown': {
            url: '../img/yesh.jpg',
            name: 'Brown',
        }
    };
    
    featuredCards.forEach(card => {
        const colorBoxes = card.querySelectorAll('.color-box');
        const productImage = card.querySelector('#product-image');
        const productTitle = card.querySelector('.product-title');
        const originalTitle = productTitle.textContent;
        
        // Set first color as active by default
        if (colorBoxes.length > 0) {
            colorBoxes[0].classList.add('active');
        }
        
        // Add click event to each color box
        colorBoxes.forEach(box => {
            box.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent card click when color is clicked
                
                // Remove active class from all colors
                colorBoxes.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked color
                this.classList.add('active');
                
                // Get color from data attribute
                const color = this.getAttribute('data-color');
                
                // Update product title to include color
                if (productColors[color]) {
                    productTitle.textContent = `${originalTitle} - ${productColors[color].name}`;
                }
                
                // Update product image based on color
                // Fade out current image
                productImage.style.opacity = '0.7';
                
                setTimeout(() => {
                    // In a real app, we would update the source to a different image
                    if (productColors[color] && productColors[color].url) {
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
        card.addEventListener('click', function() {
            // Get the active color
            const activeColor = card.querySelector('.color-box.active');
            const color = activeColor ? activeColor.getAttribute('data-color') : 'black';
            
            console.log(`Card clicked - would navigate to product page for ${color} variant`);
            // In a real app: window.location.href = `product-details.html?id=123&color=${color}`;
        });
    });
} 