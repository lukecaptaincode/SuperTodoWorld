import { TestBed } from '@angular/core/testing';

import { AdMobFreeService } from './ad-mob-free.service';

describe('AdMobFreeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdMobFreeService = TestBed.get(AdMobFreeService);
    expect(service).toBeTruthy();
  });
});
