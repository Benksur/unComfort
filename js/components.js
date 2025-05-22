document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('navbar-container')) {
        loadComponent('navbar-container', '/unComfort/components/navbar.html', function () {
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

            // Responsive Navbar Overlay Toggle
            const hamburger = document.getElementById('nav-hamburger');
            const overlay = document.getElementById('nav-overlay');
            const closeBtn = document.getElementById('nav-close');
            const overlayLinks = overlay ? overlay.querySelectorAll('.nav-overlay-links a') : [];

            function openOverlay() {
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            function closeOverlay() {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
            if (hamburger && overlay && closeBtn) {
                hamburger.addEventListener('click', openOverlay);
                closeBtn.addEventListener('click', closeOverlay);
                overlayLinks.forEach(link => {
                    link.addEventListener('click', closeOverlay);
                });
            }
            // Overlay Cart and Currency Toggle
            const cartToggle = document.getElementById('cart-toggle');
            const cartToggleOverlay = document.getElementById('cart-toggle-overlay');
            if (cartToggle && cartToggleOverlay) {
                cartToggleOverlay.addEventListener('click', function(e) {
                    e.preventDefault();
                    cartToggle.click();
                });
            }
            const currencyToggle = document.getElementById('currency-toggle');
            const currencyToggleOverlay = document.getElementById('currency-toggle-overlay');
            const currencyOverlay = document.getElementById('currency-overlay');
            const currencyClose = document.getElementById('currency-close');
            if (currencyToggle && currencyToggleOverlay && currencyOverlay && currencyClose) {
                // Sync overlay currency text with main nav
                currencyToggleOverlay.textContent = currencyToggle.textContent;
                hamburger && hamburger.addEventListener('click', function() {
                    currencyToggleOverlay.textContent = currencyToggle.textContent;
                });
                // Show currency overlay on overlay currency click
                currencyToggleOverlay.addEventListener('click', function(e) {
                    e.preventDefault();
                    currencyOverlay.style.display = 'flex';
                    currencyOverlay.style.position = 'fixed';
                    currencyOverlay.style.top = 0;
                    currencyOverlay.style.left = 0;
                    currencyOverlay.style.width = '100vw';
                    currencyOverlay.style.height = '100vh';
                    currencyOverlay.style.background = '#fff';
                    currencyOverlay.style.zIndex = 10000;
                    currencyOverlay.style.flexDirection = 'column';
                    currencyOverlay.style.justifyContent = 'center';
                    currencyOverlay.style.alignItems = 'center';
                });
                // Hide overlay on close
                currencyClose.addEventListener('click', function() {
                    currencyOverlay.style.display = 'none';
                });
                // Handle currency option click (updated for .currency-link)
                currencyOverlay.querySelectorAll('.currency-link').forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        const selected = btn.getAttribute('data-currency');
                        localStorage.setItem('selectedCurrency', selected);
                        // Update nav and overlay text
                        if (currencyToggle) currencyToggle.textContent = '$' + selected.toLowerCase();
                        if (currencyToggleOverlay) currencyToggleOverlay.textContent = '$' + selected.toLowerCase();
                        // Hide overlay
                        currencyOverlay.style.display = 'none';
                        // Trigger currencyChanged event
                        document.dispatchEvent(new Event('currencyChanged'));
                    });
                });
                // Also listen for currencyChanged event
                document.addEventListener('currencyChanged', function() {
                    const stored = localStorage.getItem('selectedCurrency') || 'AUD';
                    currencyToggleOverlay.textContent = '$' + stored.toLowerCase();
                    currencyToggle.textContent = '$' + stored.toLowerCase();
                });
            }
            window.addEventListener('resize', function () {
                if (window.innerWidth > 900) closeOverlay();
            });
        });
    }

    if (document.getElementById('featured-card-container')) {
        loadComponent('featured-card-container', '/unComfort/components/featured-card.html', function () {
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
    const hamburger = document.getElementById('nav-hamburger');
    const hamburgerSpans = hamburger ? hamburger.querySelectorAll('span') : [];

    // Helper to set hamburger color
    function setHamburgerColor(dark) {
        hamburgerSpans.forEach(span => {
            span.style.background = dark ? '#000' : '#fff';
        });
    }

    // If we're not on the home page, make navbar black
    if (!hero) {
        nav.classList.add('text-dark');
        setHamburgerColor(true);
        return;
    }

    window.addEventListener('scroll', function () {
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        const scrollY = window.scrollY;
        const navHeight = nav.offsetHeight;
        const dark = scrollY >= heroBottom - navHeight;
        if (dark) {
            nav.classList.add('text-dark');
        } else {
            nav.classList.remove('text-dark');
        }
        setHamburgerColor(dark);
    });
    // Set initial color
    const initialDark = window.scrollY >= (hero.offsetTop + hero.offsetHeight) - nav.offsetHeight;
    setHamburgerColor(initialDark);
}