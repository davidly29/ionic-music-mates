import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSongsPage } from './add-songs.page';

describe('AddSongsPage', () => {
  let component: AddSongsPage;
  let fixture: ComponentFixture<AddSongsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSongsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSongsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
