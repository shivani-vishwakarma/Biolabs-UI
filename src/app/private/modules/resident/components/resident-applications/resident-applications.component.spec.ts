import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentApplicationsComponent } from './resident-applications.component';

describe('ResidentApplicationsComponent', () => {
  let component: ResidentApplicationsComponent;
  let fixture: ComponentFixture<ResidentApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResidentApplicationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
