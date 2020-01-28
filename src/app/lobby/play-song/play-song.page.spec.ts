import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaySongPage } from './play-song.page';

describe('PlaySongPage', () => {
  let component: PlaySongPage;
  let fixture: ComponentFixture<PlaySongPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaySongPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaySongPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
