import { TestBed } from '@angular/core/testing';

import { UserTournamentService } from './user-tournament.service';

describe('UserTournamentService', () => {
  let service: UserTournamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTournamentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
