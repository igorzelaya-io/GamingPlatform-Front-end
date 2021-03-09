import { TestBed } from '@angular/core/testing';

import { TeamImageService } from './team-image.service';

describe('TeamImageService', () => {
  let service: TeamImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
