import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipChangesComponent } from './membership-changes.component';

describe('MembershipChangesComponent', () => {
  let component: MembershipChangesComponent;
  let fixture: ComponentFixture<MembershipChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembershipChangesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
