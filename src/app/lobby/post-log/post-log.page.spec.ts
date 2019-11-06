import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostLogPage } from './post-log.page';

describe('PostLogPage', () => {
  let component: PostLogPage;
  let fixture: ComponentFixture<PostLogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostLogPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
