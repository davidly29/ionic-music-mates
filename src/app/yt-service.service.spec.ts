import { TestBed } from '@angular/core/testing';

import { YtServiceService } from './yt-service.service';

describe('YtServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YtServiceService = TestBed.get(YtServiceService);
    expect(service).toBeTruthy();
  });
});
