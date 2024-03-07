import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpprofileComponent } from './spprofile.component';

describe('SpprofileComponent', () => {
  let component: SpprofileComponent;
  let fixture: ComponentFixture<SpprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
