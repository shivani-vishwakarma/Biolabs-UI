import { TestBed } from '@angular/core/testing';

import { EventsHubService } from './events-hub.service';

describe('EventsHubService', () => {
  let service: EventsHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventsHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
