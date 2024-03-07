import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanchangeComponent } from './planchange.component';

describe('PlanchangeComponent', () => {
  let component: PlanchangeComponent;
  let fixture: ComponentFixture<PlanchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanchangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
