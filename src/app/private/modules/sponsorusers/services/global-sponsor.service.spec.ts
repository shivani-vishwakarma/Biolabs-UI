import { TestBed } from '@angular/core/testing';

import { GlobalSponsorService } from './global-sponsor.service';

describe('GlobalSponsorService', () => {
  let service: GlobalSponsorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalSponsorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
