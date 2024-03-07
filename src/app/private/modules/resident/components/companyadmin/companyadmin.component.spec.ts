import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyadminComponent } from './companyadmin.component';

describe('CompanyadminComponent', () => {
  let component: CompanyadminComponent;
  let fixture: ComponentFixture<CompanyadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyadminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
