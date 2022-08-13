import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusDetailComponent } from './bus-checkout.component';

describe('BusCheckoutComponent', () => {
  let component: BusCheckoutComponent;
  let fixture: ComponentFixture<BusCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
