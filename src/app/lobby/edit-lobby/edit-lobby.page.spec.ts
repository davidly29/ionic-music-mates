import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLobbyPage } from './edit-lobby.page';

describe('EditLobbyPage', () => {
  let component: EditLobbyPage;
  let fixture: ComponentFixture<EditLobbyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLobbyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLobbyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
