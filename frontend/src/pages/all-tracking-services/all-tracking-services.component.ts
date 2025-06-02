import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrackingService } from '../../services/tracking.service';

@Component({
  selector: 'app-all-tracking-services',
  templateUrl: './all-tracking-services.component.html',
  styleUrls: ['./all-tracking-services.component.scss']
})
export class AllTrackingServicesComponent implements OnInit {
  activeTab = 'tracking-number';
  isTrackingValid = false;
  isReferenceValid = false;
  isTCNValid = false;
  isProofValid = false;

  trackingForm: FormGroup;
  referenceForm: FormGroup;
  tcnForm: FormGroup;
  proofForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private trackingService: TrackingService
  ) {
    this.trackingForm = this.fb.group({
      trackingNumber: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.referenceForm = this.fb.group({
      referenceNumber: ['', [Validators.required, Validators.minLength(3)]],
      referenceCountry: ['', Validators.required]
    });

    this.tcnForm = this.fb.group({
      tcnNumber: ['', [Validators.required, Validators.minLength(6)]],
      shipDate: ['', Validators.required]
    });

    this.proofForm = this.fb.group({
      proofId: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    // Subscribe to form value changes to update button states
    this.trackingForm.valueChanges.subscribe(() => {
      this.isTrackingValid = this.trackingForm.valid;
    });

    this.referenceForm.valueChanges.subscribe(() => {
      this.isReferenceValid = this.referenceForm.valid;
    });

    this.tcnForm.valueChanges.subscribe(() => {
      this.isTCNValid = this.tcnForm.valid;
    });

    this.proofForm.valueChanges.subscribe(() => {
      this.isProofValid = this.proofForm.valid;
    });
  }

  showTab(tabId: string): void {
    this.activeTab = tabId;
  }

  validateInput(field: string): void {
    switch (field) {
      case 'trackingNumber':
        this.isTrackingValid = this.trackingForm.get('trackingNumber')?.value?.length >= 8;
        break;
      case 'referenceNumber':
        this.isReferenceValid = this.referenceForm.get('referenceNumber')?.value?.length >= 3 &&
                               this.referenceForm.get('referenceCountry')?.value;
        break;
      case 'tcnNumber':
        this.isTCNValid = this.tcnForm.get('tcnNumber')?.value?.length >= 6 &&
                         this.tcnForm.get('shipDate')?.value;
        break;
      case 'proofId':
        this.isProofValid = this.proofForm.get('proofId')?.value?.length >= 8;
        break;
    }
  }

  startBarcodeScanner(): void {
    if (this.isMobileDevice()) {
      // TODO: Implement barcode scanner
      console.log('Starting barcode scanner...');
      alert('Scanner de code-barres activé!\n\n(Fonctionnalité à intégrer avec l\'API caméra)');
    } else {
      alert('Le scanner de code-barres est disponible uniquement sur mobile.');
    }
  }

  trackPackage(): void {
    if (this.trackingForm.valid) {
      const trackingNumber = this.trackingForm.get('trackingNumber')?.value;
      this.trackingService.trackPackage(trackingNumber).subscribe({
        next: (result) => {
          this.router.navigate(['/tracking-results', trackingNumber]);
        },
        error: (error) => {
          console.error('Error tracking package:', error);
          alert('Une erreur est survenue lors du suivi du colis.');
        }
      });
    }
  }

  trackByReference(): void {
    if (this.referenceForm.valid) {
      const reference = this.referenceForm.get('referenceNumber')?.value;
      const country = this.referenceForm.get('referenceCountry')?.value;
      this.trackingService.trackByReference(reference, country).subscribe({
        next: (result) => {
          this.router.navigate(['/tracking-results', reference]);
        },
        error: (error) => {
          console.error('Error tracking by reference:', error);
          alert('Une erreur est survenue lors du suivi par référence.');
        }
      });
    }
  }

  trackByTCN(): void {
    if (this.tcnForm.valid) {
      const tcn = this.tcnForm.get('tcnNumber')?.value;
      const shipDate = this.tcnForm.get('shipDate')?.value;
      this.trackingService.trackByTCN(tcn, shipDate).subscribe({
        next: (result) => {
          this.router.navigate(['/tracking-results', tcn]);
        },
        error: (error) => {
          console.error('Error tracking by TCN:', error);
          alert('Une erreur est survenue lors du suivi par TCN.');
        }
      });
    }
  }

  getProofOfDelivery(): void {
    if (this.proofForm.valid) {
      const proofId = this.proofForm.get('proofId')?.value;
      this.trackingService.getProofOfDelivery(proofId).subscribe({
        next: (result) => {
          // TODO: Handle proof of delivery download
          console.log('Proof of delivery:', result);
          alert('Téléchargement de la preuve de livraison...');
        },
        error: (error) => {
          console.error('Error getting proof of delivery:', error);
          alert('Une erreur est survenue lors de la récupération de la preuve de livraison.');
        }
      });
    }
  }

  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
}
