import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvancedShipmentTrackingComponent } from '../pages/advanced-shipment-tracking/advanced-shipment-tracking.component';
import { TrackingResultsComponent } from '../pages/tracking-results/tracking-results.component';

const routes: Routes = [
  { path: '', redirectTo: '/tracking', pathMatch: 'full' },
  { path: 'tracking', component: AdvancedShipmentTrackingComponent },
  { path: 'tracking-results', component: TrackingResultsComponent },
  { path: 'all-tracking', loadChildren: () => import('../pages/all-tracking-services/all-tracking-services.module').then(m => m.AllTrackingServicesModule) },
  { path: 'shipping', loadChildren: () => import('../pages/shipping/shipping.module').then(m => m.ShippingModule) },
  { path: 'support', loadChildren: () => import('../pages/support/support.module').then(m => m.SupportModule) },
  { path: 'account', loadChildren: () => import('../pages/account/account.module').then(m => m.AccountModule) },
  { path: '**', redirectTo: '/tracking' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 