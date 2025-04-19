import { TestBed } from '@angular/core/testing';

import { MarablesService } from './marables.service';

describe('MarablesService', () => {
  let service: MarablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
