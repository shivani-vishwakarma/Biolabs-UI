import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiolabsmetricsdashboardComponent } from './biolabsmetricsdashboard.component';

describe('BiolabsmetricsdashboardComponent', () => {
  let component: BiolabsmetricsdashboardComponent;
  let fixture: ComponentFixture<BiolabsmetricsdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiolabsmetricsdashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiolabsmetricsdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
