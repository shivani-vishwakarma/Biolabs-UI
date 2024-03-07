import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpviewprofileComponent } from './spviewprofile.component';

describe('SpviewprofileComponent', () => {
  let component: SpviewprofileComponent;
  let fixture: ComponentFixture<SpviewprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpviewprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpviewprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
