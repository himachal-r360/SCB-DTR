import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightRoundtripListComponent } from './flight-roundtrip-list.component';

describe('FlightRoundtripListComponent', () => {
  let component: FlightRoundtripListComponent;
  let fixture: ComponentFixture<FlightRoundtripListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightRoundtripListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightRoundtripListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
