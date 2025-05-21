function createCurrencySelector() {
    const box = document.createElement('div');
    box.id = 'currency-selector-box';
    box.innerHTML = `
        <button class="currency-selector-btn">aud</button>
        <button class="currency-selector-btn">usd</button>
        <button class="currency-selector-btn">eur</button>
        <button class="currency-selector-btn">gbp</button>
        <button class="currency-selector-btn">jpy</button>
        <button class="currency-selector-btn">cad</button>
    `;
    // Add click handler to each button
    box.querySelectorAll('.currency-selector-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const selectedCurrency = e.target.textContent;
            // Update navbar
            const currencyToggle = document.getElementById('currency-toggle');
            if (currencyToggle) {
                currencyToggle.textContent = '$' + selectedCurrency;
            }
            // Store in localStorage
            localStorage.setItem('selectedCurrency', selectedCurrency);
            // Optionally: dispatch event for other scripts
            document.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency: selectedCurrency } }));
            // Close selector
            toggleCurrency();
            e.stopPropagation();
        });
    });
    // Find the currency-toggle button and its parent li
    const currencyToggle = document.getElementById('currency-toggle');
    if (currencyToggle && currencyToggle.parentElement) {
        currencyToggle.parentElement.style.position = 'relative';
        currencyToggle.parentElement.appendChild(box);
    } else {
        document.body.appendChild(box); // fallback
    }
    // Force reflow and add .show for transition
    void box.offsetHeight; // force reflow
    box.classList.add('show');
}

function toggleCurrency() {
    const existingBox = document.getElementById('currency-selector-box');
    if (existingBox) {
        // Animate out
        existingBox.classList.remove('show');
        existingBox.classList.add('hide');
        existingBox.addEventListener('transitionend', function handler(e) {
            if (e.propertyName === 'opacity') {
                existingBox.removeEventListener('transitionend', handler);
                existingBox.remove();
            }
        });
    } else {
        createCurrencySelector();
    }
}
// --- Currency conversion logic ---
const CURRENCY_CONVERSIONS = {
    AUD: 1,
    USD: 0.66,
    EUR: 0.61,
    GBP: 0.52,
    JPY: 104,
    CAD: 0.90
};

const CURRENCY_SYMBOLS = {
    AUD: '$',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: '$'
};

function convertPrice(audPrice, toCurrency) {
    const rate = CURRENCY_CONVERSIONS[toCurrency.toUpperCase()] || 1;
    return audPrice * rate;
}

function formatPrice(audPrice, toCurrency) {
    const symbol = CURRENCY_SYMBOLS[toCurrency.toUpperCase()] || '$';
    const converted = convertPrice(audPrice, toCurrency);
    const decimals = toCurrency.toUpperCase() === 'JPY' ? 0 : 2;
    return symbol + converted.toFixed(decimals);
}

function updateAllPrices() {
    const currency = (localStorage.getItem('selectedCurrency') || 'AUD').toUpperCase();
    document.querySelectorAll('.price[data-aud]').forEach(el => {
        const aud = parseFloat(el.dataset.aud);
        el.textContent = formatPrice(aud, currency);
    });
}
document.addEventListener('DOMContentLoaded', updateAllPrices);
document.addEventListener('currencyChanged', updateAllPrices);

// Show/hide currency selector on navbar click
// Also update navbar currency on page load
function updateNavbarCurrency() {
    const currencyToggle = document.getElementById('currency-toggle');
    const stored = localStorage.getItem('selectedCurrency') || 'AUD';
    if (currencyToggle) {
        currencyToggle.textContent = '$' + stored;
    }
}
document.addEventListener('DOMContentLoaded', updateNavbarCurrency);
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'currency-toggle') {
        toggleCurrency();
    }
});
// Also update if currency is changed from another script
// (optional, for extensibility)
document.addEventListener('currencyChanged', updateNavbarCurrency);