import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectmembersComponent } from './directmembers.component';

describe('DirectmembersComponent', () => {
  let component: DirectmembersComponent;
  let fixture: ComponentFixture<DirectmembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectmembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectmembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
