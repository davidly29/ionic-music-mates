import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinLobbyPage } from './join-lobby.page';

describe('JoinLobbyPage', () => {
  let component: JoinLobbyPage;
  let fixture: ComponentFixture<JoinLobbyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinLobbyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinLobbyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
