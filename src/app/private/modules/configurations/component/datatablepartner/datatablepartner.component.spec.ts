import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatablepartnerComponent } from './datatablepartner.component';

describe('DatatablepartnerComponent', () => {
  let component: DatatablepartnerComponent;
  let fixture: ComponentFixture<DatatablepartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatatablepartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatablepartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
