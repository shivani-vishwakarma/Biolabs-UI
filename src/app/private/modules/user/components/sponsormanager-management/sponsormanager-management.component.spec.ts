import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsormanagerManagementComponent } from './sponsormanager-management.component';

describe('SponsormanagerManagementComponent', () => {
  let component: SponsormanagerManagementComponent;
  let fixture: ComponentFixture<SponsormanagerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponsormanagerManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsormanagerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
