import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanytableComponent } from './companytable.component';

describe('CompanytableComponent', () => {
  let component: CompanytableComponent;
  let fixture: ComponentFixture<CompanytableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanytableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanytableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
