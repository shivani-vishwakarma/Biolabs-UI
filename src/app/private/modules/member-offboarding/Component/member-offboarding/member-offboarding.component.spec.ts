import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberOffboardingComponent } from './member-offboarding.component';

describe('MemberOffboardingComponent', () => {
  let component: MemberOffboardingComponent;
  let fixture: ComponentFixture<MemberOffboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberOffboardingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberOffboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
