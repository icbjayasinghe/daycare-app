import { TestBed } from '@angular/core/testing';

import { FundingProgramsService } from './funding-programs.service';

describe('FundingProgramsService', () => {
  let service: FundingProgramsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundingProgramsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
