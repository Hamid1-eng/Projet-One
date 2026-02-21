// Animation au scroll avec Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MENU TOGGLE (HAMBURGER) =====
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');
    const navLinks = nav.querySelectorAll('a');

    // Toggle le menu quand on clique sur le bouton hamburger
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Fermer le menu quand on clique sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', function(event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickInsideToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickInsideToggle && nav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        }
    });
    
    // Configuration de l'observer
    const observerOptions = {
        threshold: 0.15, // L'élément doit être visible à 15%
        rootMargin: '0px 0px -50px 0px' // Déclenche un peu avant d'atteindre le viewport
    };

    // Créer l'observer
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajouter la classe visible avec un délai optionnel
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('scroll-visible');
                }, delay);
                
                // Optionnel : arrêter d'observer après l'animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Sélectionner tous les éléments à animer
    const animatedElements = document.querySelectorAll('.scroll-hidden, .scroll-fade-left, .scroll-fade-right, .scroll-zoom');
    
    // Observer chaque élément
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Animation spéciale pour les cartes produits
    const productCards = document.querySelectorAll('.pro-phare > div');
    productCards.forEach((card, index) => {
        card.classList.add('scroll-hidden');
        card.dataset.delay = index * 100; // Délai progressif de 100ms
        observer.observe(card);
    });

    // Animation pour la section à propos
    const aboutSection = document.querySelector('#apropos');
    if (aboutSection) {
        aboutSection.classList.add('scroll-fade-left');
        observer.observe(aboutSection);
    }

    // Animation pour la section promo
    const promoSection = document.querySelector('.promo');
    if (promoSection) {
        promoSection.classList.add('scroll-zoom');
        observer.observe(promoSection);
    }

    // Animation pour le formulaire de contact
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
        contactSection.classList.add('scroll-fade-right');
        observer.observe(contactSection);
    }

    // Effet parallax léger sur le header au scroll
    let lastScroll = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scroll vers le bas
            header.style.transform = 'translateY(-5px)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        } else {
            // Scroll vers le haut
            header.style.transform = 'translateY(0)';
            header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    });
});
