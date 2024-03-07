import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentuserManagementComponent } from './residentuser-management.component';

describe('ResidentuserManagementComponent', () => {
  let component: ResidentuserManagementComponent;
  let fixture: ComponentFixture<ResidentuserManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResidentuserManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentuserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
