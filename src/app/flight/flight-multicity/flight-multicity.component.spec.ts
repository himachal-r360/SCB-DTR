import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightMulticityComponent } from './flight-multicity.component';

describe('FlightMulticityComponent', () => {
  let component: FlightMulticityComponent;
  let fixture: ComponentFixture<FlightMulticityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightMulticityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightMulticityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
