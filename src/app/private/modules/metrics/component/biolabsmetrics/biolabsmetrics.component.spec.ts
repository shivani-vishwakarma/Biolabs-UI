import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiolabsmetricsComponent } from './biolabsmetrics.component';

describe('BiolabsmetricsComponent', () => {
  let component: BiolabsmetricsComponent;
  let fixture: ComponentFixture<BiolabsmetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiolabsmetricsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiolabsmetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
