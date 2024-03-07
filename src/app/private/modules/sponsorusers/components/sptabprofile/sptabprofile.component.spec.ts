import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SptabprofileComponent } from './sptabprofile.component';

describe('SptabprofileComponent', () => {
  let component: SptabprofileComponent;
  let fixture: ComponentFixture<SptabprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SptabprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SptabprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
