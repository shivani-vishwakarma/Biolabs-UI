import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeditprofileComponent } from './speditprofile.component';

describe('SpeditprofileComponent', () => {
  let component: SpeditprofileComponent;
  let fixture: ComponentFixture<SpeditprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeditprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeditprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
