import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessmanagerManagementComponent } from './businessmanager-management.component';

describe('BusinessmanagerManagementComponent', () => {
  let component: BusinessmanagerManagementComponent;
  let fixture: ComponentFixture<BusinessmanagerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessmanagerManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessmanagerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
