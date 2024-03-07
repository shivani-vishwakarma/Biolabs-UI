import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentApplicationFormComponent } from './resident-application-form.component';

describe('ResidentApplicationFormComponent', () => {
  let component: ResidentApplicationFormComponent;
  let fixture: ComponentFixture<ResidentApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResidentApplicationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
