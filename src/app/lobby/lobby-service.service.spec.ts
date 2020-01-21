import { TestBed } from '@angular/core/testing';

import { LobbyServiceService } from './lobby-service.service';

describe('LobbyServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LobbyServiceService = TestBed.get(LobbyServiceService);
    expect(service).toBeTruthy();
  });
});
