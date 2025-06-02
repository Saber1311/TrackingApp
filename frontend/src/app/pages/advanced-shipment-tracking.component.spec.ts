import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedShipmentTrackingComponent } from './advanced-shipment-tracking.component';

describe('AdvancedShipmentTrackingComponent', () => {
  let component: AdvancedShipmentTrackingComponent;
  let fixture: ComponentFixture<AdvancedShipmentTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedShipmentTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedShipmentTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
