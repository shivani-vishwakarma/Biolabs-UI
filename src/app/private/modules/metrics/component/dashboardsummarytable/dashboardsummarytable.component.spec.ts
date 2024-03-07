import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardsummarytableComponent } from './dashboardsummarytable.component';

describe('DashboardsummarytableComponent', () => {
  let component: DashboardsummarytableComponent;
  let fixture: ComponentFixture<DashboardsummarytableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardsummarytableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardsummarytableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
