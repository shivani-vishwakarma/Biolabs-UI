import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewChangesComponent } from './review-changes.component';

describe('SummarychangeComponent', () => {
  let component: ReviewChangesComponent;
  let fixture: ComponentFixture<ReviewChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewChangesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
