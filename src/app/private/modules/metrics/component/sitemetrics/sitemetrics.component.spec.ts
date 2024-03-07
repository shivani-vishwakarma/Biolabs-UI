import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitemetricsComponent } from './sitemetrics.component';

describe('SitemetricsComponent', () => {
  let component: SitemetricsComponent;
  let fixture: ComponentFixture<SitemetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SitemetricsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SitemetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
