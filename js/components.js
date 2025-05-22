// created by ty behnke - 47069374

/*
 * Load components in DOM, handle navbar and featured card creation
 */
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('navbar-container')) {
        loadComponent('navbar-container', '/unComfort/components/navbar.html', function () {
            // navbar elements
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll('#navbar-container .nav-links a');
            const hamburger = document.getElementById('nav-hamburger');
            const overlay = document.getElementById('nav-overlay');
            const closeBtn = document.getElementById('nav-close');
            const overlayLinks = overlay ? overlay.querySelectorAll('.nav-overlay-links a') : [];
            const cartToggle = document.getElementById('cart-toggle');
            const cartToggleOverlay = document.getElementById('cart-toggle-overlay');
            const currencyToggle = document.getElementById('currency-toggle');
            const currencyToggleOverlay = document.getElementById('currency-toggle-overlay');
            const currencyOverlay = document.getElementById('currency-overlay');
            const currencyClose = document.getElementById('currency-close');
            // change navbar color depending on scroll location of landing page
            setupNavbarScrollColor();
            // ensure navbar currency is correct after refresh
            if (window.updateNavbarCurrency) window.updateNavbarCurrency();
            // set active navbar link
            navLinks.forEach(link => {
                if (link.pathname === currentPath) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            // listen for currencyChanged events and update cart total
            document.addEventListener('currencyChanged', function () {
                if (window.updateCartTotal) window.updateCartTotal();
            });
            // open and close overlay
            function openOverlay() {
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            function closeOverlay() {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
            // listeners for mobile/tablet navbar elements
            if (hamburger && overlay && closeBtn) {
                hamburger.addEventListener('click', openOverlay);
                closeBtn.addEventListener('click', closeOverlay);
                overlayLinks.forEach(link => {
                    link.addEventListener('click', closeOverlay);
                });
            }
            // overlay cart and currency toggle
            if (cartToggle && cartToggleOverlay) {
                cartToggleOverlay.addEventListener('click', function(e) {
                    e.preventDefault();
                    cartToggle.click();
                });
            }
            // listeners for overlay currency toggle
            if (currencyToggle && currencyToggleOverlay && currencyOverlay && currencyClose) {
                // sync overlay currency text with main nav
                currencyToggleOverlay.textContent = currencyToggle.textContent;
                hamburger && hamburger.addEventListener('click', function() {
                    currencyToggleOverlay.textContent = currencyToggle.textContent;
                });
                // show currency overlay on overlay currency click
                currencyToggleOverlay.addEventListener('click', function(e) {
                    e.preventDefault();
                    createNavOverlay(currencyOverlay);
                });
                // hide overlay on close
                currencyClose.addEventListener('click', function() {
                    currencyOverlay.style.display = 'none';
                });
                // handle currency selection
                currencyOverlay.querySelectorAll('.currency-link').forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        const selected = btn.getAttribute('data-currency');
                        localStorage.setItem('selectedCurrency', selected);
                        // update nav and overlay text
                        if (currencyToggle) currencyToggle.textContent = '$' + selected.toLowerCase();
                        if (currencyToggleOverlay) currencyToggleOverlay.textContent = '$' + selected.toLowerCase();
                        // hide overlay
                        currencyOverlay.style.display = 'none';
                        // trigger currencyChanged event
                        document.dispatchEvent(new Event('currencyChanged'));
                    });
                });
                // also listen for currencyChanged event
                document.addEventListener('currencyChanged', function() {
                    const stored = localStorage.getItem('selectedCurrency') || 'AUD';
                    currencyToggleOverlay.textContent = '$' + stored.toLowerCase();
                    currencyToggle.textContent = '$' + stored.toLowerCase();
                });
            }
            // close overlay on resize
            window.addEventListener('resize', function () {
                if (window.innerWidth > 900) closeOverlay();
            });
        });
    }
    // featured card component
    if (document.getElementById('featured-card-container')) {
        // load creation from featured-card.js
        loadComponent('featured-card-container', '/unComfort/components/featured-card.html', function () {
            console.log('Featured card component loaded');
            // imported function from featured-card.js
            if (typeof initFeaturedCards === 'function') {
                initFeaturedCards();
            }
            // update prices
            if (window.updateAllPrices) window.updateAllPrices();
        });
    }
});

// inject overlay styling.
function createNavOverlay(box) {
    box.style.display = 'flex';
    box.style.position = 'fixed';
    box.style.top = 0;
    box.style.left = 0;
    box.style.width = '100vw';
    box.style.height = '100vh';
    box.style.background = '#fff';
    box.style.zIndex = 10000;
    box.style.flexDirection = 'column';
    box.style.justifyContent = 'center';
    box.style.alignItems = 'center';
}

// scrolling animation at top of landing page
const scrollers = document.querySelectorAll('.scroller');
// disable is user has reduced motion enabled
if (!window.matchMedia("(prefers-reduced-motion: reduce").matches) {
    addAnimation();
}
// add animation element
function addAnimation() {
    scrollers.forEach(scroller => {
        scroller.setAttribute("data-animated", true)
    });
}

// load static html components (/components directory)
function loadComponent(containerId, componentPath, callback) {
    // get container element
    const container = document.getElementById(containerId);
    if (!container) return;
    // fetch component
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

/*
 * changes navbar color based on location on landing page
 */
function setupNavbarScrollColor() {
    // get navbar and hero elements
    const nav = document.querySelector('.transparent-nav');
    const hero = document.getElementById('home');
    const hamburger = document.getElementById('nav-hamburger');
    const hamburgerSpans = hamburger ? hamburger.querySelectorAll('span') : [];
    // helper to set hamburger color
    function setHamburgerColor(dark) {
        hamburgerSpans.forEach(span => {
            span.style.background = dark ? '#000' : '#fff';
        });
    }
    // if not on the home page, make navbar black
    if (!hero) {
        nav.classList.add('text-dark');
        setHamburgerColor(true);
        return;
    }
    // add scroll listener to find location on landing page
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
    // set initial color
    const initialDark = window.scrollY >= (hero.offsetTop + hero.offsetHeight) - nav.offsetHeight;
    setHamburgerColor(initialDark);
}