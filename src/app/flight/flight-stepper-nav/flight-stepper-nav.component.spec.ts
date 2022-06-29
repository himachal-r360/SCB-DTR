import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightStepperNavComponent } from './flight-stepper-nav.component';

describe('FlightStepperNavComponent', () => {
  let component: FlightStepperNavComponent;
  let fixture: ComponentFixture<FlightStepperNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightStepperNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightStepperNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
