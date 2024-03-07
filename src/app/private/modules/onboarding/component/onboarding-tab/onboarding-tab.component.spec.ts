import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingTabComponent } from './onboarding-tab.component';

describe('OnboardingTabComponent', () => {
  let component: OnboardingTabComponent;
  let fixture: ComponentFixture<OnboardingTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
