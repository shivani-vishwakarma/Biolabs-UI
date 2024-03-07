import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpusertabComponent } from './spusertab.component';

describe('SpusertabComponent', () => {
  let component: SpusertabComponent;
  let fixture: ComponentFixture<SpusertabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpusertabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpusertabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
