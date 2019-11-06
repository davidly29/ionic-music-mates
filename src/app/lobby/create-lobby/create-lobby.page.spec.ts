import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLobbyPage } from './create-lobby.page';

describe('CreateLobbyPage', () => {
  let component: CreateLobbyPage;
  let fixture: ComponentFixture<CreateLobbyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLobbyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLobbyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
