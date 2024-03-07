import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpdataComponent } from './spdata.component';

describe('SpdataComponent', () => {
  let component: SpdataComponent;
  let fixture: ComponentFixture<SpdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpdataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
