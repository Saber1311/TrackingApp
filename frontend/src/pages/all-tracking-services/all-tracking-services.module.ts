import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllTrackingServicesComponent } from './all-tracking-services.component';

const routes: Routes = [
  { path: '', component: AllTrackingServicesComponent }
];

@NgModule({
  declarations: [
    AllTrackingServicesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AllTrackingServicesModule { } 