import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatablesponsorComponent } from './datatablesponsor.component';

describe('DatatablesponsorComponent', () => {
  let component: DatatablesponsorComponent;
  let fixture: ComponentFixture<DatatablesponsorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatatablesponsorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatablesponsorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
