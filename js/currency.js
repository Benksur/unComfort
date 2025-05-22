// created by ty behnke - 47069374

/*
 * creates and displays currency selector (desktop mode)
 */
function createCurrencySelector() {
    const box = document.createElement('div');
    box.id = 'currency-selector-box';
    // add the buttons to div
    box.innerHTML = `
        <button class="currency-selector-btn">aud</button>
        <button class="currency-selector-btn">usd</button>
        <button class="currency-selector-btn">eur</button>
        <button class="currency-selector-btn">gbp</button>
        <button class="currency-selector-btn">jpy</button>
        <button class="currency-selector-btn">cad</button>
    `;
    // add click handler for currency selector buttons
    box.querySelectorAll('.currency-selector-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const selectedCurrency = e.target.textContent;
            // update navbar
            const currencyToggle = document.getElementById('currency-toggle');
            if (currencyToggle) {
                currencyToggle.textContent = '$' + selectedCurrency;
            }
            // store in localStorage
            localStorage.setItem('selectedCurrency', selectedCurrency);
            // dispatch currencyChanged event
            document.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency: selectedCurrency } }));
            // close selector
            toggleCurrency();
            e.stopPropagation();
        });
    });
    // find the currency-toggle button and append the selector to it
    const currencyToggle = document.getElementById('currency-toggle');
    if (currencyToggle && currencyToggle.parentElement) {
        // place div directly under selector button
        currencyToggle.parentElement.style.position = 'relative';
        currencyToggle.parentElement.appendChild(box);
    } else {
        document.body.appendChild(box); // fallback
    }
    // force reflow and add .show for css transition
    void box.offsetHeight;
    box.classList.add('show');
}

/*
 * toggles currency selector (desktop mode)
 */
function toggleCurrency() {
    const existingBox = document.getElementById('currency-selector-box');
    // if already open, close
    if (existingBox) {
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

/*
 * currency conversion enums
 */
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

/* 
 * converts from aud to selected currency, hardcoded values
 * because i cba setting up an api
 */ 
function convertPrice(audPrice, toCurrency) {
    const rate = CURRENCY_CONVERSIONS[toCurrency.toUpperCase()] || 1;
    return audPrice * rate;
}

/*
 * formats price with correct symbol, truncates to 2 decimal places
 * jpy is truncated to whole numbers
 */
function formatPrice(audPrice, toCurrency) {
    const symbol = CURRENCY_SYMBOLS[toCurrency.toUpperCase()] || '$';
    const converted = convertPrice(audPrice, toCurrency);
    const decimals = toCurrency.toUpperCase() === 'JPY' ? 0 : 2;
    return symbol + converted.toFixed(decimals);
}

/*
 * updates all prices on page with correct currency.
 * any html element with data-aud attribute will be updated.
 */
function updateAllPrices() {
    const currency = (localStorage.getItem('selectedCurrency') || 'AUD').toUpperCase();
    document.querySelectorAll('.price[data-aud]').forEach(el => {
        const aud = parseFloat(el.dataset.aud);
        el.textContent = formatPrice(aud, currency);
    });
}

// update prices on page load and when currency is changed
document.addEventListener('DOMContentLoaded', updateAllPrices);
document.addEventListener('currencyChanged', updateAllPrices);

/* 
 * updates navbar currency on page load
 */
function updateNavbarCurrency() {
    const currencyToggle = document.getElementById('currency-toggle');
    const stored = localStorage.getItem('selectedCurrency') || 'AUD';
    if (currencyToggle) {
        currencyToggle.textContent = '$' + stored;
    }
}

// add listeners
document.addEventListener('DOMContentLoaded', updateNavbarCurrency);
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'currency-toggle') {
        toggleCurrency();
    }
});
document.addEventListener('currencyChanged', updateNavbarCurrency);