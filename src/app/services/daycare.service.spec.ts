import { TestBed } from '@angular/core/testing';

import { DaycareService } from './daycare.service';

describe('DaycareService', () => {
  let service: DaycareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DaycareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
