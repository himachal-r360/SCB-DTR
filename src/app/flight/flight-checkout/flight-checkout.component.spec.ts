import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDetailComponent } from './flight-checkout.component';

describe('FlightCheckoutComponent', () => {
  let component: FlightCheckoutComponent;
  let fixture: ComponentFixture<FlightCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
