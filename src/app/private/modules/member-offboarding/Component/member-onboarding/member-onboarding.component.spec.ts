import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberOnboardingComponent } from './member-onboarding.component';

describe('MemberOnboardingComponent', () => {
  let component: MemberOnboardingComponent;
  let fixture: ComponentFixture<MemberOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberOnboardingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
