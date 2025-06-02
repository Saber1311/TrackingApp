import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TrackingService } from '../services/tracking.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-tracking-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracking-result.component.html',
  styleUrls: ['./tracking-result.component.scss']
})
export class TrackingResultComponent implements OnInit, AfterViewInit {
  trackingId: string = '';
  trackingData: any = null;
  isLoading = true;
  error: string | null = null;
  isLoggedIn = true; // 🔐 simulation temporaire

  @ViewChild('mapBox', { static: false }) mapElement!: ElementRef;
  private map!: L.Map;

  constructor(
    private route: ActivatedRoute,
    private trackingService: TrackingService
  ) {}

  ngOnInit(): void {
    this.trackingId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.trackingId) {
      this.error = 'Numéro de suivi introuvable.';
      this.isLoading = false;
      return;
    }

    this.trackingService.getTrackingInfo(this.trackingId).subscribe({
      next: (data: any) => {
        console.log('🛰️ Données reçues:', data);
        this.trackingData = data;
        this.isLoading = false;
        setTimeout(() => this.initMap(), 0); // Initialise la carte après chargement DOM
      },
      error: (err: any) => {
        console.error('❌ Erreur backend:', err);
        this.error = 'Colis non trouvé ou erreur serveur.';
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // ❗La map sera initialisée dynamiquement une fois les données chargées via setTimeout
  }

  private initMap(): void {
    if (!this.trackingData?.location) return;

    const { latitude, longitude, name } = this.trackingData.location;

    this.map = L.map(this.mapElement.nativeElement).setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([latitude, longitude])
      .addTo(this.map)
      .bindPopup(name)
      .openPopup();
  }

  printPage(): void {
    window.print();
  }

  isCurrentStep(index: number): boolean {
    const steps = this.trackingData?.steps;
    if (!steps) return false;
    return !steps[index].completed &&
           (index === 0 || steps[index - 1]?.completed);
  }

  getIconForStep(label: string): string {
    switch (label.toLowerCase()) {
      case 'order processed': return 'fa-check';
      case 'picked up': return 'fa-box';
      case 'in transit': return 'fa-truck-moving';
      case 'out for delivery': return 'fa-route';
      case 'delivered': return 'fa-flag-checkered';
      default: return 'fa-circle';
    }
  }

  shareTracking(): void {
    const link = window.location.href;
    if (navigator.share) {
      navigator.share({ title: 'Globex Tracking', url: link });
    } else {
      navigator.clipboard.writeText(link);
      alert('Lien copié dans le presse-papiers !');
    }
  }

  saveToFavorites(): void {
    alert('Ajouté à vos favoris (simulé)');
  }

  scheduleDelivery(): void {
  const date = prompt('📅 Entrez la date (format ISO ex: 2024-12-20T10:30:00)');
  if (!date) return;

  this.trackingService.scheduleDelivery(this.trackingId, date).subscribe({
    next: (res) => {
      alert(`📦 Livraison planifiée pour le ${date} !`);

      // 🔁 Recharger les données depuis le backend
      this.trackingService.getTrackingInfo(this.trackingId).subscribe({
        next: (updatedData) => {
          this.trackingData = updatedData; // 🧠 Rafraîchit le contenu affiché
          console.log('🔄 trackingData mis à jour :', updatedData);
        },
        error: () => {
          console.warn('⚠️ Erreur lors du refresh de trackingData');
        }
      });
    },
    error: (err) => {
      console.error('❌ Erreur backend :', err);
      alert('Erreur lors de la planification.');
    }
  });
}


changeAddress(): void {
 alert(' (TODO modal)');
}

  holdAtLocation(): void {
    alert('Conserver en agence (TODO modal)');
  }

  addInstructions(): void {
    alert('Ajout d’instructions (TODO modal)');
  }
}
