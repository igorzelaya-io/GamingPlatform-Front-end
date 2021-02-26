import { TestBed } from '@angular/core/testing';

import { TeamTournamentService } from './team-tournament.service';

describe('TeamTournamentService', () => {
  let service: TeamTournamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamTournamentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
