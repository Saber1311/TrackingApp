import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface TrackingResult {
  id: string;
  status: string;
  lastUpdate: string;
  estimatedDelivery: string;
  location: string;
  details: string[];
}

@Component({
  selector: 'app-tracking-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tracking-results.component.html',
  styleUrls: ['./tracking-results.component.scss']
})
export class TrackingResultsComponent implements OnInit {
  trackingResult: TrackingResult | null = null;
  loading = true;
  error = false;

  // Tab management
  activeTab: string = 'tracking-number';

  // Form data
  trackingNumber: string = '';
  referenceNumber: string = '';
  tcnNumber: string = '';
  shipDate: string = '';
  proofId: string = '';
  referenceCountry: string = '';
  selectedLanguage: string = 'fr';

  // Validation
  isValid: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get tracking number from query params
    this.route.queryParams.subscribe(params => {
      if (params['number']) {
        this.trackingNumber = params['number'];
        this.loadTrackingResult(this.trackingNumber);
      }
    });
  }

  loadTrackingResult(trackingId: string): void {
    this.loading = true;
    this.error = false;

    // Simulate API call
    setTimeout(() => {
      this.trackingResult = {
        id: trackingId,
        status: 'IN_TRANSIT',
        lastUpdate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 86400000).toISOString(),
        location: 'Paris, France',
        details: [
          'Package picked up',
          'In transit to sorting facility',
          'Arrived at sorting facility'
        ]
      };
      this.loading = false;
    }, 1000);
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'DELIVERED': 'status-delivered',
      'IN_TRANSIT': 'status-transit',
      'PENDING': 'status-pending',
      'EXCEPTION': 'status-exception'
    };
    return statusMap[status] || 'status-default';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  // Tab management
  showTab(tabName: string): void {
    this.activeTab = tabName;
  }

  // Form validation
  validateInput(): void {
    switch (this.activeTab) {
      case 'tracking-number':
        this.isValid = this.trackingNumber.length > 0;
        break;
      case 'track-reference':
        this.isValid = this.referenceNumber.length > 0 && this.referenceCountry.length > 0;
        break;
      case 'track-tcn':
        this.isValid = this.tcnNumber.length > 0 && this.shipDate.length > 0;
        break;
      case 'proof-delivery':
        this.isValid = this.proofId.length > 0;
        break;
    }
  }

  // Form submissions
  trackPackage(): void {
    if (this.isValid) {
      this.loadTrackingResult(this.trackingNumber);
    }
  }

  trackByReference(): void {
    if (this.isValid) {
      console.log('Tracking by reference:', this.referenceNumber, this.referenceCountry);
    }
  }

  trackByTCN(): void {
    if (this.isValid) {
      console.log('Tracking by TCN:', this.tcnNumber, this.shipDate);
    }
  }

  getProofOfDelivery(): void {
    if (this.isValid) {
      console.log('Getting proof of delivery:', this.proofId);
    }
  }

  // Scanner functionality
  startBarcodeScanner(): void {
    console.log('Starting barcode scanner');
  }

  // Language management
  changeLanguage(): void {
    console.log('Changing language to:', this.selectedLanguage);
  }
} 