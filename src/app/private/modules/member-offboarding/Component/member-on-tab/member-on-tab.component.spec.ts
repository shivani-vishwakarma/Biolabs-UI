import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberOnTabComponent } from './member-on-tab.component';

describe('MemberOnTabComponent', () => {
  let component: MemberOnTabComponent;
  let fixture: ComponentFixture<MemberOnTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberOnTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberOnTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
