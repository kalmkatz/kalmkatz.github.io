// ===============================================
// | MAIN.JS - KALMKATZ - DATA LOADER & RENDERER |
// ===============================================

// Helper function to load JSON via XHR (works on file:// URLs)
function loadJSON(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 0) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    callback(null, data);
                } catch (e) {
                    callback(e, null);
                }
            } else {
                callback(new Error(`Failed to load ${url} (status: ${xhr.status})`), null);
            }
        }
    };
    xhr.send(null);
}







// ===========================
// | INITIALISE ON PAGE LOAD |
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // Load and render cat review cards
    loadJSON('cards.json', (err, cards) => {
        if (err) {
            console.error('Error loading cards:', err);
            document.getElementById('home').innerHTML = 
                '<p style="text-align:center; color:#5A256DFF; font-size:1.2rem;">Sorry, could not load the cat reviews at this time.</p>';
            return;
        }
        renderCards(cards);
    });

    // Load and render pricing information
    loadJSON('prices.json', (err, prices) => {
        if (err) {
            console.error('Error loading prices:', err);
            document.getElementById('pricing-grid').innerHTML = 
                '<p style="text-align:center; color:#5A256DFF; font-size:1.2rem;">Sorry, could not load pricing information right now.</p>';
            return;
        }
        renderPrices(prices);
    });

    // Load and render privacy policy
    loadJSON('privacy.json', (err, policy) => {
        if (err) {
            console.error('Error loading privacy policy:', err);
            document.getElementById('privacy-content').innerHTML =
                '<p style="text-align:center; color:#5A256DFF;">Sorry, could not load the privacy policy.</p>';
            return;
        }
        renderPrivacy(policy);
    });
});







// =======================
// | RENDER REVIEW CARDS |
// =======================

function renderCards(cards) {
    const container = document.getElementById('home');
    if (!container) return;

    container.innerHTML = '';

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.special ? 'special-card' : ''}`;

        cardElement.innerHTML = `
            <div class="card-image">
                <div class="review-overlay">
                    <p class="review-text">${card.review}</p>
                </div>
            </div>
            <div class="card-name">${card.name}</div>
            <div class="rating">
                ${'<img src="star.png" alt="star" class="star">'.repeat(card.rating)}
            </div>
        `;

        container.appendChild(cardElement);

        const overlay = cardElement.querySelector('.review-overlay');
        const hasOverflow = overlay.scrollHeight > overlay.clientHeight;

        if (hasOverflow) {
            cardElement.classList.add('scrollable');
        }

        cardElement.addEventListener('wheel', (e) => {
            if (overlay.scrollHeight <= overlay.clientHeight) return;

            const atTop    = overlay.scrollTop <= 0;
            const atBottom = overlay.scrollTop + overlay.clientHeight >= overlay.scrollHeight - 1;

            const scrollingDown  = e.deltaY > 0;
            const scrollingUp    = e.deltaY < 0;

            if ((scrollingDown && atBottom) || (scrollingUp && atTop)) {
                return;
            }

            e.preventDefault();
            overlay.scrollTop += e.deltaY;
        }, { passive: false });
    });
}








// ========================
// | RENDER PRICING CARDS |
// ========================

function renderPrices(prices) {
    const grid = document.getElementById('pricing-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Visits Card
    const visitsCard = document.createElement('div');
    visitsCard.className = 'price-card';
    visitsCard.innerHTML = `
        <div class="price-content">
            <div class="price-header">
                <div class="price-name">Visit Prices</div>
            </div>
            <ul class="features-list">
                <li>30 minutes — £${prices.visits[0].price}</li>
                <li>45 minutes — £${prices.visits[1].price}</li>
                <li>60 minutes — £${prices.visits[2].price}</li>
            </ul>
            <a href="#book" class="cta-button">Book Now</a>
        </div>
    `;
    grid.appendChild(visitsCard);

    // Uplifts Card
    const upliftsCard = document.createElement('div');
    upliftsCard.className = 'price-card';
    upliftsCard.innerHTML = `
        <div class="price-content">
            <div class="price-header">
                <div class="price-name">Uplifts</div>
            </div>
            <ul class="features-list">
                <li><strong>Multiple Pets:</strong></li>
                <li>+10% for 2 cats</li>
                <li>+15% for 3 cats</li>
                <li>+25% for more than 3 cats</li>
                <li><strong>Special Days:</strong> ${prices.uplifts.special_days.description} — ${prices.uplifts.special_days.percent}</li>
            </ul>
            <a href="#book" class="cta-button">Book Now</a>
        </div>
    `;
    grid.appendChild(upliftsCard);

    // Extended Sits Card
    const sitsCard = document.createElement('div');
    sitsCard.className = 'price-card';
    sitsCard.innerHTML = `
        <div class="price-content">
            <div class="price-header">
                <div class="price-name">Extended Sits</div>
            </div>
            <ul class="features-list">
                <li>Half day (4 hours) — £${prices.sits[0].price}</li>
                <li>Full day (8 hours) — £${prices.sits[1].price}</li>
                <li>Day and night — £${prices.sits[2].price}</li>
            </ul>
            <a href="#book" class="cta-button">Book Now</a>
        </div>
    `;
    grid.appendChild(sitsCard);

    // Discounts Card
    const discountsCard = document.createElement('div');
    discountsCard.className = 'price-card';
    discountsCard.innerHTML = `
        <div class="price-content">
            <div class="price-header">
                <div class="price-name">Multi-Day Discounts</div>
            </div>
            <ul class="features-list">
                <li>10% off for 4–7 days</li>
                <li>20% off for 8–14 days</li>
                <li>30% off for 15–21 days</li>
            </ul>
            <a href="#book" class="cta-button">Book Now</a>
        </div>
    `;
    grid.appendChild(discountsCard);
}








// =========================
// | RENDER PRIVACY POLICY |
// =========================

function renderPrivacy(policy) {
    const container = document.getElementById('privacy-content');
    if (!container) return;

    let html = `<h1 class="privacy-title">${policy.title}</h1>`;
    html += `<p class="privacy-updated">Last updated: ${policy.lastUpdated}</p>`;

    policy.sections.forEach(section => {
        html += `<div class="privacy-section" id="${section.id}">`;
        html += `<h2 class="privacy-heading">${section.heading}</h2>`;

        if (section.content) {
            section.content.forEach(para => {
                html += `<p class="privacy-para">${para}</p>`;
            });
        }

        if (section.list) {
            html += `<ul class="privacy-list">`;
            section.list.forEach(item => {
                html += `<li>${item}</li>`;
            });
            html += `</ul>`;
        }

        if (section.contentAfter) {
            section.contentAfter.forEach(para => {
                html += `<p class="privacy-para">${para}</p>`;
            });
        }

        html += `</div>`;
    });

    container.innerHTML = html;
}





// =================================
// | DYNAMIC NEW HEIGHT ADJUSTMENT |
// =================================

// Make sure the logo never hides behind the fixed nav
function updateBodyPadding() {
    const nav = document.querySelector('.navigation');
    const padding = nav ? nav.offsetHeight + 20 : 140;  // 20px extra breathing room
    document.body.style.paddingTop = padding + 'px';
}

// Run it once when the page loads
updateBodyPadding();

// And run it again every time the window size changes
window.addEventListener('resize', updateBodyPadding);
