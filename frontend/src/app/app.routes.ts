import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { TrackingResultsComponent } from '../pages/tracking-results/tracking-results.component';
import { AllTrackingServicesComponent } from '../pages/all-tracking-services/all-tracking-services.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tracking-results/:id', component: TrackingResultsComponent },
  { path: 'all-tracking', component: AllTrackingServicesComponent },
  { path: '**', redirectTo: '' }
];
