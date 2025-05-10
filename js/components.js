document.addEventListener('DOMContentLoaded', function () {
    loadComponent('navbar-container', 'components/navbar.html', function () {
        setupNavbarScrollColor();
        console.log('Navbar scroll color change setup completed');
    });

    // Load featured card component
    loadComponent('featured-card-container', 'components/featured-card.html', function () {
        console.log('Featured card component loaded');
        // Initialize featured cards after the component is loaded
        initFeaturedCards();
    });
});

const scrollers = document.querySelectorAll('.scroller');

if (!window.matchMedia("(prefers-reduced-motion: reduce").matches) {
    addAnimation();
}

function addAnimation() {
    scrollers.forEach(scroller => {
        scroller.setAttribute("data-animated", true)
    });
}

function loadComponent(containerId, componentPath, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;

    fetch(componentPath)
        .then(response => response.text())
        .then(data => {
            container.innerHTML = data;
            if (typeof callback === 'function') {
                callback();
            }
        })
        .catch(error => {
            console.error(`Error loading component ${componentPath}:`, error);
        });
}

function setupNavbarScrollColor() {
    const nav = document.querySelector('.transparent-nav');
    const hero = document.getElementById('home');

    if (!nav || !hero) {
        return;
    }

    window.addEventListener('scroll', function () {
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        const scrollY = window.scrollY;
        const navHeight = nav.offsetHeight;

        if (scrollY >= heroBottom - navHeight) {
            nav.classList.add('text-dark');
        } else {
            nav.classList.remove('text-dark');
        }
    });
} 