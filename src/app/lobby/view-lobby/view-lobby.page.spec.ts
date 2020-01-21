import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLobbyPage } from './view-lobby.page';

describe('ViewLobbyPage', () => {
  let component: ViewLobbyPage;
  let fixture: ComponentFixture<ViewLobbyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLobbyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLobbyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
