import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyOffboardingComponent } from './company-offboarding.component';

describe('CompanyOffboardingComponent', () => {
  let component: CompanyOffboardingComponent;
  let fixture: ComponentFixture<CompanyOffboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyOffboardingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyOffboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
