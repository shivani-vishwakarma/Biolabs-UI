import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteconfigureComponent } from './siteconfigure.component';

describe('SiteconfigureComponent', () => {
  let component: SiteconfigureComponent;
  let fixture: ComponentFixture<SiteconfigureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteconfigureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteconfigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
