import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiolabsmetricsworldwideComponent } from './biolabsmetricsworldwide.component';

describe('BiolabsmetricsworldwideComponent', () => {
  let component: BiolabsmetricsworldwideComponent;
  let fixture: ComponentFixture<BiolabsmetricsworldwideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiolabsmetricsworldwideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiolabsmetricsworldwideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
