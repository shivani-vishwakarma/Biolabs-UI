import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectsiteComponent } from './directsite.component';

describe('DirectsiteComponent', () => {
  let component: DirectsiteComponent;
  let fixture: ComponentFixture<DirectsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectsiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
