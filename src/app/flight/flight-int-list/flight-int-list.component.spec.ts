import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightIntListComponent } from './flight-int-list.component';

describe('FlightIntListComponent', () => {
  let component: FlightIntListComponent;
  let fixture: ComponentFixture<FlightIntListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightIntListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightIntListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
