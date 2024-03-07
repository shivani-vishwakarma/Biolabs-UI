import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyresidenttableComponent } from './companyresidenttable.component';

describe('CompanyresidenttableComponent', () => {
  let component: CompanyresidenttableComponent;
  let fixture: ComponentFixture<CompanyresidenttableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyresidenttableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyresidenttableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
