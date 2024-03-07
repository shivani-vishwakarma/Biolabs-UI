import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceWaitlistComponent } from './invoice-waitlist.component';

describe('InvoiceWaitlistComponent', () => {
  let component: InvoiceWaitlistComponent;
  let fixture: ComponentFixture<InvoiceWaitlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceWaitlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceWaitlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
