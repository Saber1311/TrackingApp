import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdvancedShipmentTrackingComponent } from '../pages/advanced-shipment-tracking/advanced-shipment-tracking.component';

@NgModule({
  declarations: [
    AppComponent,
    AdvancedShipmentTrackingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 