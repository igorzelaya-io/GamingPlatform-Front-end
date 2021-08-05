import { TestBed } from '@angular/core/testing';

import { TeamChallengeService } from './team-challenge.service';

describe('TeamChallengeService', () => {
  let service: TeamChallengeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamChallengeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
