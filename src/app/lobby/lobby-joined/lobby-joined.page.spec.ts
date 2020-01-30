import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyJoinedPage } from './lobby-joined.page';

describe('LobbyJoinedPage', () => {
  let component: LobbyJoinedPage;
  let fixture: ComponentFixture<LobbyJoinedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyJoinedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyJoinedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
