import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorMainComponent } from './sponsor-main.component';

describe('SponsorMainComponent', () => {
  let component: SponsorMainComponent;
  let fixture: ComponentFixture<SponsorMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponsorMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
