import { TestBed, inject } from '@angular/core/testing';

import { LsCartService } from './lscart.service';

describe('LsCartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LsCartService]
    });
  });

  it('should be created', inject([LsCartService], (service: LsCartService) => {
    expect(service).toBeTruthy();
  }));
});
