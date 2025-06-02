import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // === Champs du formulaire de tracking
  trackingNumber: string = '';

  // === Auth fake pour afficher outils avancés (à remplacer plus tard)
  isLoggedIn = true;

  // === Notifications en file d'attente
  currentNotifs: any[] = [];

  // === Liste d’actualités (fake pour le moment)
  news = [
    {
      title: 'Ouverture d’un hub logistique à Casablanca',
      summary: 'Un nouveau centre ultra rapide pour livraisons au Maroc.',
      date: '2025-05-20',
      slug: 'hub-casablanca',
      imageUrl: '/assets/news/casablanca-hub.jpg'
    },
    {
      title: 'Nouvelles fonctionnalités de tracking GPS',
      summary: 'Vous pouvez maintenant suivre votre colis en temps réel !',
      date: '2025-05-14',
      slug: 'tracking-gps',
      imageUrl: '/assets/news/tracking-gps.jpg'
    },
    {
      title: 'Globex + FastAPI : API REST live',
      summary: 'Notre backend en FastAPI est maintenant disponible en prod.',
      date: '2025-04-30',
      slug: 'fastapi-integration',
      imageUrl: '/assets/news/api-rest-fastapi.jpg'
    }
  ];

  // === Liste FAQ affichée dans l'accordéon
  faqList = [
    {
      question: 'Comment suivre mon colis ?',
      answer: 'Utilisez le champ de tracking en haut de page pour saisir votre numéro.',
      open: false
    },
    {
      question: 'Puis-je suivre plusieurs colis ?',
      answer: 'Oui via l’outil “Multi-tracking” accessible après connexion.',
      open: false
    },
    {
      question: 'Comment contacter le support Globex ?',
      answer: 'Utilisez la section “Besoin d’aide” ou accédez à la page de contact.',
      open: false
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.autoPushNotifications();
  }

  // === TRAITEMENT TRACKING
  trackPackage(): void {
    if (!this.trackingNumber.trim()) return;

    this.addNotification(
      'success',
      'Recherche en cours',
      `Recherche du colis #${this.trackingNumber}...`
    );

    setTimeout(() => {
      // TODO: remplacer par appel vers FastAPI → GET /api/tracking/:id
      this.addNotification(
        'success',
        'Colis trouvé',
        `Colis #${this.trackingNumber} en transit.`
      );

      // Rediriger vers la page résultat
      this.router.navigate(['/tracking/result', this.trackingNumber]);
    }, 2000);
  }

  // === AJOUTER NOTIFICATION FLOTTANTE
  addNotification(type: string, title: string, message: string): void {
    const notif = { type, title, message };
    this.currentNotifs.push(notif);

    // Retirer au bout de 5 secondes
    setTimeout(() => this.removeNotification(notif), 5000);
  }

  // === SUPPRIMER NOTIF
  removeNotification(notif: any): void {
    this.currentNotifs = this.currentNotifs.filter(n => n !== notif);
  }

  // === NOTIFICATIONS AUTO (ex: alerte livraison)
  autoPushNotifications(): void {
    const auto = [
      {
        type: 'success',
        title: 'Livraison prévue',
        message: 'Votre colis #GBX845 arrivera entre 10h et 13h.'
      },
      {
        type: 'warning',
        title: 'Retard possible',
        message: 'Retard signalé sur le colis #GBX999 (météo).'
      }
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < auto.length) {
        this.addNotification(auto[i].type, auto[i].title, auto[i].message);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 8000);
  }

  // === FONCTION POUR FAQ ACCORDÉON
  toggleFAQ(faq: any): void {
    faq.open = !faq.open;
  }
}
