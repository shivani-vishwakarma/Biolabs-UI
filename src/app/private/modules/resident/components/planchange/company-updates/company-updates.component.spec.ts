import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyUpdatesComponent } from './company-updates.component';

describe('KeycompanyComponent', () => {
  let component: CompanyUpdatesComponent;
  let fixture: ComponentFixture<CompanyUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyUpdatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
