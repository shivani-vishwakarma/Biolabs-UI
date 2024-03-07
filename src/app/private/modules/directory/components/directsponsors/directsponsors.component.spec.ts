import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectsponsorsComponent } from './directsponsors.component';

describe('DirectsponsorsComponent', () => {
  let component: DirectsponsorsComponent;
  let fixture: ComponentFixture<DirectsponsorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectsponsorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectsponsorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
