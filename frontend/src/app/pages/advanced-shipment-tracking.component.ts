import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Structure d’un envoi (tu peux la séparer dans un fichier interface plus tard)
interface Shipment {
  id: number;
  tracking: string;
  status: 'delivered' | 'in-transit' | 'exception' | 'pending';
  deliveryDate: string;
  deliveryTime: string;
  shipper: string;
  destination: string;
  reference: string;
  weight: string;
  service: string;
}

@Component({
  selector: 'app-tracking-dashboard',
  templateUrl: './tracking-dashboard.component.html',
  styleUrls: ['./tracking-dashboard.component.css']
})
export class TrackingDashboardComponent implements OnInit {
  shipments: Shipment[] = []; // toutes les données
  filteredShipments: Shipment[] = []; // après filtre

  selectedShipment: Shipment | null = null; // pour modal détail
  isModalOpen: boolean = false;

  // Statistiques (cartes du haut)
  stats = {
    delivered: 0,
    exception: 0,
    pending: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadShipments(); // Au chargement
  }

  /**
   * Charge les envois depuis FastAPI (à remplacer par l’URL réelle)
   */
  loadShipments(): void {
    // 👉 À remplacer par FastAPI : ex. http://localhost:8000/api/shipments
    // this.http.get<Shipment[]>('http://localhost:8000/api/shipments').subscribe(data => {
    //   this.shipments = data;
    //   this.filteredShipments = [...data];
    //   this.updateStats();
    // });

    // Pour l’instant, données mockées
    this.shipments = [
      {
        id: 1,
        tracking: 'GBX123456789',
        status: 'delivered',
        deliveryDate: '2025-05-24',
        deliveryTime: '14:30',
        shipper: 'Tech Solutions Inc',
        destination: 'Paris, France',
        reference: 'REF001',
        weight: '2.5 kg',
        service: 'Express'
      },
      {
        id: 2,
        tracking: 'GBX987654321',
        status: 'in-transit',
        deliveryDate: '2025-05-26',
        deliveryTime: '16:00',
        shipper: 'Global Trade Corp',
        destination: 'Madrid, Spain',
        reference: 'REF002',
        weight: '1.8 kg',
        service: 'Standard'
      },
      {
        id: 3,
        tracking: 'GBX456789123',
        status: 'exception',
        deliveryDate: '2025-05-25',
        deliveryTime: '10:00',
        shipper: 'Express Logistics',
        destination: 'Berlin, Germany',
        reference: 'REF003',
        weight: '3.2 kg',
        service: 'Priority'
      },
      {
        id: 4,
        tracking: 'GBX789123456',
        status: 'delivered',
        deliveryDate: '2025-05-23',
        deliveryTime: '09:15',
        shipper: 'International Shipping',
        destination: 'Rome, Italy',
        reference: 'REF004',
        weight: '0.9 kg',
        service: 'Express'
      }
    ];

    this.filteredShipments = [...this.shipments];
    this.updateStats();
  }

  /**
   * Affiche la modal de détail (vue 👁️)
   */
  viewShipmentDetails(shipment: Shipment): void {
    this.selectedShipment = shipment;
    this.isModalOpen = true;
  }

  /**
   * Ferme la modal de détail
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedShipment = null;
  }

  /**
   * Met à jour les cartes statistiques (exceptions, créées, livrées)
   */
  updateStats(): void {
    this.stats = {
      delivered: this.shipments.filter(s => s.status === 'delivered').length,
      exception: this.shipments.filter(s => s.status === 'exception').length,
      pending: this.shipments.filter(s => s.status === 'pending').length
    };
  }

  /**
   * Exemple de filtre par statut
   */
  filterByStatus(status: Shipment['status']): void {
    this.filteredShipments = this.shipments.filter(s => s.status === status);
  }

  /**
   * Réinitialise les filtres
   */
  resetFilters(): void {
    this.filteredShipments = [...this.shipments];
  }

  /**
   * Exemple d'export JSON — peut être amélioré pour CSV/PDF
   */
  exportData(): void {
    const dataStr = JSON.stringify(this.filteredShipments, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'shipments-export.json';
    anchor.click();

    window.URL.revokeObjectURL(url);
  }

  // 🧠 BACKEND SUGGESTION :
  // FastAPI endpoint: GET /api/shipments, GET /api/shipments/{id}
  // Base de données : table `shipments` avec colonnes (id, tracking, status, etc.)
  // ORM recommandé : SQLModel, TortoiseORM, ou même SQLAlchemy classique
}
