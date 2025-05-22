// created by ty behnke - 47069374

// page size ratios of cards
const zones = [0.4, 0.17, 0.18, 0.18, 0.17];

/*
 * update active image based on page scroll position
 */
function updateActiveImage() {
    const scrollY = window.scrollY;
    const asideImages = document.querySelectorAll('.lookbook-section aside img');
    const imageContainer = document.querySelector('.lookbook-image-container');
    const { top, height } = imageContainer.getBoundingClientRect();
    const containerTop = top + scrollY;
    const scrollOffset = scrollY + window.innerHeight - containerTop;
    // check which zone the scroll offset is in
    let accumulated = 0;
    let activeIndex = zones.findIndex(zone => {
        accumulated += zone * height;
        return scrollOffset <= accumulated;
    });
    // if scroll offset is past last zone, set active index to last zone
    if (activeIndex === -1) activeIndex = zones.length - 1;
    // toggle which aside image is active
    asideImages.forEach((img, i) => {
        img.classList.toggle('active', i === activeIndex);
    });
}

/*
 * setup aside image clicks
 */
function setupAsideImageClicks() {
    const asideImages = document.querySelectorAll('.lookbook-section aside img');
    const imageContainer = document.querySelector('.lookbook-image-container');
    // add click listener to each aside image
    asideImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            const { top, height } = imageContainer.getBoundingClientRect();
            const containerTop = top + window.scrollY;
            // calculate offset of clicked image
            const offset = zones.slice(0, index).reduce((acc, z) => acc + z * height, 0);
            // calculate target position
            const targetPosition = containerTop + offset - window.innerHeight + 50;
            // scroll to target position
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// scroll and click listeners
window.addEventListener('scroll', updateActiveImage);
updateActiveImage();
setupAsideImageClicks();