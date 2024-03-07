import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyOnboardingComponent } from './company-onboarding.component';

describe('CompanyOnboardingComponent', () => {
  let component: CompanyOnboardingComponent;
  let fixture: ComponentFixture<CompanyOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyOnboardingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
