import { TestBed } from '@angular/core/testing';

import { UserchallengesService } from './userchallenges.service';

describe('UserchallengesService', () => {
  let service: UserchallengesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserchallengesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
