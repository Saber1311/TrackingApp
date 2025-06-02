import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface TrackingInfo {
  trackingId: string;
  status: string;
  estimatedDelivery: string;
  currentLocation: string;
  history: TrackingHistory[];
  carrier: string;
  service: string;
  recipient: {
    name: string;
    address: string;
  };
}

export interface TrackingHistory {
  date: string;
  status: string;
  location: string;
  description: string;
}

export interface TrackingByReference {
  reference: string;
  email: string;
}

export interface TrackingByEmail {
  email: string;
}

export interface TrackingResult {
  trackingNumber: string;
  status: string;
  location: string;
  timestamp: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class TrackingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Suivi par numéro de tracking
  getTrackingInfo(id: string): Observable<TrackingInfo> {
    return this.http.get<TrackingInfo>(`${this.apiUrl}/${id}`);
  }

  // Suivi par référence de commande
  getTrackingByReference(data: TrackingByReference): Observable<TrackingInfo[]> {
    return this.http.post<TrackingInfo[]>(`${this.apiUrl}/by-reference`, data);
  }

  // Suivi par email
  getTrackingByEmail(data: TrackingByEmail): Observable<TrackingInfo[]> {
    return this.http.post<TrackingInfo[]>(`${this.apiUrl}/by-email`, data);
  }

  // Planification de livraison
  scheduleDelivery(trackingId: string, date: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${trackingId}/schedule`, { date });
  }

  // Suivi multiple
  getMultipleTracking(trackingIds: string[]): Observable<TrackingInfo[]> {
    return this.http.post<TrackingInfo[]>(`${this.apiUrl}/multiple`, { trackingIds });
  }

  // Export des données de suivi
  exportTrackingData(trackingIds: string[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export`, { trackingIds }, {
      responseType: 'blob'
    });
  }

  // Vérification de la validité d'un numéro de tracking
  validateTrackingNumber(trackingId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/validate/${trackingId}`);
  }

  // Obtenir la carte de suivi en temps réel
  getTrackingMap(trackingId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${trackingId}/map`);
  }

  trackPackage(trackingNumber: string): Observable<TrackingResult> {
    return this.http.get<TrackingResult>(`${this.apiUrl}/tracking/${trackingNumber}`);
  }

  trackByReference(reference: string, country: string): Observable<TrackingResult> {
    return this.http.get<TrackingResult>(`${this.apiUrl}/tracking/reference`, {
      params: { reference, country }
    });
  }

  trackByTCN(tcn: string, shipDate: string): Observable<TrackingResult> {
    return this.http.get<TrackingResult>(`${this.apiUrl}/tracking/tcn`, {
      params: { tcn, shipDate }
    });
  }

  getProofOfDelivery(trackingId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/tracking/proof/${trackingId}`, {
      responseType: 'blob'
    });
  }
}
