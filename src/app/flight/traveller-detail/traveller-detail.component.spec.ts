import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravellerDetailComponent } from './traveller-detail.component';

describe('TravellerDetailComponent', () => {
  let component: TravellerDetailComponent;
  let fixture: ComponentFixture<TravellerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravellerDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravellerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
