import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentmetricsComponent } from './residentmetrics.component';

describe('ResidentmetricsComponent', () => {
  let component: ResidentmetricsComponent;
  let fixture: ComponentFixture<ResidentmetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResidentmetricsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentmetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
