import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersponsorComponent } from './partnersponsor.component';

describe('PartnersponsorComponent', () => {
  let component: PartnersponsorComponent;
  let fixture: ComponentFixture<PartnersponsorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnersponsorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnersponsorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
