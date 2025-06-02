import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTrackingServicesComponent } from './all-tracking-services.component';

describe('AllTrackingServicesComponent', () => {
  let component: AllTrackingServicesComponent;
  let fixture: ComponentFixture<AllTrackingServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTrackingServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTrackingServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
