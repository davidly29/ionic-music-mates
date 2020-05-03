import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongsAddingPage } from './songs-adding.page';

describe('SongsAddingPage', () => {
  let component: SongsAddingPage;
  let fixture: ComponentFixture<SongsAddingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongsAddingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongsAddingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
