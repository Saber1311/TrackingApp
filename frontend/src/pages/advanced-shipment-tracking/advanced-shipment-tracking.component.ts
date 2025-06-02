import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-advanced-shipment-tracking',
  templateUrl: './advanced-shipment-tracking.component.html',
  styleUrls: ['./advanced-shipment-tracking.component.scss']
})
export class AdvancedShipmentTrackingComponent implements OnInit {
  currentLanguage: string = 'FR';
  isLanguageMenuOpen: boolean = false;
  isSearchOpen: boolean = false;
  
  // Form data
  trackingNumber: string = '';
  shipmentType: string = '';
  enableAlerts: boolean = false;
  enableAnalytics: boolean = false;
  selectedLanguage: string = 'fr';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize component
  }

  toggleLanguageMenu(): void {
    this.isLanguageMenuOpen = !this.isLanguageMenuOpen;
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
  }

  changeLanguage(): void {
    // Update current language based on selection
    this.currentLanguage = this.selectedLanguage.toUpperCase();
    this.isLanguageMenuOpen = false;
    
    // Here you would typically implement language change logic
    // For example, using a translation service
  }

  trackShipment(): void {
    if (this.trackingNumber && this.shipmentType) {
      // Navigate to tracking results with the tracking number
      this.router.navigate(['/tracking-results'], {
        queryParams: {
          number: this.trackingNumber,
          type: this.shipmentType,
          alerts: this.enableAlerts,
          analytics: this.enableAnalytics
        }
      });
    }
  }
} 