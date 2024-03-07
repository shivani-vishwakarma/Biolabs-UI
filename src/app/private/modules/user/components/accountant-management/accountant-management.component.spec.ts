import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountantManagementComponent } from './accountant-management.component';

describe('AccountantManagementComponent', () => {
  let component: AccountantManagementComponent;
  let fixture: ComponentFixture<AccountantManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountantManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountantManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
