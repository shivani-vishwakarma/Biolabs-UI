import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanycardviewComponent } from './companycardview.component';

describe('CompanycardviewComponent', () => {
  let component: CompanycardviewComponent;
  let fixture: ComponentFixture<CompanycardviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanycardviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanycardviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
