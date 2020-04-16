import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BleDeviceScanComponent } from './ble-device-scan.component';

describe('BleDeviceScanComponent', () => {
  let component: BleDeviceScanComponent;
  let fixture: ComponentFixture<BleDeviceScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BleDeviceScanComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BleDeviceScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
