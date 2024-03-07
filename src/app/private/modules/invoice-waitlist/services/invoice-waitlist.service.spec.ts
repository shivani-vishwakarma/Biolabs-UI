import { TestBed } from '@angular/core/testing';

import { InvoiceWaitlistService } from './invoice-waitlist.service';

describe('InvoiceWaitlistService', () => {
  let service: InvoiceWaitlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceWaitlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
