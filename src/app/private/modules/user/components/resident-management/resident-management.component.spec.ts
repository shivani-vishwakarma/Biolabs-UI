import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentManagementComponent } from './resident-management.component';

describe('ResidentManagementComponent', () => {
  let component: ResidentManagementComponent;
  let fixture: ComponentFixture<ResidentManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResidentManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
