import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorviewComponent } from './sponsorview.component';

describe('SponsorviewComponent', () => {
  let component: SponsorviewComponent;
  let fixture: ComponentFixture<SponsorviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponsorviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
