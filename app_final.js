alert('JS FUNGUJE - Nová verzia je načítaná!');
const translations = window.translations;

window.onerror = function(message, source, lineno, colno, error) {
    alert("Chyba JS: " + message + " na riadku: " + lineno);
    return true;
};

// Okamžité spustenie (bez DOMContentLoaded, lebo script je na konci body)
(function initApp() {
    // --- Tmavý režim (Dark Mode) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };
    
    // Auto-detekcia zo systému alebo načítanie z localStorage
    let savedTheme = 'light';
    try { savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch(e) { savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
    applyTheme(savedTheme);
    
    if(themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDarkMode = document.documentElement.classList.contains('dark');
            const newTheme = isDarkMode ? 'light' : 'dark';
            try { localStorage.setItem('theme', newTheme); } catch(e) {}
            applyTheme(newTheme);
        });
    }

    // --- Jazyk (Translations) ---
    const langSkBtn = document.getElementById('lang-sk');
    const langEnBtn = document.getElementById('lang-en');
    let currentLang = 'sk';
    try { currentLang = localStorage.getItem('lang') || 'sk'; } catch(e) {}

    function setLanguage(lang) {
        currentLang = lang;
        try { localStorage.setItem('lang', lang); } catch(e) {}
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.dataset.translateKey;
            if (translations && translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });
        if(langSkBtn) langSkBtn.classList.toggle('active', lang === 'sk');
        if(langEnBtn) langEnBtn.classList.toggle('active', lang === 'en');
    }
    
    if(langSkBtn) langSkBtn.addEventListener('click', () => setLanguage('sk'));
    if(langEnBtn) langEnBtn.addEventListener('click', () => setLanguage('en'));
    setLanguage(currentLang);

    // --- Modálne okná (Modals) ---
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalContent = document.getElementById('modal-content');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    const openModal = (contentId, titleText) => {
        try {
            const contentElement = document.getElementById(contentId);
            if (contentElement && modalBody && modalTitle) {
                modalBody.innerHTML = '';
                const clonedContent = contentElement.cloneNode(true);
                clonedContent.classList.remove('hidden');
                modalBody.appendChild(clonedContent);
                
                modalTitle.textContent = titleText || 'Informácie';
                
                modalBackdrop.style.display = 'block';
                modalContent.style.display = 'flex';
                setTimeout(() => {
                    modalBackdrop.style.opacity = '1';
                    modalContent.style.opacity = '1';
                }, 10);
                document.body.style.overflow = 'hidden';
            } else {
                alert('Chyba: Nenájdený obsah pre ' + contentId);
            }
        } catch(err) {
            alert('Chyba otvárania: ' + err.message);
        }
    };

    const closeModal = () => {
        if(modalBackdrop) {
            modalBackdrop.style.opacity = '0';
            setTimeout(() => modalBackdrop.style.display = 'none', 300);
        }
        if(modalContent) {
            modalContent.style.opacity = '0';
            setTimeout(() => modalContent.style.display = 'none', 300);
        }
        document.body.style.overflow = '';
    };

    // Pripojenie eventov na karty
    const cards = document.querySelectorAll('.nav-card, .quick-action-btn');
    if(cards.length === 0) {
        alert("Chyba: Nenašli sa žiadne karty!");
    }
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const contentId = card.getAttribute('data-content-id');
            const titleElement = card.querySelector('h3');
            const titleText = titleElement ? titleElement.textContent : '';
            if (contentId) {
                openModal(contentId, titleText);
            } else {
                alert("Karta nemá data-content-id!");
            }
        });
    });

    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if(modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // --- QR Kód ---
    const qrBtn = document.getElementById('qr-btn');
    const qrModalBackdrop = document.getElementById('qr-modal-backdrop');
    const qrModalContent = document.getElementById('qr-modal-content');
    const closeQrBtn = document.getElementById('close-qr-btn');
    let qrCodeGenerated = false;

    if(qrBtn) {
        qrBtn.addEventListener('click', () => {
            if(qrModalBackdrop) {
                qrModalBackdrop.style.display = 'block';
                setTimeout(() => qrModalBackdrop.style.opacity = '1', 10);
            }
            if(qrModalContent) {
                qrModalContent.style.display = 'flex';
                setTimeout(() => qrModalContent.style.opacity = '1', 10);
            }
            document.body.style.overflow = 'hidden';
            
            if (!qrCodeGenerated && typeof QRCode !== 'undefined') {
                try {
                    new QRCode(document.getElementById("qrcode"), {
                        text: window.location.href,
                        width: 200,
                        height: 200,
                        colorDark : "#0050AA",
                        colorLight : "#ffffff",
                        correctLevel : QRCode.CorrectLevel.H
                    });
                    qrCodeGenerated = true;
                } catch(e) {
                    alert("Chyba QR: " + e.message);
                }
            }
        });
    }

    const closeQrModal = () => {
        if(qrModalBackdrop) {
            qrModalBackdrop.style.opacity = '0';
            setTimeout(() => qrModalBackdrop.style.display = 'none', 300);
        }
        if(qrModalContent) {
            qrModalContent.style.opacity = '0';
            setTimeout(() => qrModalContent.style.display = 'none', 300);
        }
        document.body.style.overflow = '';
    };

    if(closeQrBtn) closeQrBtn.addEventListener('click', closeQrModal);
    if(qrModalBackdrop) qrModalBackdrop.addEventListener('click', closeQrModal);

})();
