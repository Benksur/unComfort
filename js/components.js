document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('navbar-container')) {
        loadComponent('navbar-container', '../components/navbar.html', function () {
            setupNavbarScrollColor();
            console.log('Navbar scroll color change setup completed');

            // Ensure navbar currency is correct after dynamic load
            if (window.updateNavbarCurrency) window.updateNavbarCurrency();

            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll('#navbar-container .nav-links a');

            navLinks.forEach(link => {
                if (link.pathname === currentPath) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            console.log('Simple active navbar link setup. Path:', currentPath);

            // Listen for currencyChanged events and update cart total
            document.addEventListener('currencyChanged', function () {
                if (window.updateCartTotal) window.updateCartTotal();
            });
        });
    }

    if (document.getElementById('featured-card-container')) {
        loadComponent('featured-card-container', 'components/featured-card.html', function () {
            console.log('Featured card component loaded');
            if (typeof initFeaturedCards === 'function') {
                initFeaturedCards();
            }
            if (window.updateAllPrices) window.updateAllPrices();
        });
    }
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

    // If we're not on the home page, make navbar black
    if (!hero) {
        nav.classList.add('text-dark');
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