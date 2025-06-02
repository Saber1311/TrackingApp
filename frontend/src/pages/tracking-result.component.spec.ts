import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingResultComponent } from './tracking-result.component';

describe('TrackingResultComponent', () => {
  let component: TrackingResultComponent;
  let fixture: ComponentFixture<TrackingResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackingResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
