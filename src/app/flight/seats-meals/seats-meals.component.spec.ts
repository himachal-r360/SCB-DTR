import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatsMealsComponent } from './seats-meals.component';

describe('SeatsMealsComponent', () => {
  let component: SeatsMealsComponent;
  let fixture: ComponentFixture<SeatsMealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeatsMealsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatsMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
