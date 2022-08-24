import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersRetryComponent } from './orders-retry.component';

describe('OrdersRetryComponent', () => {
  let component: OrdersRetryComponent;
  let fixture: ComponentFixture<OrdersRetryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersRetryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersRetryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
