// Système de Panier Simple

let panier = {
    items: [],
    codePromoUsed: false,

    init() {
        console.log('Panier initialisé');
        this.charger();
        this.verifierPromotion();
        this.attacherEvenements();
        this.afficher();
    },

    verifierPromotion() {
        // Vérifier si c'est la première visite
        const premiereVisite = !localStorage.getItem('achatEffectue');
        if (premiereVisite) {
            console.log('Première visite - Promotion 5% disponible');
        }
    },

    attacherEvenements() {
        console.log('Attachement des événements');
        
        // Boutons Commander
        const boutons = document.querySelectorAll('.btn-commander');
        console.log('Boutons trouvés:', boutons.length);
        
        boutons.forEach((btn, idx) => {
            console.log('Attacher événement au bouton', idx);
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const carte = btn.closest('.product-card');
                if (carte) {
                    const nom = carte.getAttribute('data-product-name');
                    const prix = parseInt(carte.getAttribute('data-product-price'));
                    console.log('Commander:', nom, prix);
                    this.ajouter(nom, prix);
                }
            });
        });

        // Icône panier
        const iconePanier = document.getElementById('cartIcon');
        if (iconePanier) {
            iconePanier.addEventListener('click', () => {
                console.log('Ouverture du panier');
                this.ouvrir();
            });
        }

        // Fermer panier
        const fermer = document.getElementById('cartClose');
        if (fermer) {
            fermer.addEventListener('click', () => {
                console.log('Fermeture du panier');
                this.fermer();
            });
        }

        // Modal
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.fermer();
                }
            });
        }

        // Bouton "Passer la commande"
        const btnCommander = document.querySelector('.cart-summary button');
        if (btnCommander) {
            btnCommander.addEventListener('click', () => {
                this.passerCommande();
            });
        }
    },

    ajouter(nom, prix) {
        console.log('Ajout:', nom, prix);
        
        let existe = this.items.find(i => i.nom === nom);
        if (existe) {
            existe.qte += 1;
        } else {
            this.items.push({ nom, prix, qte: 1 });
        }
        
        this.sauvegarder();
        this.afficher();
        this.notification(nom + ' ajouté au panier!');
    },

    supprimer(nom) {
        this.items = this.items.filter(i => i.nom !== nom);
        this.sauvegarder();
        this.afficher();
    },

    changerQte(nom, qte) {
        if (qte <= 0) {
            this.supprimer(nom);
            return;
        }
        
        let item = this.items.find(i => i.nom === nom);
        if (item) {
            item.qte = qte;
            this.sauvegarder();
            this.afficher();
        }
    },

    afficher() {
        console.log('Affichage du panier');
        
        // Nombre d'articles
        const nb = this.items.reduce((sum, i) => sum + i.qte, 0);
        const compteur = document.getElementById('cartCount');
        if (compteur) {
            compteur.textContent = nb;
        }

        // Articles
        const liste = document.getElementById('cartItems');
        if (!liste) return;

        if (this.items.length === 0) {
            liste.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
            return;
        }

        let html = '';
        this.items.forEach((item, idx) => {
            html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.nom}</div>
                    <div class="cart-item-price">${item.prix.toLocaleString()} GNF</div>
                </div>
                <div class="cart-item-qty">
                    <button onclick="panier.changerQte('${item.nom}', ${item.qte - 1})">−</button>
                    <span>${item.qte}</span>
                    <button onclick="panier.changerQte('${item.nom}', ${item.qte + 1})">+</button>
                </div>
                <button class="cart-item-remove" onclick="panier.supprimer('${item.nom}')">Supprimer</button>
            </div>`;
        });
        
        liste.innerHTML = html;

        // Total et réduction
        this.afficherTotal();
    },

    afficherTotal() {
        let total = this.items.reduce((sum, i) => sum + (i.prix * i.qte), 0);
        
        // Appliquer la réduction si première commande
        const premiereCommande = !localStorage.getItem('achatEffectue');
        let reduction = 0;
        
        if (premiereCommande && this.items.length > 0) {
            reduction = Math.floor(total * 0.05); // 5%
        }
        
        const totalFinal = total - reduction;
        const totalElem = document.getElementById('cartTotal');
        
        if (totalElem) {
            let affichage = totalFinal.toLocaleString();
            if (reduction > 0) {
                affichage = `<span style="text-decoration: line-through; color: #999;">${total.toLocaleString()}</span> → ${totalFinal.toLocaleString()}`;
            }
            totalElem.innerHTML = affichage;
        }
    },

    ouvrir() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.classList.add('active');
        }
    },

    fermer() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    passerCommande() {
        if (this.items.length === 0) {
            this.notification('Votre panier est vide!');
            return;
        }
        
        const total = this.items.reduce((sum, i) => sum + (i.prix * i.qte), 0);
        const premiereCommande = !localStorage.getItem('achatEffectue');
        const reduction = premiereCommande ? Math.floor(total * 0.05) : 0;
        const totalFinal = total - reduction;
        
        let message = `Commande passée avec succès!\nTotal: ${totalFinal.toLocaleString()} GNF`;
        if (reduction > 0) {
            message += `\nRéduction 5%: -${reduction.toLocaleString()} GNF`;
        }
        
        alert(message);
        
        // Marquer que l'achat a été effectué
        localStorage.setItem('achatEffectue', 'true');
        
        // Vider le panier
        this.items = [];
        this.sauvegarder();
        this.afficher();
        this.fermer();
        
        this.notification('Merci pour votre commande! 🎉');
    },

    sauvegarder() {
        localStorage.setItem('panier', JSON.stringify(this.items));
    },

    charger() {
        const saved = localStorage.getItem('panier');
        this.items = saved ? JSON.parse(saved) : [];
    },

    notification(msg) {
        const notif = document.createElement('div');
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #d4691e;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 3000;
            font-weight: 600;
        `;
        notif.textContent = msg;
        document.body.appendChild(notif);
        
        setTimeout(() => notif.remove(), 2500);
    }
};

// Initialiser
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé, init panier');
    panier.init();
});
