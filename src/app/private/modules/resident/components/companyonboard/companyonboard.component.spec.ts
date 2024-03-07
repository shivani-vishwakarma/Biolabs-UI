import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyonboardComponent } from './companyonboard.component';

describe('CompanyonboardComponent', () => {
  let component: CompanyonboardComponent;
  let fixture: ComponentFixture<CompanyonboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyonboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyonboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
