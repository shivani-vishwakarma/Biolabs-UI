import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventtrainigComponent } from './eventtrainig.component';

describe('EventtrainigComponent', () => {
  let component: EventtrainigComponent;
  let fixture: ComponentFixture<EventtrainigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventtrainigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventtrainigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
