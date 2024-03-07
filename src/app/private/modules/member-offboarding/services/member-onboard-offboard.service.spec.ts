import { TestBed } from '@angular/core/testing';

import { CompanyOnboardOffboardService } from './member-onboard-offboard.service';

describe('CompanyOnboardOffboardService', () => {
  let service: CompanyOnboardOffboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyOnboardOffboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
