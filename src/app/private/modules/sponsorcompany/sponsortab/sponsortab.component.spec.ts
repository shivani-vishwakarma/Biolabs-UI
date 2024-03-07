import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsortabComponent } from './sponsortab.component';

describe('SponsortabComponent', () => {
  let component: SponsortabComponent;
  let fixture: ComponentFixture<SponsortabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponsortabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsortabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
