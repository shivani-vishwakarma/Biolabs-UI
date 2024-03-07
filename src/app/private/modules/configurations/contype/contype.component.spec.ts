import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContypeComponent } from './contype.component';

describe('ContypeComponent', () => {
  let component: ContypeComponent;
  let fixture: ComponentFixture<ContypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
