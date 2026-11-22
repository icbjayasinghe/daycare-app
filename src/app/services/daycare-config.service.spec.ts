import { TestBed } from '@angular/core/testing';

import { DaycareConfigService } from './daycare-config.service';

describe('DaycareConfigService', () => {
  let service: DaycareConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DaycareConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
