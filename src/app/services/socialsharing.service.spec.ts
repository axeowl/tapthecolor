import { TestBed } from '@angular/core/testing';

import { SocialsharingService } from './socialsharing.service';

describe('SocialsharingService', () => {
  let service: SocialsharingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialsharingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
