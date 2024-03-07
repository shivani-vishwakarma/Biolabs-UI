import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponosreditComponent } from './sponosredit.component';

describe('SponosreditComponent', () => {
  let component: SponosreditComponent;
  let fixture: ComponentFixture<SponosreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponosreditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponosreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
