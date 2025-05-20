
const zones = [0.4, 0.17, 0.18, 0.18, 0.17];

function updateActiveImage() {
    const scrollY = window.scrollY;
    const asideImages = document.querySelectorAll('.lookbook-section aside img');
    const imageContainer = document.querySelector('.lookbook-image-container');
    const { top, height } = imageContainer.getBoundingClientRect();
    const containerTop = top + scrollY;
    const scrollOffset = scrollY + window.innerHeight - containerTop;

    let accumulated = 0;
    let activeIndex = zones.findIndex(zone => {
        accumulated += zone * height;
        return scrollOffset <= accumulated;
    });

    if (activeIndex === -1) activeIndex = zones.length - 1;

    asideImages.forEach((img, i) => {
        img.classList.toggle('active', i === activeIndex);
    });
}

function setupAsideImageClicks() {
    const asideImages = document.querySelectorAll('.lookbook-section aside img');
    const imageContainer = document.querySelector('.lookbook-image-container');

    asideImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            const { top, height } = imageContainer.getBoundingClientRect();
            const containerTop = top + window.scrollY;

            const offset = zones.slice(0, index).reduce((acc, z) => acc + z * height, 0);

            const targetPosition = containerTop + offset - window.innerHeight + 50;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}


window.addEventListener('scroll', updateActiveImage);
updateActiveImage();
setupAsideImageClicks();