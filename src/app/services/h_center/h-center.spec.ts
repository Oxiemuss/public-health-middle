import { TestBed } from '@angular/core/testing';

import { HCenter } from './h-center';

describe('HCenter', () => {
  let service: HCenter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HCenter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
