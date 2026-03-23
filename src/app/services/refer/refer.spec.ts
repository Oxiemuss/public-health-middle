import { TestBed } from '@angular/core/testing';

import { Refer } from '../refer/refer';

describe('Refer', () => {
  let service: Refer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Refer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
