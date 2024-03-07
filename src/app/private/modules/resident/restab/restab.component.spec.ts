import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestabComponent } from './restab.component';

describe('RestabComponent', () => {
  let component: RestabComponent;
  let fixture: ComponentFixture<RestabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
