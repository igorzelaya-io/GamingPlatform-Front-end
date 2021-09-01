import { TestBed } from '@angular/core/testing';

import { DisputedMatchService } from './disputed-match.service';

describe('DisputedMatchService', () => {
  let service: DisputedMatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisputedMatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
